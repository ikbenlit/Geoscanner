"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RobotsTxtRules, SitemapData, HtmlSnapshot } from "@/lib/scanner";
import { CrawlAccessResult } from "@/lib/modules/crawl-access";
import { StructuredDataResult } from "@/lib/modules/structured-data";
import { CrawlResult } from '@/lib/scanner';
import { ContentAnalysisResult } from '@/lib/modules/content-analysis';
import { Badge } from "@/components/ui/badge";
import { TechnicalSeoResult } from '@/lib/modules/technical-seo';
import { ScoreCircle } from "@/components/atoms/score-circle";
import { ModuleCard } from "@/components/molecules/module-card";
import { ModuleRadarChart } from "@/components/molecules/radar-chart";

type Status = 'success' | 'warning' | 'danger';

function getStatusVariant(status: Status): 'default' | 'destructive' | 'secondary' {
  switch (status) {
    case 'success':
      return 'default';
    case 'warning':
      return 'secondary';
    case 'danger':
      return 'destructive';
  }
}

interface ScanResult {
  overallScore: number;
  modules: Array<{
    id: string;
    name: string;
    score: number;
    maxScore: number;
    status: Status;
    details: string[];
  }>;
  quickWins: Array<{
    module: string;
    impact: 'high' | 'medium' | 'low';
    description: string;
    fix: string;
  }>;
}

interface ScanResultsProps {
  result: ScanResult & {
    url: string;
    robotsTxt: string | null;
    robotsRules: RobotsTxtRules | null;
    sitemapXml: string | null;
    sitemapData: SitemapData | null;
    html: string | null;
    htmlSnapshot: HtmlSnapshot | null;
    crawlAccess: CrawlAccessResult | null;
    structuredData: StructuredDataResult | null;
    error?: string;
    contentAnalysis: ContentAnalysisResult | null;
    technicalSeo: TechnicalSeoResult | null;
  };
  onNewScan: () => void;
}

