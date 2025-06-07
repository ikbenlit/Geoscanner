import { RobotsTxtRules, SitemapData, HtmlSnapshot } from './scanner';
import { CrawlAccessResult } from './modules/crawl-access';
import { StructuredDataResult } from './modules/structured-data';
import { ContentAnalysisResult } from './modules/content-analysis';
import { TechnicalSeoResult } from './modules/technical-seo';
import { AnswerReadyResult } from './modules/answer-ready';
import { AuthorityResult } from './modules/authority';
import { FreshnessResult } from './modules/freshness';
import { CrossWebResult } from './modules/cross-web';
import { MultimodalResult } from './modules/multimodal';
import { MonitoringResult } from './modules/monitoring';
import { SchemaAdvancedResult } from './modules/schema-advanced';

export type Status = 'success' | 'warning' | 'danger';

export interface ScanResult {
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
} 