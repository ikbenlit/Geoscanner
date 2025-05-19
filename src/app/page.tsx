'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import { ScanResults } from '@/components/scan-results';
import { useToast } from '@/components/ui/use-toast';
import { FeatureBanner } from '@/components/molecules/feature-banner';

// Demo resultaat voor testen
// const demoResult = { // Commented out as it's unused
// overallScore: 78,
// modules: [
// ... (rest of the object commented out)
// ],
// };

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [url, setUrl] = useState('');
  const [fullDomainScan, setFullDomainScan] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const { toast } = useToast();
  
  // Debug informatie
  useEffect(() => {
    console.log('📱 Home page component geladen');
    
    // Test of UI elementen worden gerenderd
    setTimeout(() => {
      const uiElements = {
        card: document.querySelector('.card'),
        form: document.querySelector('form'),
        button: document.querySelector('button[type="submit"]'),
        input: document.querySelector('input[type="url"]')
      };
      console.log('📱 UI elementen gevonden:', 
        Object.keys(uiElements).map(key => `${key}: ${!!uiElements[key as keyof typeof uiElements]}`).join(', ')
      );
    }, 1000);
  }, []);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Form submission met URL:', url);
    
    if (!isValidUrl(url)) {
      toast({
        title: 'Ongeldige URL',
        description: 'Voer een geldige URL in (inclusief http(s)://)',
        variant: 'destructive',
      });
      console.log('❌ Ongeldige URL gedetecteerd');
      return;
    }
    setIsScanning(true);
    setProgress(0);

    try {
      console.log('🔄 API call starten naar /api/scan');
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, fullDomainScan }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.log('❌ API error:', error);
        throw new Error(error.error || 'Er is een fout opgetreden');
      }

      const result = await response.json();
      console.log('✅ API resultaat ontvangen:', result);

      if (result.error) {
        console.log('❌ Error in resultaat:', result.error);
        throw new Error(result.error);
      }

      setScanResult(result);
      setShowResults(true);
    } catch (error) {
      console.log('❌ Exception opgetreden:', error);
      toast({
        title: 'Fout',
        description: error instanceof Error ? error.message : 'Er is een fout opgetreden',
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleNewScan = () => {
    setShowResults(false);
    setUrl('');
    setFullDomainScan(false);
    setScanResult(null);
    setProgress(0);
    setIsScanning(false);
  };

  if (showResults && scanResult) {
    return (
      <div className="container py-8">
        <ScanResults result={scanResult} onNewScan={handleNewScan} />
      </div>
    );
  }

  // Voeg extra debug render toe
  console.log('🎨 Rendering homepage UI');

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 text-white">
      {/* Hero Sectie */}
      <section className="w-full py-20 md:py-32 lg:py-40 flex flex-col items-center justify-center text-center">
        <div className="container px-4 md:px-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 [text-shadow:0_0_10px_rgba(255,255,255,0.3)]">
            Is Jouw Website Klaar voor de AI Revolutie?
          </h1>
          <p className="mx-auto max-w-[700px] text-slate-200 md:text-xl mt-6 mb-10">
            Ontdek direct hoe goed jouw content presteert in ChatGPT, Claude, Google Gemini en andere AI-zoekmachines. Onze GEO Scanner analyseert je website en geeft concrete optimalisatietips.
          </p>
          
          <Card className="w-full max-w-xl mx-auto bg-white/10 backdrop-blur-md border-slate-600 shadow-xl">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-slate-100 sr-only">
                    Website URL
                  </Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://jouwwebsite.nl"
                    className="w-full h-14 text-lg bg-white placeholder-slate-400 border-slate-300 focus:border-purple-500 focus:ring-purple-500 text-slate-900"
                    disabled={isScanning}
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Toggle
                    id="domain-scan"
                    aria-label="Volledige domeinscan"
                    disabled={isScanning}
                    pressed={fullDomainScan}
                    onPressedChange={setFullDomainScan}
                    className="data-[state=on]:bg-purple-600 data-[state=on]:text-slate-100 border-slate-500 hover:bg-white/20 text-slate-200"
                  >
                    Volledige domeinscan
                  </Toggle>
                  <Label htmlFor="domain-scan" className="text-sm text-slate-200">
                    Analyseer alle pagina's (uitgebreidere scan)
                  </Label>
                </div>
                <Button type="submit" className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-semibold shadow-lg transform transition-all duration-150 ease-in-out hover:scale-105" disabled={isScanning}>
                  {isScanning ? 'Bezig met scannen...' : 'Start Gratis Scan'}
                </Button>
              </form>
              {isScanning && (
                <div className="mt-6">
                  <Progress value={progress} className="h-3 bg-white/30 [&>div]:bg-gradient-to-r [&>div]:from-purple-400 [&>div]:to-pink-500" />
                  <p className="text-sm text-slate-400 mt-2 text-center">Analyse wordt uitgevoerd...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feature Banner - eventueel anders positioneren of stylen */}
      <FeatureBanner className="w-full max-w-4xl my-12 lg:my-16 bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-slate-700" />

      {/* Info Sectie */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-slate-50 text-slate-800">
        <div className="container px-4 md:px-6 space-y-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-slate-900">Hoe GEO Scanner Jouw Website Transformeert</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Ontdek hoe we jouw website analyseren op 6 cruciale criteria voor maximale AI-zichtbaarheid en betere zoekresultaten.
            </p>
          </div>

          {/* AI-Optimalisatie Sectie */}
          <div className="space-y-6 md:space-y-8">
            <h3 className="text-2xl md:text-3xl font-semibold text-purple-700 border-b-2 border-purple-300 pb-3 mb-6 text-center md:text-left">
              🚀 AI-Optimalisatie: Domineer de Toekomst van Zoeken
            </h3>
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              <div className="criterion-card bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out p-6 md:p-8 flex flex-col items-center text-center md:items-start md:text-left">
                <span className="text-5xl mb-4">🤖</span>
                <h4 className="font-semibold text-xl text-slate-800 mb-2">Answer-Ready Content</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Wordt jouw content direct opgepikt als hét antwoord in AI-chatbots zoals ChatGPT en Google Gemini? Optimaliseer je tekst voor directe antwoorden en verover de felbegeerde featured snippets en AI-samenvattingen.
                </p>
              </div>

              <div className="criterion-card bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out p-6 md:p-8 flex flex-col items-center text-center md:items-start md:text-left">
                <span className="text-5xl mb-4">🌌</span>
                <h4 className="font-semibold text-xl text-slate-800 mb-2">Structured Data & Semantiek (voor AI)</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Maak jouw website onmisbaar voor AI. Voed AI-modellen met rijke, gestructureerde data (Schema.org & JSON-LD) zodat ze de context, betekenis en relaties op jouw pagina's feilloos begrijpen en jouw content prefereren.
                </p>
              </div>

              <div className="criterion-card bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out p-6 md:p-8 flex flex-col items-center text-center md:items-start md:text-left">
                <span className="text-5xl mb-4">🖼️</span>
                <h4 className="font-semibold text-xl text-slate-800 mb-2">Multimodale Optimalisatie</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Spreek de taal van moderne AI die verder kijkt dan tekst alleen. Optimaliseer afbeeldingen, video's en andere media zodat jouw content in alle formaten uitblinkt en de context verrijkt voor AI-interpretatie.
                </p>
              </div>

              <div className="criterion-card bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out p-6 md:p-8 flex flex-col items-center text-center md:items-start md:text-left">
                <span className="text-5xl mb-4">🌐</span>
                <h4 className="font-semibold text-xl text-slate-800 mb-2">Cross-Web Autoriteit (E-E-A-T voor AI)</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Bouw een ijzersterke reputatie die AI herkent en beloont. Versterk je online autoriteit (Expertise, Authoritativeness, Trustworthiness) door kwalitatieve externe signalen en citaties, cruciaal voor zichtbaarheid in AI-gedreven zoekresultaten.
                </p>
              </div>
            </div>
          </div>

          {/* Fundamentele SEO Sectie */}
          <div className="space-y-6 md:space-y-8 mt-12 lg:mt-16">
            <h3 className="text-2xl md:text-3xl font-semibold text-blue-700 border-b-2 border-blue-300 pb-3 mb-6 text-center md:text-left">
              🛠️ Fundamentele SEO: De Onmisbare Basis
            </h3>
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              <div className="criterion-card bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out p-6 md:p-8 flex flex-col items-center text-center md:items-start md:text-left">
                <span className="text-5xl mb-4">🔍</span>
                <h4 className="font-semibold text-xl text-slate-800 mb-2">Crawl-Toegang & Indexeerbaarheid</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Zorg dat AI-zoekmachines en traditionele crawlers elke belangrijke pagina van jouw site moeiteloos kunnen ontdekken, lezen en indexeren. Een vlekkeloze technische toegankelijkheid is de fundering van online succes.
                </p>
              </div>

              <div className="criterion-card bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out p-6 md:p-8 flex flex-col items-center text-center md:items-start md:text-left">
                <span className="text-5xl mb-4">⏱️</span>
                <h4 className="font-semibold text-xl text-slate-800 mb-2">Content Versheid & Actualiteit</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Blijf relevant in een snel veranderende wereld. Demonstreer actualiteit met up-to-date content, essentieel om zowel gebruikers als AI-systemen te tonen dat jouw informatie vers en waardevol is.
                </p>
              </div>
            </div>
          </div>
          
          {/* CTA na de criteria */}
          <div className="mt-12 lg:mt-16 text-center">
            <Button 
              size="lg"
              className="h-14 text-lg px-10 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-semibold shadow-lg transform transition-all duration-150 ease-in-out hover:scale-105"
              onClick={() => {
                const urlInput = document.getElementById('url');
                if (urlInput) {
                  urlInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  urlInput.focus();
                }
              }}
            >
              Test Jouw Website Nu!
            </Button>
          </div>

          <Separator className="my-12 lg:my-16" />

          {/* Footer */}
          <footer className="text-center text-steel text-sm">
            <div className="space-x-4 mb-4">
              <a href="/voorwaarden" className="hover:text-midnight">
                Gebruiksvoorwaarden
              </a>
              <a href="/privacy" className="hover:text-midnight">
                Privacy
              </a>
              <a href="/contact" className="hover:text-midnight">
                Contact
              </a>
            </div>
            <p>© 2024 GEO Scanner. Alle rechten voorbehouden.</p>
          </footer>
        </div>
      </section>
    </div>
  );
}