export function ScanResults({ result, onNewScan }: ScanResultsProps) {
  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'success':
        return 'text-success-green';
      case 'warning':
        return 'text-warning-amber';
      case 'danger':
        return 'text-danger-red';
    }
  };

  const getStatusBgColor = (status: Status) => {
    switch (status) {
      case 'success':
        return 'bg-success-green/10';
      case 'warning':
        return 'bg-warning-amber/10';
      case 'danger':
        return 'bg-danger-red/10';
    }
  };

  const getStatusFromScore = (score: number): Status => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
  };

  const renderRobotsRules = (rules: RobotsTxtRules) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">User Agents</h4>
          <ul className="space-y-1">
            {rules.userAgents.map((agent, index) => (
              <li key={index} className="text-sm text-steel">
                {agent}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-2">Crawl Delay</h4>
          <p className="text-sm text-steel">
            {rules.crawlDelay ? `${rules.crawlDelay} seconden` : 'Niet ingesteld'}
          </p>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Allow/Disallow Regels</h4>
        <div className="space-y-2">
          {rules.rules.map((rule, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className={cn(
                "px-2 py-1 rounded text-xs font-medium",
                rule.type === 'allow' ? "bg-success-green/10 text-success-green" : "bg-danger-red/10 text-danger-red"
              )}>
                {rule.type.toUpperCase()}
              </span>
              <span className="text-sm text-steel">{rule.path}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Sitemaps</h4>
        <ul className="space-y-1">
          {rules.sitemaps.map((sitemap, index) => (
            <li key={index} className="text-sm text-steel">
              {sitemap}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderSitemapData = (data: SitemapData) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Laatste Update</h4>
          <p className="text-sm text-steel">
            {data.lastModified ? new Date(data.lastModified).toLocaleString() : 'Onbekend'}
          </p>
        </div>
        <div>
          <h4 className="font-medium mb-2">Aantal URLs</h4>
          <p className="text-sm text-steel">{data.urls.length}</p>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">URLs</h4>
        <ScrollArea className="h-[200px] rounded-md border p-4">
          <div className="space-y-2">
            {data.urls.map((url, index) => (
              <div key={index} className="text-sm text-steel">
                <div className="font-medium">{url.loc}</div>
                {url.lastModified && (
                  <div className="text-xs text-steel/70">
                    Laatste update: {new Date(url.lastModified).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  const renderHtmlSnapshot = (snapshot: HtmlSnapshot) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Metadata</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium">Titel</dt>
              <dd className="text-sm text-steel">{snapshot.metadata.title || 'Niet gevonden'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium">Beschrijving</dt>
              <dd className="text-sm text-steel">{snapshot.metadata.description || 'Niet gevonden'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium">Taal</dt>
              <dd className="text-sm text-steel">{snapshot.metadata.language || 'Niet gevonden'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium">Karakter Set</dt>
              <dd className="text-sm text-steel">{snapshot.metadata.charset || 'Niet gevonden'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium">Viewport</dt>
              <dd className="text-sm text-steel">{snapshot.metadata.viewport || 'Niet gevonden'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium">Robots</dt>
              <dd className="text-sm text-steel">{snapshot.metadata.robots || 'Niet gevonden'}</dd>
            </div>
          </dl>
        </div>
        <div>
          <h4 className="font-medium mb-2">Snapshot Details</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium">Hash</dt>
              <dd className="text-sm text-steel font-mono">{snapshot.hash}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium">Timestamp</dt>
              <dd className="text-sm text-steel">
                {new Date(snapshot.timestamp).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">HTML Content</h4>
        <ScrollArea className="h-[300px] rounded-md border p-4">
          <pre className="text-sm text-steel whitespace-pre-wrap">
            {snapshot.content}
          </pre>
        </ScrollArea>
      </div>
    </div>
  );

  const renderCrawlAccess = (crawlAccess: CrawlAccessResult) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Robots.txt</h4>
          <ul className="space-y-2">
            <li className="text-sm text-steel">
              {crawlAccess.details.robotsTxt.exists ? 'Aanwezig' : 'Niet gevonden'}
            </li>
            <li className="text-sm text-steel">
              {crawlAccess.details.robotsTxt.allowsBots ? 'Bots toegestaan' : 'Bots geblokkeerd'}
            </li>
            <li className="text-sm text-steel">
              {crawlAccess.details.robotsTxt.hasCrawlDelay ? 'Crawl delay ingesteld' : 'Geen crawl delay'}
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-2">Sitemap</h4>
          <ul className="space-y-2">
            <li className="text-sm text-steel">
              {crawlAccess.details.sitemap.exists ? 'Aanwezig' : 'Niet gevonden'}
            </li>
            <li className="text-sm text-steel">
              {crawlAccess.details.sitemap.isValid ? 'Geldig' : 'Ongeldig'}
            </li>
            <li className="text-sm text-steel">
              {crawlAccess.details.sitemap.urlCount} URLs gevonden
            </li>
          </ul>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Meta Robots</h4>
        <ul className="space-y-2">
          <li className="text-sm text-steel">
            {crawlAccess.details.metaRobots.exists ? 'Aanwezig' : 'Niet gevonden'}
          </li>
          <li className="text-sm text-steel">
            {crawlAccess.details.metaRobots.allowsIndexing ? 'Indexering toegestaan' : 'Indexering geblokkeerd'}
          </li>
          <li className="text-sm text-steel">
            {crawlAccess.details.metaRobots.allowsFollowing ? 'Link volgen toegestaan' : 'Link volgen geblokkeerd'}
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-medium mb-2">HTTP Status</h4>
        <ul className="space-y-2">
          <li className="text-sm text-steel">
            {crawlAccess.details.httpStatus.isOk 
              ? `Status OK (${crawlAccess.details.httpStatus.code})`
              : `Status niet OK (${crawlAccess.details.httpStatus.code})`}
          </li>
        </ul>
      </div>

      {crawlAccess.fixes.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Verbeterpunten</h4>
          <div className="space-y-2">
            {crawlAccess.fixes.map((fix, index) => (
              <div key={index} className="p-3 rounded-lg border">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    fix.impact === 'high' ? "bg-danger-red/10 text-danger-red" :
                    fix.impact === 'medium' ? "bg-warning-amber/10 text-warning-amber" :
                    "bg-success-green/10 text-success-green"
                  )}>
                    {fix.impact.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-steel mb-2">{fix.description}</p>
                <div className="bg-muted p-2 rounded">
                  <pre className="text-xs text-steel whitespace-pre-wrap">{fix.fix}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStructuredData = (data: StructuredDataResult) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">JSON-LD</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium">Aanwezig</dt>
              <dd className="text-sm text-steel">{data.details.jsonLd.exists ? 'Ja' : 'Nee'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium">Geldig</dt>
              <dd className="text-sm text-steel">{data.details.jsonLd.isValid ? 'Ja' : 'Nee'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium">Schema Types</dt>
              <dd className="text-sm text-steel">
                {data.details.jsonLd.schemaTypes.length > 0 
                  ? data.details.jsonLd.schemaTypes.join(', ') 
                  : 'Geen gevonden'}
              </dd>
            </div>
          </dl>
        </div>
        <div>
          <h4 className="font-medium mb-2">Open Graph</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium">Aanwezig</dt>
              <dd className="text-sm text-steel">{data.details.openGraph.exists ? 'Ja' : 'Nee'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium">Titel</dt>
              <dd className="text-sm text-steel">{data.details.openGraph.hasTitle ? 'Ja' : 'Nee'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium">Beschrijving</dt>
              <dd className="text-sm text-steel">{data.details.openGraph.hasDescription ? 'Ja' : 'Nee'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium">Afbeelding</dt>
              <dd className="text-sm text-steel">{data.details.openGraph.hasImage ? 'Ja' : 'Nee'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium">Type</dt>
              <dd className="text-sm text-steel">{data.details.openGraph.hasType ? 'Ja' : 'Nee'}</dd>
            </div>
          </dl>
        </div>
      </div>

      {data.fixes.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Verbeterpunten</h4>
          <div className="space-y-2">
            {data.fixes.map((fix, index) => (
              <div key={index} className="p-3 rounded-lg border">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    fix.impact === 'high' ? "bg-danger-red/10 text-danger-red" :
                    fix.impact === 'medium' ? "bg-warning-amber/10 text-warning-amber" :
                    "bg-success-green/10 text-success-green"
                  )}>
                    {fix.impact.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-steel mb-2">{fix.description}</p>
                <div className="bg-muted p-2 rounded">
                  <pre className="text-xs text-steel whitespace-pre-wrap">{fix.fix}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  function renderContentAnalysis(contentAnalysis: ContentAnalysisResult | null) {
    if (!contentAnalysis) return null;

    return (
      <AccordionItem value="content-analysis">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <span>Content Analyse</span>
            <Badge variant={getStatusVariant(contentAnalysis.status)}>
              {contentAnalysis.score}/{contentAnalysis.maxScore}
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            {/* Taal */}
            <div>
              <h4 className="font-medium mb-2">Taal</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Gedetecteerde taal</p>
                  <p className="font-medium">{contentAnalysis.details.language.detected.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Betrouwbaarheid</p>
                  <p className="font-medium">{(contentAnalysis.details.language.confidence * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div>
              <h4 className="font-medium mb-2">Keywords</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Aantal keywords</p>
                  <p className="font-medium">{contentAnalysis.details.keywords.count}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Keyword density</p>
                  <p className="font-medium">{contentAnalysis.details.keywords.density.toFixed(2)}%</p>
                </div>
              </div>
              {contentAnalysis.details.keywords.topKeywords.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Top keywords</p>
                  <div className="grid grid-cols-2 gap-2">
                    {contentAnalysis.details.keywords.topKeywords.map((keyword) => (
                      <div key={keyword.keyword} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>{keyword.keyword}</span>
                        <span className="text-sm text-muted-foreground">
                          {keyword.count}x ({keyword.density.toFixed(1)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Duplicate Content */}
            <div>
              <h4 className="font-medium mb-2">Duplicate Content</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">
                    {contentAnalysis.details.duplicateContent.hasDuplicates ? 'Gevonden' : 'Geen duplicaten'}
                  </p>
                </div>
                {contentAnalysis.details.duplicateContent.hasDuplicates && (
                  <div>
                    <p className="text-sm text-muted-foreground">Duplicate ratio</p>
                    <p className="font-medium">
                      {(contentAnalysis.details.duplicateContent.duplicateRatio * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
              {contentAnalysis.details.duplicateContent.duplicateBlocks.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Gedupliceerde blokken</p>
                  <div className="space-y-2">
                    {contentAnalysis.details.duplicateContent.duplicateBlocks.map((block) => (
                      <div key={block.hash} className="p-2 bg-muted rounded">
                        <p className="text-sm mb-1">{block.text}</p>
                        <p className="text-xs text-muted-foreground">
                          {block.occurrences}x voorkomend
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Verbeterpunten */}
            {contentAnalysis.fixes.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Verbeterpunten</h4>
                <div className="space-y-2">
                  {contentAnalysis.fixes.map((fix, index) => (
                    <div key={index} className="p-3 bg-muted rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getStatusVariant(fix.impact === 'high' ? 'danger' : fix.impact === 'medium' ? 'warning' : 'success')}>
                          {fix.impact}
                        </Badge>
                        <p className="font-medium">{fix.description}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{fix.fix}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }

  function renderTechnicalSeo(technicalSeo: TechnicalSeoResult | null) {
    if (!technicalSeo) return null;

    return (
      <AccordionItem value="technical-seo">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <span>Technical SEO</span>
            <Badge variant={getStatusVariant(technicalSeo.status)}>
              {technicalSeo.score}/{technicalSeo.maxScore}
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            {/* Performance */}
            <div>
              <h4 className="font-medium mb-2">Performance</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Laadtijd</p>
                  <p className="font-medium">{technicalSeo.details.performance.loadTime}ms</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pagina grootte</p>
                  <p className="font-medium">{(technicalSeo.details.performance.pageSize / 1024).toFixed(1)}KB</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Aantal resources</p>
                  <p className="font-medium">{technicalSeo.details.performance.resourceCount}</p>
                </div>
              </div>
              {technicalSeo.details.performance.metrics && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Core Web Vitals</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(technicalSeo.details.performance.metrics).map(([metric, value]) => (
                      <div key={metric} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm font-medium">{metric.toUpperCase()}</span>
                        <span className="text-sm text-muted-foreground">
                          {value?.toFixed(2)}{metric === 'cls' ? '' : 'ms'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Friendly */}
            <div>
              <h4 className="font-medium mb-2">Mobile Friendly</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">
                    {technicalSeo.details.mobileFriendly.isMobileFriendly ? 'Mobiel-vriendelijk' : 'Niet mobiel-vriendelijk'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="text-sm">Viewport</span>
                  <Badge variant={technicalSeo.details.mobileFriendly.viewport ? 'default' : 'destructive'}>
                    {technicalSeo.details.mobileFriendly.viewport ? 'OK' : 'Mist'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="text-sm">Responsive Images</span>
                  <Badge variant={technicalSeo.details.mobileFriendly.responsiveImages ? 'default' : 'destructive'}>
                    {technicalSeo.details.mobileFriendly.responsiveImages ? 'OK' : 'Mist'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="text-sm">Touch Elements</span>
                  <Badge variant={technicalSeo.details.mobileFriendly.touchElements ? 'default' : 'destructive'}>
                    {technicalSeo.details.mobileFriendly.touchElements ? 'OK' : 'Mist'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="text-sm">Font Size</span>
                  <Badge variant={technicalSeo.details.mobileFriendly.fontSize ? 'default' : 'destructive'}>
                    {technicalSeo.details.mobileFriendly.fontSize ? 'OK' : 'Mist'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Security */}
            <div>
              <h4 className="font-medium mb-2">Security</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">SSL/TLS</p>
                  <p className="font-medium">
                    {technicalSeo.details.security.ssl ? 'HTTPS' : 'HTTP'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">HSTS</p>
                  <p className="font-medium">
                    {technicalSeo.details.security.hsts ? 'Ingeschakeld' : 'Uitgeschakeld'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Security Headers</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(technicalSeo.details.security.headers).map(([header, info]) => (
                    <div key={header} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="text-sm">{header}</span>
                      <Badge variant={info.present ? 'default' : 'destructive'}>
                        {info.present ? 'Aanwezig' : 'Mist'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Verbeterpunten */}
            {technicalSeo.fixes.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Verbeterpunten</h4>
                <div className="space-y-2">
                  {technicalSeo.fixes.map((fix, index) => (
                    <div key={index} className="p-3 bg-muted rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{fix.title}</span>
                        <Badge variant="secondary">{fix.impact}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{fix.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scan Resultaten</CardTitle>
          <CardDescription>Analyse van {result.url}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Score Circle */}
          <div className="flex justify-center mb-8">
            <ScoreCircle 
              score={result.overallScore} 
              maxScore={100} 
              size="lg" 
            />
          </div>

          {/* Radar Chart */}
          <div className="mb-8">
            <ModuleRadarChart modules={result.modules} />
          </div>

          {/* Module Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {result.modules.map(module => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>

          <Separator className="my-6" />

          {/* Bestaande Accordion voor Details */}
          <Accordion type="single" collapsible className="w-full">
            {result.crawlAccess && (
              <AccordionItem value="crawl-access">
                <AccordionTrigger>
                  <div className="flex items-center space-x-2">
                    <span>Crawl-toegang</span>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      getStatusBgColor(result.crawlAccess.status),
                      getStatusColor(result.crawlAccess.status)
                    )}>
                      {result.crawlAccess.score}/{result.crawlAccess.maxScore}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {renderCrawlAccess(result.crawlAccess)}
                </AccordionContent>
              </AccordionItem>
            )}

            {result.structuredData && (
              <AccordionItem value="structured-data">
                <AccordionTrigger>
                  <div className="flex items-center space-x-2">
                    <span>Structured Data</span>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      getStatusBgColor(result.structuredData.status),
                      getStatusColor(result.structuredData.status)
                    )}>
                      {result.structuredData.score}/{result.structuredData.maxScore}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {renderStructuredData(result.structuredData)}
                </AccordionContent>
              </AccordionItem>
            )}

            {result.robotsRules && (
              <AccordionItem value="robots">
                <AccordionTrigger>Robots.txt</AccordionTrigger>
                <AccordionContent>
                  {renderRobotsRules(result.robotsRules)}
                </AccordionContent>
              </AccordionItem>
            )}

            {result.sitemapData && (
              <AccordionItem value="sitemap">
                <AccordionTrigger>Sitemap.xml</AccordionTrigger>
                <AccordionContent>
                  {renderSitemapData(result.sitemapData)}
                </AccordionContent>
              </AccordionItem>
            )}

            {result.htmlSnapshot && (
              <AccordionItem value="html">
                <AccordionTrigger>HTML Snapshot</AccordionTrigger>
                <AccordionContent>
                  {renderHtmlSnapshot(result.htmlSnapshot)}
                </AccordionContent>
              </AccordionItem>
            )}

            {result.contentAnalysis && (
              <AccordionItem value="content-analysis">
                <AccordionTrigger>
                  <div className="flex items-center space-x-2">
                    <span>Content Analyse</span>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      getStatusBgColor(result.contentAnalysis.status),
                      getStatusColor(result.contentAnalysis.status)
                    )}>
                      {result.contentAnalysis.score}/{result.contentAnalysis.maxScore}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {renderContentAnalysis(result.contentAnalysis)}
                </AccordionContent>
              </AccordionItem>
            )}

            {result.technicalSeo && renderTechnicalSeo(result.technicalSeo)}
          </Accordion>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onNewScan}>Nieuwe Scan</Button>
      </div>
    </div>
  );
}