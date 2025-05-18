"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    sitemapXml: string | null;
    html: string | null;
    error?: string;
  };
  onNewScan: () => void;
}

export function ScanResults({ result, onNewScan }: ScanResultsProps) {
  const getStatusColor = (score: number) => {
    if (score >= 80) return 'text-success-green';
    if (score >= 50) return 'text-warning-amber';
    return 'text-danger-red';
  };

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
            <div>
              <h3 className="font-semibold mb-2">Robots.txt</h3>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                {result.robotsTxt ? (
                  <pre className="text-sm">{result.robotsTxt}</pre>
                ) : (
                  <p className="text-steel">Geen robots.txt gevonden</p>
                )}
              </ScrollArea>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Sitemap.xml</h3>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                {result.sitemapXml ? (
                  <pre className="text-sm">{result.sitemapXml}</pre>
                ) : (
                  <p className="text-steel">Geen sitemap.xml gevonden</p>
                )}
              </ScrollArea>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">HTML Content</h3>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                {result.html ? (
                  <pre className="text-sm">{result.html}</pre>
                ) : (
                  <p className="text-steel">Geen HTML content gevonden</p>
                )}
              </ScrollArea>
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