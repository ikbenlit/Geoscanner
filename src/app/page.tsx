"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { ScanResults } from "@/components/scan-results";
import { useToast } from "@/components/ui/use-toast";

// Demo resultaat voor testen
const demoResult = {
  overallScore: 78,
  modules: [
    {
      id: "crawl-access",
      name: "Crawl-toegang",
      score: 20,
      maxScore: 25,
      status: "success" as const,
      details: [
        "Robots.txt is correct geconfigureerd voor AI bots",
        "Sitemap.xml is aanwezig en geldig",
        "Meta robots tags zijn correct ingesteld"
      ]
    },
    {
      id: "structured-data",
      name: "Structured Data",
      score: 15,
      maxScore: 25,
      status: "warning" as const,
      details: [
        "JSON-LD is aanwezig maar mist enkele verplichte velden",
        "Schema.org markup is gedeeltelijk geïmplementeerd",
        "Auteur informatie ontbreekt in structured data"
      ]
    },
    {
      id: "answer-ready",
      name: "Answer-ready content",
      score: 18,
      maxScore: 20,
      status: "success" as const,
      details: [
        "Content heeft een duidelijke vraag-en-antwoord structuur",
        "TL;DR sectie is aanwezig",
        "Flesch score is optimaal voor leesbaarheid"
      ]
    },
    {
      id: "authority",
      name: "Autoriteit & citaties",
      score: 10,
      maxScore: 15,
      status: "warning" as const,
      details: [
        "Auteur-bio is aanwezig maar mist expertise-indicatoren",
        "Outbound links naar autoriteitswebsites zijn beperkt",
        "Licentie statements zijn correct geïmplementeerd"
      ]
    }
  ],
  quickWins: [
    {
      module: "Structured Data",
      impact: "high" as const,
      description: "Voeg author property toe aan JSON-LD voor betere autoriteit",
      fix: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "author": {
    "@type": "Person",
    "name": "Auteur Naam",
    "jobTitle": "Functietitel",
    "worksFor": {
      "@type": "Organization",
      "name": "Bedrijfsnaam"
    }
  }
}
</script>`
    },
    {
      module: "Autoriteit & citaties",
      impact: "medium" as const,
      description: "Voeg meer outbound links toe naar autoriteitswebsites",
      fix: "Voeg relevante links toe naar Wikipedia, wetenschappelijke artikelen of erkende bronnen in je content."
    }
  ]
};

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [url, setUrl] = useState("");
  const [fullDomainScan, setFullDomainScan] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const { toast } = useToast();

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
    if (!isValidUrl(url)) {
      toast({
        title: "Ongeldige URL",
        description: "Voer een geldige URL in (inclusief http(s)://)",
        variant: "destructive",
      });
      return;
    }
    setIsScanning(true);
    setProgress(0);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, fullDomainScan }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Er is een fout opgetreden');
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      setScanResult(result);
      setShowResults(true);
    } catch (error) {
      toast({
        title: "Fout",
        description: error instanceof Error ? error.message : 'Er is een fout opgetreden',
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleNewScan = () => {
    setShowResults(false);
    setUrl("");
    setFullDomainScan(false);
    setScanResult(null);
  };

  if (showResults && scanResult) {
    return (
      <div className="container py-8">
        <ScanResults result={scanResult} onNewScan={handleNewScan} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-display font-bold text-midnight">
            Is jouw website LLM-proof?
          </CardTitle>
          <CardDescription className="text-lg text-steel">
            Scan je pagina en ontdek in 10 seconden hoe goed jouw content zichtbaar is in ChatGPT, Claude en Google Gemini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url" className="text-steel">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://voorbeeld.nl"
                className="w-full h-12 text-lg"
                disabled={isScanning}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Toggle 
                id="domain-scan" 
                aria-label="Volledige domeinscan" 
                disabled={isScanning}
                pressed={fullDomainScan}
                onPressedChange={setFullDomainScan}
              >
                Volledige domeinscan
              </Toggle>
              <Label htmlFor="domain-scan" className="text-sm text-steel">
                Scan alle pagina's binnen dit domein
              </Label>
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-lg bg-gradient-to-r from-[#0F45C5] to-[#44A5FF] hover:opacity-90"
              disabled={isScanning}
            >
              {isScanning ? 'Scannen...' : 'Start Analyse'}
            </Button>

            {isScanning && (
              <div className="space-y-4 pt-4">
                <div className="flex justify-between text-sm text-steel">
                  <span>Voortgang</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-steel text-center animate-pulse">
                  {progress < 25 && "Robots.txt en sitemap.xml worden gecontroleerd..."}
                  {progress >= 25 && progress < 50 && "Structured data wordt geanalyseerd..."}
                  {progress >= 50 && progress < 75 && "Content wordt geëvalueerd..."}
                  {progress >= 75 && "Resultaten worden samengesteld..."}
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Info Sectie */}
      <div className="w-full max-w-2xl mt-12 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-midnight mb-4">Hoe het werkt</h2>
          <p className="text-steel">We analyseren je website op 8 cruciale criteria voor LLM-visibility</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Crawl-toegang</CardTitle>
              <CardDescription>Controleert robots.txt en sitemap.xml</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Structured Data</CardTitle>
              <CardDescription>Valideert JSON-LD en schema.org markup</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Answer-ready content</CardTitle>
              <CardDescription>Analyseert content structuur en leesbaarheid</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Autoriteit & citaties</CardTitle>
              <CardDescription>Controleert expertise-indicatoren</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Footer */}
        <footer className="text-center text-steel text-sm">
          <div className="space-x-4 mb-4">
            <a href="/voorwaarden" className="hover:text-midnight">Gebruiksvoorwaarden</a>
            <a href="/privacy" className="hover:text-midnight">Privacy</a>
            <a href="/contact" className="hover:text-midnight">Contact</a>
          </div>
          <p>© 2024 GEO Scanner. Alle rechten voorbehouden.</p>
        </footer>
      </div>
    </div>
  );
} 