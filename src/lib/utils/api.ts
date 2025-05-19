import { ModuleScore, ScanResult } from '@/components/molecules/comparative-analysis';

// Mock data voor ontwikkeling
const mockScanResults: Record<string, any> = {
  'scan123': {
    id: 'scan123',
    url: 'https://example.com',
    date: new Date().toISOString(),
    overallScore: 72,
    modules: [
      {
        id: 'crawl-access',
        name: 'Crawl-toegang',
        score: 20,
        maxScore: 25,
        status: 'success',
        details: ['Robots.txt is aanwezig', 'Sitemap.xml is aanwezig', 'Meta robots tags zijn aanwezig']
      },
      {
        id: 'structured-data',
        name: 'Structured Data',
        score: 18,
        maxScore: 25,
        status: 'success',
        details: ['JSON-LD is aanwezig', 'Open Graph tags zijn aanwezig', 'Schema.org types gevonden: Article, Organization']
      },
      {
        id: 'content-analysis',
        name: 'Content Analyse',
        score: 15,
        maxScore: 25,
        status: 'warning',
        details: ['Taal gedetecteerd: nl', 'Aantal keywords: 23', 'Geen duplicatie gedetecteerd']
      },
      {
        id: 'technical-seo',
        name: 'Technical SEO',
        score: 12,
        maxScore: 25,
        status: 'warning',
        details: ['Laadtijd: 2300ms', 'Mobiel-vriendelijk', 'SSL beveiliging aanwezig']
      },
      {
        id: 'answer-ready',
        name: 'Answer-ready Content',
        score: 12,
        maxScore: 20,
        status: 'warning',
        details: ['FAQ structuur gevonden (3 vragen)', 'Content heeft snippet potentieel', 'Natuurlijke taal voor voice search ontbreekt']
      },
      {
        id: 'authority',
        name: 'Autoriteit & citaties',
        score: 8,
        maxScore: 15,
        status: 'warning',
        details: ['Auteur bio ontbreekt', 'Outbound links naar autoriteitssites gevonden', 'Licentie-informatie ontbreekt']
      },
      {
        id: 'freshness',
        name: 'Versheid',
        score: 7,
        maxScore: 10,
        status: 'success',
        details: ['Publicatiedatum aanwezig', 'Laatste wijziging < 30 dagen', 'Content is actueel']
      },
      {
        id: 'cross-web',
        name: 'Cross-web footprint',
        score: 0,
        maxScore: 5,
        status: 'danger',
        details: ['SameAs links ontbreken', 'Niet aanwezig in Wikidata/Wikipedia', 'Geen externe profielen gekoppeld']
      }
    ],
    quickWins: [
      {
        module: 'answer-ready',
        impact: 'high',
        description: 'Voeg natuurlijke taalpatronen toe voor voice search',
        fix: '<div class="voice-optimized">\n  <p>Hoe verbeter ik mijn website voor AI? De belangrijkste stappen zijn...</p>\n</div>'
      },
      {
        module: 'authority',
        impact: 'medium',
        description: 'Voeg auteur bio toe met expertise-indicatoren',
        fix: '<div class="author-bio">\n  <img src="/author.jpg" alt="Auteur naam" />\n  <h4>Naam Auteur</h4>\n  <p>Expert in SEO met 10+ jaar ervaring...</p>\n</div>'
      },
      {
        module: 'cross-web',
        impact: 'medium',
        description: 'Voeg sameAs links toe aan sociale profielen',
        fix: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Uw Bedrijfsnaam",\n  "sameAs": [\n    "https://www.facebook.com/uwbedrijf",\n    "https://www.linkedin.com/company/uwbedrijf"\n  ]\n}\n</script>'
      }
    ]
  }
};

// Mock scan geschiedenis
const mockScanHistory: Record<string, ScanResult[]> = {
  'https://example.com': [
    {
      id: 'scan123',
      url: 'https://example.com',
      date: new Date().toISOString(),
      overallScore: 72,
      modules: [
        { id: 'crawl-access', name: 'Crawl-toegang', score: 20, maxScore: 25, status: 'success' },
        { id: 'structured-data', name: 'Structured Data', score: 18, maxScore: 25, status: 'success' },
        { id: 'content-analysis', name: 'Content Analyse', score: 15, maxScore: 25, status: 'warning' },
        { id: 'technical-seo', name: 'Technical SEO', score: 12, maxScore: 25, status: 'warning' },
        { id: 'answer-ready', name: 'Answer-ready Content', score: 12, maxScore: 20, status: 'warning' },
        { id: 'authority', name: 'Autoriteit & citaties', score: 8, maxScore: 15, status: 'warning' },
        { id: 'freshness', name: 'Versheid', score: 7, maxScore: 10, status: 'success' },
        { id: 'cross-web', name: 'Cross-web footprint', score: 0, maxScore: 5, status: 'danger' }
      ]
    },
    {
      id: 'scan122',
      url: 'https://example.com',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dagen geleden
      overallScore: 65,
      modules: [
        { id: 'crawl-access', name: 'Crawl-toegang', score: 18, maxScore: 25, status: 'success' },
        { id: 'structured-data', name: 'Structured Data', score: 15, maxScore: 25, status: 'warning' },
        { id: 'content-analysis', name: 'Content Analyse', score: 15, maxScore: 25, status: 'warning' },
        { id: 'technical-seo', name: 'Technical SEO', score: 10, maxScore: 25, status: 'warning' },
        { id: 'answer-ready', name: 'Answer-ready Content', score: 10, maxScore: 20, status: 'warning' },
        { id: 'authority', name: 'Autoriteit & citaties', score: 5, maxScore: 15, status: 'danger' },
        { id: 'freshness', name: 'Versheid', score: 7, maxScore: 10, status: 'success' },
        { id: 'cross-web', name: 'Cross-web footprint', score: 0, maxScore: 5, status: 'danger' }
      ]
    },
    {
      id: 'scan121',
      url: 'https://example.com',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 dagen geleden
      overallScore: 55,
      modules: [
        { id: 'crawl-access', name: 'Crawl-toegang', score: 15, maxScore: 25, status: 'warning' },
        { id: 'structured-data', name: 'Structured Data', score: 12, maxScore: 25, status: 'warning' },
        { id: 'content-analysis', name: 'Content Analyse', score: 12, maxScore: 25, status: 'warning' },
        { id: 'technical-seo', name: 'Technical SEO', score: 8, maxScore: 25, status: 'danger' },
        { id: 'answer-ready', name: 'Answer-ready Content', score: 8, maxScore: 20, status: 'danger' },
        { id: 'authority', name: 'Autoriteit & citaties', score: 5, maxScore: 15, status: 'danger' },
        { id: 'freshness', name: 'Versheid', score: 5, maxScore: 10, status: 'warning' },
        { id: 'cross-web', name: 'Cross-web footprint', score: 0, maxScore: 5, status: 'danger' }
      ]
    }
  ]
};

/**
 * Haal scan resultaat op voor een specifieke scan ID
 */
export async function fetchScanResult(scanId: string): Promise<any> {
  // In een echte applicatie zou dit een API call zijn naar de backend
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = mockScanResults[scanId];
      if (result) {
        resolve(result);
      } else {
        reject(new Error('Scan niet gevonden'));
      }
    }, 800); // Simuleer netwerk vertraging
  });
}

/**
 * Haal scan geschiedenis op voor een specifieke URL
 */
export async function fetchScanHistory(url: string): Promise<ScanResult[]> {
  // In een echte applicatie zou dit een API call zijn naar de backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockScanHistory[url] || []);
    }, 800); // Simuleer netwerk vertraging
  });
} 