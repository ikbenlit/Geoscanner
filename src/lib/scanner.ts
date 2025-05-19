import { parse as parseUrl } from 'url';
import { XMLParser } from 'fast-xml-parser';
import { createHash } from 'crypto';
import { analyzeCrawlAccess, CrawlAccessResult } from './modules/crawl-access';

export interface ScanOptions {
  fullDomainScan: boolean;
}

export interface RobotsTxtRules {
  userAgents: string[];
  rules: Array<{
    type: 'allow' | 'disallow';
    path: string;
  }>;
  sitemaps: string[];
  crawlDelay?: number;
}

export interface SitemapUrl {
  loc: string;
  lastModified?: string;
  priority?: number;
  changefreq?: string;
}

export interface SitemapData {
  urls: SitemapUrl[];
  lastModified?: string;
}

export interface HtmlSnapshot {
  content: string;
  hash: string;
  timestamp: string;
  metadata: {
    title?: string;
    description?: string;
    language?: string;
    charset?: string;
    viewport?: string;
    robots?: string;
  };
}

export interface CrawlResult {
  url: string;
  robotsTxt: string | null;
  robotsRules: RobotsTxtRules | null;
  sitemapXml: string | null;
  sitemapData: SitemapData | null;
  html: string | null;
  htmlSnapshot: HtmlSnapshot | null;
  crawlAccess: CrawlAccessResult | null;
  error?: string;
}

export class Scanner {
  private static isValidUrl(url: string): boolean {
    try {
      const parsed = parseUrl(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private static async fetchWithTimeout(url: string, timeout = 5000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'GEO-Scanner/1.0 (https://geoscanner.nl)'
        }
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private static async fetchRobotsTxt(baseUrl: string): Promise<string | null> {
    try {
      const parsed = parseUrl(baseUrl);
      const robotsUrl = `${parsed.protocol}//${parsed.host}/robots.txt`;
      const response = await this.fetchWithTimeout(robotsUrl);
      
      if (response.ok) {
        return await response.text();
      }
      return null;
    } catch {
      return null;
    }
  }

  private static async fetchSitemapXml(baseUrl: string): Promise<string | null> {
    try {
      const parsed = parseUrl(baseUrl);
      const sitemapUrl = `${parsed.protocol}//${parsed.host}/sitemap.xml`;
      const response = await this.fetchWithTimeout(sitemapUrl);
      
      if (response.ok) {
        return await response.text();
      }
      return null;
    } catch {
      return null;
    }
  }

  private static async fetchHtml(url: string): Promise<string | null> {
    try {
      const response = await this.fetchWithTimeout(url);
      
      if (response.ok) {
        return await response.text();
      }
      return null;
    } catch {
      return null;
    }
  }

  private static parseRobotsTxt(content: string): RobotsTxtRules {
    const rules: RobotsTxtRules = {
      userAgents: [],
      rules: [],
      sitemaps: [],
    };

    const lines = content.split('\n');
    let currentUserAgent = '*';

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) continue;

      const [directive, value] = trimmedLine.split(':').map(s => s.trim());
      
      switch (directive.toLowerCase()) {
        case 'user-agent':
          currentUserAgent = value;
          if (!rules.userAgents.includes(value)) {
            rules.userAgents.push(value);
          }
          break;
        case 'allow':
          if (currentUserAgent === '*' || currentUserAgent === 'GEO-Scanner') {
            rules.rules.push({ type: 'allow', path: value });
          }
          break;
        case 'disallow':
          if (currentUserAgent === '*' || currentUserAgent === 'GEO-Scanner') {
            rules.rules.push({ type: 'disallow', path: value });
          }
          break;
        case 'sitemap':
          rules.sitemaps.push(value);
          break;
        case 'crawl-delay':
          if (currentUserAgent === '*' || currentUserAgent === 'GEO-Scanner') {
            rules.crawlDelay = parseFloat(value);
          }
          break;
      }
    }

    return rules;
  }

  private static parseSitemapXml(content: string): SitemapData {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });

