import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge className="bg-[#2E9BDA]/10 text-[#2E9BDA] hover:bg-[#2E9BDA]/20">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#1a1a1a]">
              Geavanceerde SEO & Technische Analyse
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Onze AI-gestuurde scanner analyseert je website op alle belangrijke aspecten van SEO en technische optimalisatie
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          <Card className="flex flex-col p-6 bg-white border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <h3 className="text-xl font-bold text-[#1a1a1a]">Technische SEO</h3>
            </div>
            <p className="text-gray-600">
              Analyseer de technische structuur van je website, inclusief robots.txt, sitemap.xml en HTML-optimalisatie
            </p>
          </Card>
          <Card className="flex flex-col p-6 bg-white border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <h3 className="text-xl font-bold text-[#1a1a1a]">Content Analyse</h3>
            </div>
            <p className="text-gray-600">
              Evalueer de kwaliteit en relevantie van je content voor zoekmachines en gebruikers
            </p>
          </Card>
          <Card className="flex flex-col p-6 bg-white border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <h3 className="text-xl font-bold text-[#1a1a1a]">Structured Data</h3>
            </div>
            <p className="text-gray-600">
              Controleer en optimaliseer je structured data implementatie voor betere zoekresultaten
            </p>
          </Card>
          <Card className="flex flex-col p-6 bg-white border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <h3 className="text-xl font-bold text-[#1a1a1a]">Authority Check</h3>
            </div>
            <p className="text-gray-600">
              Analyseer de autoriteit en betrouwbaarheid van je website in je niche
            </p>
          </Card>
          <Card className="flex flex-col p-6 bg-white border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <h3 className="text-xl font-bold text-[#1a1a1a]">Freshness Score</h3>
            </div>
            <p className="text-gray-600">
              Evalueer hoe actueel en relevant je content is voor je doelgroep
            </p>
          </Card>
          <Card className="flex flex-col p-6 bg-white border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <h3 className="text-xl font-bold text-[#1a1a1a]">Cross-Web Analyse</h3>
            </div>
            <p className="text-gray-600">
              Vergelijk je website met concurrenten en identificeer verbeterpunten
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
} 