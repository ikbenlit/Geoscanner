import { NextRequest, NextResponse } from 'next/server';
import { withOptionalAuth } from '@/lib/middleware/auth';
import { Scanner } from '@/lib/scanner';
import { createScanResult, createEmailLead } from '@/lib/db';

export const POST = withOptionalAuth(async (request: NextRequest) => {
  try {
    const { url, email } = await request.json();
    const user = (request as any).user;

    if (!url) {
      return NextResponse.json({ error: 'URL is verplicht' }, { status: 400 });
    }

    // Anonymous scan - geen credit check vereist
    if (user && !user.firebase_uid.startsWith('anonymous')) {
      return NextResponse.json(
        { error: 'Gebruik /api/scan/authenticated voor geregistreerde gebruikers' },
        { status: 400 }
      );
    }

    // Voer basis scan uit (gratis tier)
    const result = await Scanner.scan(url, { 
      fullDomainScan: false,
      tier: 'anonymous'
    });

    // Bereken overall score (basis versie)
    const overallScore = calculateBasicScore(result);
    
    // Selecteer top 3 issues voor gratis tier
    const topIssues = getTopIssues(result, 3);

    // Sla scan result op in database
    const scanRecord = await createScanResult({
      user_id: user?.id || null,
      url,
      overall_score: overallScore,
      scan_tier: 'anonymous',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 uur
    });

    // Email capture voor gratis gebruikers
    if (email && !user) {
      await createEmailLead({
        email,
        scan_id: scanRecord.id,
      });
    }

    return NextResponse.json({
      scanId: scanRecord.id,
      url,
      overallScore,
      topIssues,
      tier: 'anonymous',
      message: 'Gratis scan voltooid. Registreer voor uitgebreide analyse.',
    });
  } catch (error) {
    console.error('Anonymous scan error:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden tijdens het scannen' },
      { status: 500 }
    );
  }
});

function calculateBasicScore(result: any): number {
  // Basis score berekening voor gratis tier
  let totalScore = 0;
  let maxScore = 0;

  const modules = ['crawlAccess', 'structuredData', 'contentAnalysis'];
  
  modules.forEach(module => {
    if (result[module]) {
      totalScore += result[module].score;
      maxScore += result[module].maxScore;
    }
  });

  return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
}

function getTopIssues(result: any, limit: number): any[] {
  const allIssues: any[] = [];

  // Verzamel issues van basis modules
  ['crawlAccess', 'structuredData', 'contentAnalysis'].forEach(module => {
    if (result[module]?.fixes) {
      allIssues.push(...result[module].fixes.map((fix: any) => ({
        ...fix,
        module,
      })));
    }
  });

  // Sorteer op impact en return top N
  return allIssues
    .sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      return impactOrder[b.impact] - impactOrder[a.impact];
    })
    .slice(0, limit);
} 