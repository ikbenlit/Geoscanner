"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RobotsTxtRules, SitemapData, HtmlSnapshot } from "@/lib/scanner";
import { CrawlAccessResult } from "@/lib/modules/crawl-access";

interface ScanResult {
  overallScore: number;
  modules: {
    id: string;
    name: string;
    score: number;
    maxScore: number;
    status: 'success' | 'warning' | 'danger';
    details: string[];
  }[];
  quickWins: {
    module: string;
    impact: 'high' | 'medium' | 'low';
    description: string;
    fix: string;
  }[];
}

interface ScanResultsProps {
  result: {
    url: string;
    robotsTxt: string | null;
    robotsRules: RobotsTxtRules | null;
    sitemapXml: string | null;
    sitemapData: SitemapData | null;
    html: string | null;
    htmlSnapshot: HtmlSnapshot | null;
    crawlAccess: CrawlAccessResult | null;
    error?: string;
  };
  onNewScan: () => void;
}

export function ScanResults({ result, onNewScan }: ScanResultsProps) {
  const getStatusColor = (status: 'success' | 'warning' | 'danger') => {
    switch (status) {
      case 'success':
        return 'text-success-green';
      case 'warning':
        return 'text-warning-amber';
      case 'danger':
        return 'text-danger-red';
    }
  };

  const getStatusBgColor = (status: 'success' | 'warning' | 'danger') => {
    switch (status) {
      case 'success':
        return 'bg-success-green/10';
      case 'warning':
        return 'bg-warning-amber/10';
      case 'danger':
        return 'bg-danger-red/10';
    }
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
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Crawl-toegang Score</h4>
        <div className={cn(
          "px-3 py-1 rounded-full text-sm font-medium",
          getStatusBgColor(crawlAccess.status),
          getStatusColor(crawlAccess.status)
        )}>
          {crawlAccess.score}/{crawlAccess.maxScore} punten
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h5 className="font-medium">Robots.txt</h5>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center">
              <span className={cn(
                "w-2 h-2 rounded-full mr-2",
                crawlAccess.details.robotsTxt.exists ? "bg-success-green" : "bg-danger-red"
              )} />
              {crawlAccess.details.robotsTxt.exists ? "Bestand aanwezig" : "Bestand niet gevonden"}
            </li>
            <li className="flex items-center">
              <span className={cn(
                "w-2 h-2 rounded-full mr-2",
                crawlAccess.details.robotsTxt.allowsBots ? "bg-success-green" : "bg-danger-red"
              )} />
              {crawlAccess.details.robotsTxt.allowsBots ? "Bots toegestaan" : "Bots geblokkeerd"}
            </li>
            <li className="flex items-center">
              <span className={cn(
                "w-2 h-2 rounded-full mr-2",
                crawlAccess.details.robotsTxt.hasCrawlDelay ? "bg-success-green" : "bg-warning-amber"
              )} />
              {crawlAccess.details.robotsTxt.hasCrawlDelay ? "Crawl delay ingesteld" : "Geen crawl delay"}
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h5 className="font-medium">Sitemap</h5>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center">
              <span className={cn(
                "w-2 h-2 rounded-full mr-2",
                crawlAccess.details.sitemap.exists ? "bg-success-green" : "bg-danger-red"
              )} />
              {crawlAccess.details.sitemap.exists ? "Bestand aanwezig" : "Bestand niet gevonden"}
            </li>
            <li className="flex items-center">
              <span className={cn(
                "w-2 h-2 rounded-full mr-2",
                crawlAccess.details.sitemap.isValid ? "bg-success-green" : "bg-danger-red"
              )} />
              {crawlAccess.details.sitemap.isValid 
                ? `${crawlAccess.details.sitemap.urlCount} URLs gevonden`
                : "Geen geldige URLs"}
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h5 className="font-medium">Meta Robots</h5>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center">
              <span className={cn(
                "w-2 h-2 rounded-full mr-2",
                crawlAccess.details.metaRobots.exists ? "bg-success-green" : "bg-warning-amber"
              )} />
              {crawlAccess.details.metaRobots.exists ? "Tag aanwezig" : "Geen tag gevonden"}
            </li>
            <li className="flex items-center">
              <span className={cn(
                "w-2 h-2 rounded-full mr-2",
                crawlAccess.details.metaRobots.allowsIndexing ? "bg-success-green" : "bg-danger-red"
              )} />
              {crawlAccess.details.metaRobots.allowsIndexing ? "Indexering toegestaan" : "Indexering geblokkeerd"}
            </li>
            <li className="flex items-center">
              <span className={cn(
                "w-2 h-2 rounded-full mr-2",
                crawlAccess.details.metaRobots.allowsFollowing ? "bg-success-green" : "bg-warning-amber"
              )} />
              {crawlAccess.details.metaRobots.allowsFollowing ? "Link volgen toegestaan" : "Link volgen geblokkeerd"}
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h5 className="font-medium">HTTP Status</h5>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center">
              <span className={cn(
                "w-2 h-2 rounded-full mr-2",
                crawlAccess.details.httpStatus.isOk ? "bg-success-green" : "bg-danger-red"
              )} />
              {crawlAccess.details.httpStatus.isOk 
                ? `Status OK (${crawlAccess.details.httpStatus.code})`
                : `Status niet OK (${crawlAccess.details.httpStatus.code})`}
            </li>
          </ul>
        </div>
      </div>

      {crawlAccess.fixes.length > 0 && (
        <div className="mt-6">
          <h5 className="font-medium mb-3">Aanbevolen Verbeteringen</h5>
          <div className="space-y-3">
            {crawlAccess.fixes.map((fix, index) => (
              <div key={index} className="p-4 rounded-lg bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    "text-sm px-2 py-1 rounded",
                    fix.impact === 'high' ? "bg-danger-red/10 text-danger-red" :
                    fix.impact === 'medium' ? "bg-warning-amber/10 text-warning-amber" :
                    "bg-success-green/10 text-success-green"
                  )}>
                    {fix.impact === 'high' ? 'Hoog' : fix.impact === 'medium' ? 'Medium' : 'Laag'} impact
                  </span>
                </div>
                <p className="text-steel text-sm mb-2">{fix.description}</p>
                <code className="block p-2 bg-slate-100 rounded text-sm font-mono">
                  {fix.fix}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-midnight">Scan Resultaten</h1>
        <Button onClick={onNewScan} variant="outline">
          Nieuwe Scan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>URL Informatie</CardTitle>
          <CardDescription>{result.url}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.crawlAccess && (
              <>
                {renderCrawlAccess(result.crawlAccess)}
                <Separator />
              </>
            )}

            <div>
              <h3 className="font-semibold mb-2">Robots.txt</h3>
              {result.robotsRules ? (
                renderRobotsRules(result.robotsRules)
              ) : (
                <p className="text-steel">Geen robots.txt gevonden of kon niet worden geparsed</p>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Sitemap.xml</h3>
              {result.sitemapData ? (
                renderSitemapData(result.sitemapData)
              ) : (
                <p className="text-steel">Geen sitemap.xml gevonden of kon niet worden geparsed</p>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">HTML Snapshot</h3>
              {result.htmlSnapshot ? (
                renderHtmlSnapshot(result.htmlSnapshot)
              ) : (
                <p className="text-steel">Geen HTML snapshot beschikbaar</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Overzicht */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Score Cirkel */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Score</CardTitle>
            <CardDescription>Jouw LLM-visibility score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className={cn(
                "relative w-48 h-48 rounded-full flex items-center justify-center",
                "bg-gradient-to-br from-slate-50 to-slate-100"
              )}>
                <div className="absolute inset-0 rounded-full border-8 border-current opacity-20" />
                <div className="text-center">
                  <span className={cn(
                    "text-5xl font-display font-bold",
                    getStatusColor(result.overallScore)
                  )}>
                    {result.overallScore}
                  </span>
                  <span className="block text-steel">/ 100</span>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" onClick={onNewScan}>
                  Nieuwe Scan
                </Button>
                <Button>
                  Download PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Wins */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Wins</CardTitle>
            <CardDescription>Prioriteer deze verbeteringen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.quickWins.map((win, index) => (
                <div key={index} className="p-4 rounded-lg bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{win.module}</span>
                    <span className={cn(
                      "text-sm px-2 py-1 rounded",
                      win.impact === 'high' ? "bg-success-green/10 text-success-green" :
                      win.impact === 'medium' ? "bg-warning-amber/10 text-warning-amber" :
                      "bg-danger-red/10 text-danger-red"
                    )}>
                      {win.impact === 'high' ? 'Hoog' : win.impact === 'medium' ? 'Medium' : 'Laag'} impact
                    </span>
                  </div>
                  <p className="text-steel text-sm mb-2">{win.description}</p>
                  <code className="block p-2 bg-slate-100 rounded text-sm font-mono">
                    {win.fix}
                  </code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Details */}
      <Card>
        <CardHeader>
          <CardTitle>Module Details</CardTitle>
          <CardDescription>Gedetailleerde analyse per module</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {result.modules.map((module) => (
              <AccordionItem key={module.id} value={module.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">{module.name}</span>
                    <span className={cn(
                      "text-sm px-2 py-1 rounded",
                      module.status === 'success' ? "bg-success-green/10 text-success-green" :
                      module.status === 'warning' ? "bg-warning-amber/10 text-warning-amber" :
                      "bg-danger-red/10 text-danger-red"
                    )}>
                      {module.score}/{module.maxScore} punten
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pl-4">
                    {module.details.map((detail, index) => (
                      <p key={index} className="text-steel text-sm">{detail}</p>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
} 