    try {
      const result = parser.parse(content);
      const urls: SitemapUrl[] = [];

      if (result.urlset?.url) {
        const urlEntries = Array.isArray(result.urlset.url) 
          ? result.urlset.url 
          : [result.urlset.url];

        for (const entry of urlEntries) {
          urls.push({
            loc: entry.loc,
            lastModified: entry.lastmod,
            priority: entry.priority ? parseFloat(entry.priority) : undefined,
            changefreq: entry.changefreq
          });
        }
      }

      return {
        urls,
        lastModified: result.urlset?.lastmod
      };
    } catch (error) {
      console.error('Error parsing sitemap:', error);
      return { urls: [] };
    }
  }

  private static extractMetadata(html: string): HtmlSnapshot['metadata'] {
    const metadata: HtmlSnapshot['metadata'] = {};
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim();
    }

    // Extract meta description
    const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
    if (descMatch) {
      metadata.description = descMatch[1].trim();
    }

    // Extract language
    const langMatch = html.match(/<html[^>]*lang="([^"]*)"[^>]*>/i);
    if (langMatch) {
      metadata.language = langMatch[1].trim();
    }

    // Extract charset
    const charsetMatch = html.match(/<meta[^>]*charset="([^"]*)"[^>]*>/i);
    if (charsetMatch) {
      metadata.charset = charsetMatch[1].trim();
    }

    // Extract viewport
    const viewportMatch = html.match(/<meta[^>]*name="viewport"[^>]*content="([^"]*)"[^>]*>/i);
    if (viewportMatch) {
      metadata.viewport = viewportMatch[1].trim();
    }

    // Extract robots
    const robotsMatch = html.match(/<meta[^>]*name="robots"[^>]*content="([^"]*)"[^>]*>/i);
    if (robotsMatch) {
      metadata.robots = robotsMatch[1].trim();
    }

    return metadata;
  }

  private static createHtmlSnapshot(html: string): HtmlSnapshot {
    const hash = createHash('sha256').update(html).digest('hex');
    const timestamp = new Date().toISOString();
    const metadata = this.extractMetadata(html);

    return {
      content: html,
      hash,
      timestamp,
      metadata
    };
  }

  public static async scan(url: string, options: ScanOptions = { fullDomainScan: false }): Promise<CrawlResult> {
    if (!this.isValidUrl(url)) {
      return {
        url,
        robotsTxt: null,
        robotsRules: null,
        sitemapXml: null,
        sitemapData: null,
        html: null,
        htmlSnapshot: null,
        crawlAccess: null,
        error: 'Ongeldige URL'
      };
    }

    try {
      const [robotsTxt, sitemapXml, html] = await Promise.all([
        this.fetchRobotsTxt(url),
        this.fetchSitemapXml(url),
        this.fetchHtml(url)
      ]);

      const robotsRules = robotsTxt ? this.parseRobotsTxt(robotsTxt) : null;
      const sitemapData = sitemapXml ? this.parseSitemapXml(sitemapXml) : null;
      const htmlSnapshot = html ? this.createHtmlSnapshot(html) : null;

      // Perform crawl-access analysis
      const crawlAccess = analyzeCrawlAccess(
        robotsRules,
        sitemapData,
        htmlSnapshot,
        html ? 200 : 404 // Simple HTTP status check
      );

      return {
        url,
        robotsTxt,
        robotsRules,
        sitemapXml,
        sitemapData,
        html,
        htmlSnapshot,
        crawlAccess
      };
    } catch (error) {
      return {
        url,
        robotsTxt: null,
        robotsRules: null,
        sitemapXml: null,
        sitemapData: null,
        html: null,
        htmlSnapshot: null,
        crawlAccess: null,
        error: error instanceof Error ? error.message : 'Onbekende fout'
      };
    }
  }
} 