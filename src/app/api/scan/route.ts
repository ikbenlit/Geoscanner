import { NextResponse } from 'next/server';
import { Scanner } from '@/lib/scanner';

export async function POST(request: Request) {
  try {
    const { url, fullDomainScan } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is verplicht' },
        { status: 400 }
      );
    }

    const result = await Scanner.scan(url, { fullDomainScan });

    // Bereken overall score en modules
    const modules = [];
    let totalScore = 0;
    let maxTotalScore = 0;

    if (result.crawlAccess) {
      modules.push({
        id: "crawl-access",
        name: "Crawl-toegang",
        score: result.crawlAccess.score,
        maxScore: result.crawlAccess.maxScore,
        status: result.crawlAccess.status,
        details: [
          result.crawlAccess.details.robotsTxt.exists ? "Robots.txt is aanwezig" : "Robots.txt ontbreekt",
          result.crawlAccess.details.sitemap.exists ? "Sitemap.xml is aanwezig" : "Sitemap.xml ontbreekt",
          result.crawlAccess.details.metaRobots.exists ? "Meta robots tags zijn aanwezig" : "Meta robots tags ontbreken"
        ]
      });
      totalScore += result.crawlAccess.score;
      maxTotalScore += result.crawlAccess.maxScore;
    }

    if (result.structuredData) {
      modules.push({
        id: "structured-data",
        name: "Structured Data",
        score: result.structuredData.score,
        maxScore: result.structuredData.maxScore,
        status: result.structuredData.status,
        details: [
          result.structuredData.details.jsonLd.exists ? "JSON-LD is aanwezig" : "JSON-LD ontbreekt",
          result.structuredData.details.openGraph.exists ? "Open Graph tags zijn aanwezig" : "Open Graph tags ontbreken",
          result.structuredData.details.jsonLd.schemaTypes.length > 0 ? 
            `Schema.org types gevonden: ${result.structuredData.details.jsonLd.schemaTypes.join(', ')}` :
            "Geen Schema.org types gevonden"
        ]
      });
      totalScore += result.structuredData.score;
      maxTotalScore += result.structuredData.maxScore;
    }

    if (result.contentAnalysis) {
      modules.push({
        id: "content-analysis",
        name: "Content Analyse",
        score: result.contentAnalysis.score,
        maxScore: result.contentAnalysis.maxScore,
        status: result.contentAnalysis.status,
        details: [
          `Taal gedetecteerd: ${result.contentAnalysis.details.language.detected}`,
          `Aantal keywords: ${result.contentAnalysis.details.keywords.count}`,
          result.contentAnalysis.details.duplicateContent.hasDuplicates ? 
            "Duplicatie gedetecteerd" : 
            "Geen duplicatie gedetecteerd"
        ]
      });
      totalScore += result.contentAnalysis.score;
      maxTotalScore += result.contentAnalysis.maxScore;
    }

    if (result.technicalSeo) {
      modules.push({
        id: "technical-seo",
        name: "Technical SEO",
        score: result.technicalSeo.score,
        maxScore: result.technicalSeo.maxScore,
        status: result.technicalSeo.status,
        details: [
          `Laadtijd: ${result.technicalSeo.details.performance.loadTime}ms`,
          result.technicalSeo.details.mobileFriendly.isMobileFriendly ? 
            "Mobiel-vriendelijk" : 
            "Niet mobiel-vriendelijk",
          result.technicalSeo.details.security.ssl ? 
            "SSL beveiliging aanwezig" : 
            "SSL beveiliging ontbreekt"
        ]
      });
      totalScore += result.technicalSeo.score;
      maxTotalScore += result.technicalSeo.maxScore;
    }

    // Bereken overall score
    const overallScore = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;

    // Genereer quick wins
    const quickWins = [];
    
    if (result.structuredData?.fixes) {
      quickWins.push(...result.structuredData.fixes.map(fix => ({
        module: "Structured Data",
        impact: fix.impact,
        description: fix.description,
        fix: fix.fix
      })));
    }

    if (result.contentAnalysis?.fixes) {
      quickWins.push(...result.contentAnalysis.fixes.map(fix => ({
        module: "Content Analyse",
        impact: fix.impact,
        description: fix.description,
        fix: fix.fix
      })));
    }

    if (result.technicalSeo?.fixes) {
      quickWins.push(...result.technicalSeo.fixes.map(fix => ({
        module: "Technical SEO",
        impact: fix.impact,
        description: fix.description,
        fix: fix.fix
      })));
    }

    return NextResponse.json({
      ...result,
      overallScore,
      modules,
      quickWins
    });
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden tijdens het scannen' },
      { status: 500 }
    );
  }
} 