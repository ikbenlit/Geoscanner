'use client';

import { Button } from '@/components/ui/button';
import { RobotsTxtRules, SitemapData, HtmlSnapshot } from '@/lib/scanner';
import { CrawlAccessResult } from '@/lib/modules/crawl-access';
import { StructuredDataResult } from '@/lib/modules/structured-data';
import { ContentAnalysisResult } from '@/lib/modules/content-analysis';
import { TechnicalSeoResult } from '@/lib/modules/technical-seo';
import { ScoreHero } from '@/components/results/ScoreHero/ScoreHero';
import { QuickWinsPanel } from '@/components/results/QuickWinsPanel/QuickWinsPanel';
import { ModuleOverview } from '@/components/results/ModuleOverview/ModuleOverview';
import { DetailedAnalysis } from '@/components/results/DetailedAnalysis/DetailedAnalysis';
import { AnswerReadyResult } from '@/lib/modules/answer-ready';
import { AuthorityResult } from '@/lib/modules/authority';
import { FreshnessResult } from '@/lib/modules/freshness';
import { CrossWebResult } from '@/lib/modules/cross-web';
import { MultimodalResult } from '@/lib/modules/multimodal';
import { MonitoringResult } from '@/lib/modules/monitoring';
import { SchemaAdvancedResult } from '@/lib/modules/schema-advanced';
import { useState, useEffect } from 'react';

// Debug logging
console.log('🔍 ScanResults component wordt geladen');

type Status = 'success' | 'warning' | 'danger';

function _getStatusVariant(status: Status): 'default' | 'destructive' | 'secondary' {
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
    answerReady: AnswerReadyResult | null;
    authority: AuthorityResult | null;
    freshness: FreshnessResult | null;
    crossWeb: CrossWebResult | null;
    multimodal: MultimodalResult | null;
    monitoring: MonitoringResult | null;
    schemaAdvanced: SchemaAdvancedResult | null;
  };
  onNewScan: () => void;
}

