import { parse as parseUrl } from 'url';

export interface ScanOptions {
  fullDomainScan: boolean;
}

export interface CrawlResult {
  url: string;
  robotsTxt: string | null;
  sitemapXml: string | null;
  html: string | null;
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

  public static async scan(url: string, options: ScanOptions): Promise<CrawlResult> {
    if (!this.isValidUrl(url)) {
      throw new Error('Ongeldige URL. Gebruik een volledige URL beginnend met http:// of https://');
    }

    try {
      const [robotsTxt, sitemapXml, html] = await Promise.all([
        this.fetchRobotsTxt(url),
        this.fetchSitemapXml(url),
        this.fetchHtml(url)
      ]);

      return {
        url,
        robotsTxt,
        sitemapXml,
        html
      };
    } catch (error) {
      return {
        url,
        robotsTxt: null,
        sitemapXml: null,
        html: null,
        error: error instanceof Error ? error.message : 'Onbekende fout'
      };
    }
  }
} 