export function ScanResults({ result, onNewScan }: ScanResultsProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Client-side alleen - voorkomt hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    console.log('🏆 ScanResults component gemount met score:', result.overallScore);
  }, [result.overallScore]);
  
  // Helper functie om module object te maken met dynamisch berekende status
  const createModuleWithCalculatedStatus = (
    id: string,
    name: string,
    score: number,
    maxScore: number
  ) => {
    const percentageScore = Math.round((score / maxScore) * 100);
    return {
      id,
      name,
      score,
      maxScore,
      status: getStatusFromScore(percentageScore),
      lastUpdated: new Date().toISOString(),
    };
  };

  const getStatusFromScore = (score: number): Status => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
  };
  
  // Render niks tijdens SSR of als component nog niet gemount is
  if (!isMounted) {
    return <div className="text-center py-12">Resultaten worden geladen...</div>;
  }

  const aiModuleIds = ['answer-ready', 'multimodal', 'schema-advanced', 'cross-web'];

  const categorizedQuickWins = result.quickWins
    .map(win => {
      const category = aiModuleIds.includes(win.module)
        ? 'AI-Optimalisatie'
        : 'Generieke SEO';
      return {
        id: win.module + '_' + win.description.slice(0,20), // Maak id unieker
        title: win.description,
        description: win.fix,
        impact: win.impact,
        estimatedTime: '5 min', // Behoud huidige logica of maak dynamisch indien nodig
        code: win.fix,
        moduleId: win.module,
        category: category as 'AI-Optimalisatie' | 'Generieke SEO', // Expliciete type cast
      };
    })
    .sort((a, b) => {
      // Sorteer AI-Optimalisatie eerst
      if (a.category === 'AI-Optimalisatie' && b.category !== 'AI-Optimalisatie') {
        return -1;
      }
      if (a.category !== 'AI-Optimalisatie' && b.category === 'AI-Optimalisatie') {
        return 1;
      }
      // Behoud huidige volgorde voor items binnen dezelfde categorie (of pas aan indien nodig)
      return 0;
    });

  return (
    <div className="space-y-8">
      <ScoreHero score={result.overallScore} maxScore={100} url={result.url} />

      <QuickWinsPanel
        quickWins={categorizedQuickWins}
      />

      <ModuleOverview
        modules={[
          createModuleWithCalculatedStatus(
            'crawl-access',
            'Crawl-toegang',
            result.modules.find(m => m.id === 'crawl-access')?.score || 0,
            result.modules.find(m => m.id === 'crawl-access')?.maxScore || 25
          ),
          createModuleWithCalculatedStatus(
            'structured-data',
            'Structured Data',
            result.modules.find(m => m.id === 'structured-data')?.score || 0,
            result.modules.find(m => m.id === 'structured-data')?.maxScore || 25
          ),
          createModuleWithCalculatedStatus(
            'content-analysis',
            'Content Analyse',
            result.modules.find(m => m.id === 'content-analysis')?.score || 0,
            result.modules.find(m => m.id === 'content-analysis')?.maxScore || 25
          ),
          createModuleWithCalculatedStatus(
            'technical-seo',
            'Technical SEO',
            result.modules.find(m => m.id === 'technical-seo')?.score || 0,
            result.modules.find(m => m.id === 'technical-seo')?.maxScore || 25
          ),
          createModuleWithCalculatedStatus(
            'answer-ready',
            'Answer-ready content',
            result.modules.find(m => m.id === 'answer-ready')?.score || 0,
            result.modules.find(m => m.id === 'answer-ready')?.maxScore || 20
          ),
          createModuleWithCalculatedStatus(
            'authority',
            'Autoriteit & citaties',
            result.modules.find(m => m.id === 'authority')?.score || 0,
            result.modules.find(m => m.id === 'authority')?.maxScore || 15
          ),
          createModuleWithCalculatedStatus(
            'freshness',
            'Versheid',
            result.modules.find(m => m.id === 'freshness')?.score || 0,
            result.modules.find(m => m.id === 'freshness')?.maxScore || 10
          ),
          createModuleWithCalculatedStatus(
            'cross-web',
            'Cross-web footprint',
            result.modules.find(m => m.id === 'cross-web')?.score || 0,
            result.modules.find(m => m.id === 'cross-web')?.maxScore || 10
          ),
          createModuleWithCalculatedStatus(
            'multimodal',
            'Multimodale leesbaarheid',
            result.modules.find(m => m.id === 'multimodal')?.score || 0,
            result.modules.find(m => m.id === 'multimodal')?.maxScore || 5
          ),
          createModuleWithCalculatedStatus(
            'monitoring',
            'Monitoring-haakjes',
            result.modules.find(m => m.id === 'monitoring')?.score || 0,
            result.modules.find(m => m.id === 'monitoring')?.maxScore || 5
          ),
          createModuleWithCalculatedStatus(
            'schema-advanced',
            'Schema.org analyse',
            result.modules.find(m => m.id === 'schema-advanced')?.score || 0,
            result.modules.find(m => m.id === 'schema-advanced')?.maxScore || 15
          ),
        ]}
      />

      <DetailedAnalysis
        sections={[
          // AI-Optimalisatie Secties
          {
            // @ts-ignore - Dit is een tijdelijke oplossing om een titel-element toe te voegen
            id: 'ai-optimization-title',
            title: 'AI-Optimalisatie',
            isTitle: true, // Markeer dit als een titel-element
          },
          {
            id: 'answer-ready',
            title: 'Answer-ready content',
            description: 'Geeft mijn pagina direct antwoord op vragen van bezoekers?',
            codeSnippets:
              result.answerReady?.fixes.map(fix => ({
                id: fix.description,
                language: 'html', // of 'text' afhankelijk van de 'fix' inhoud
                code: fix.fix,
                description: fix.description,
              })) || [],
            currentScore: result.answerReady?.score || 0,
            predictedScore: result.answerReady?.maxScore || 0,
          },
          {
            id: 'multimodal',
            title: 'Multimodale leesbaarheid',
            description: 'Is mijn website geoptimaliseerd voor verschillende typen media (tekst, afbeeldingen)?',
            codeSnippets:
              result.multimodal?.fixes.map(fix => ({
                id: fix.description,
                language: 'html',
                code: fix.fix,
                description: fix.description,
              })) || [],
            currentScore: result.multimodal?.score || 0,
            predictedScore: result.multimodal?.maxScore || 0,
          },
          {
            id: 'schema-advanced',
            title: 'Schema.org Geavanceerd',
            description: 'Maakt mijn website gebruik van geavanceerde Schema.org markup voor maximale context?',
            codeSnippets:
              result.schemaAdvanced?.fixes.map(fix => ({
                id: fix.description,
                language: 'json',
                code: fix.fix,
                description: fix.description,
              })) || [],
            currentScore: result.schemaAdvanced?.score || 0,
            predictedScore: result.schemaAdvanced?.maxScore || 0,
          },
          {
            id: 'cross-web',
            title: 'Cross-web Footprint',
            description: 'Hoe is mijn website verbonden en vertegenwoordigd op het bredere web?',
            codeSnippets:
              result.crossWeb?.fixes.map(fix => ({
                id: fix.description,
                language: 'json', // Kan variëren, afhankelijk van de 'fix'
                code: fix.fix,
                description: fix.description,
              })) || [],
            currentScore: result.crossWeb?.score || 0,
            predictedScore: result.crossWeb?.maxScore || 0,
          },
          // Algemene SEO Secties
          {
            // @ts-ignore - Dit is een tijdelijke oplossing om een titel-element toe te voegen
            id: 'general-seo-title',
            title: 'Algemene SEO',
            isTitle: true, // Markeer dit als een titel-element
          },
          {
            id: 'crawl-access',
            title: 'Crawl-toegang',
            description: 'Kan Google en andere zoekmachines mijn website goed vinden en lezen?',
            codeSnippets:
              result.crawlAccess?.fixes.map(fix => ({
                id: fix.description,
                language: 'text',
                code: fix.fix,
                description: fix.description,
              })) || [],
            currentScore: result.crawlAccess?.score || 0,
            predictedScore: result.crawlAccess?.maxScore || 0,
          },
          {
            id: 'structured-data',
            title: 'Structured Data',
            description: 'Begrijpen zoekmachines waar mijn pagina over gaat?',
            codeSnippets:
              result.structuredData?.fixes.map(fix => ({
                id: fix.description,
                language: 'json',
                code: fix.fix,
                description: fix.description,
              })) || [],
            currentScore: result.structuredData?.score || 0,
            predictedScore: result.structuredData?.maxScore || 0,
          },
          {
            id: 'content-analysis',
            title: 'Content Analyse',
            description: 'Is mijn content duidelijk en goed geoptimaliseerd?',
            codeSnippets:
              result.contentAnalysis?.fixes.map(fix => ({
                id: fix.description,
                language: 'html',
                code: fix.fix,
                description: fix.description,
              })) || [],
            currentScore: result.contentAnalysis?.score || 0,
            predictedScore: result.contentAnalysis?.maxScore || 0,
          },
          {
            id: 'technical-seo',
            title: 'Technical SEO',
            description: 'Is mijn website technisch correct geconfigureerd voor zoekmachines?',
            codeSnippets:
              result.technicalSeo?.fixes.map(fix => ({
                id: fix.description,
                language: 'text', // Kan variëren
                code: fix.fix,
                description: fix.description,
              })) || [],
            currentScore: result.technicalSeo?.score || 0,
            predictedScore: result.technicalSeo?.maxScore || 0,
          },
          {
            id: 'authority',
            title: 'Autoriteit & Citaties',
            description: 'Wordt mijn website als een autoriteit beschouwd binnen zijn niche?',
            codeSnippets:
              result.authority?.fixes.map(fix => ({
                id: fix.description,
                language: 'text', // Kan variëren
                code: fix.fix,
                description: fix.description,
              })) || [],
            currentScore: result.authority?.score || 0,
            predictedScore: result.authority?.maxScore || 0,
          },
          {
            id: 'freshness',
            title: 'Versheid',
            description: 'Is de content op mijn website recent en actueel?',
            codeSnippets:
              result.freshness?.fixes.map(fix => ({
                id: fix.description,
                language: 'html', // Kan variëren
                code: fix.fix,
                description: fix.description,
              })) || [],
            currentScore: result.freshness?.score || 0,
            predictedScore: result.freshness?.maxScore || 0,
          },
          {
            id: 'monitoring',
            title: 'Monitoring-haakjes',
            description: 'Zijn er systemen aanwezig om de prestaties en gezondheid van de website te monitoren?',
            codeSnippets:
              result.monitoring?.fixes.map(fix => ({
                id: fix.description,
                language: 'text', // Kan variëren
                code: fix.fix,
                description: fix.description,
              })) || [],
            currentScore: result.monitoring?.score || 0,
            predictedScore: result.monitoring?.maxScore || 0,
          },
        ]}
      />

      <div className="mt-8 flex justify-center">
        <Button onClick={onNewScan} size="lg">
          Nieuwe scan starten
        </Button>
      </div>
    </div>
  );
}
