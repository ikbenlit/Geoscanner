import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export function PricingSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-[#f8f9fa]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge className="bg-[#F5B041]/10 text-[#F5B041] hover:bg-[#F5B041]/20">
              Prijzen
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#1a1a1a]">
              Kies het Plan dat bij Je Past
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Van eenmalige scans tot onbeperkte toegang - wij hebben het juiste plan voor jouw behoeften
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-8">
          {/* Free Tier */}
          <Card className="flex flex-col p-6 bg-white border-2 border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#1a1a1a]">Free</h3>
              <p className="text-gray-500">Perfect voor eenmalige scans</p>
              <div className="text-4xl font-bold text-[#1a1a1a]">€0</div>
            </div>
            <ul className="space-y-2 mt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-gray-600">1 scan per maand</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-gray-600">Basis SEO analyse</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-gray-600">Technische check</span>
              </li>
            </ul>
            <Button className="mt-6 w-full bg-gray-600 hover:bg-gray-700 text-white">
              Start Gratis
            </Button>
          </Card>

          {/* Starter Tier */}
          <Card className="flex flex-col p-6 bg-white border-2 border-[#2E9BDA] relative transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2E9BDA] text-white">
              Populair
            </Badge>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#1a1a1a]">Starter</h3>
              <p className="text-gray-500">Voor groeiende websites</p>
              <div className="text-4xl font-bold text-[#1a1a1a]">€29<span className="text-lg">/maand</span></div>
            </div>
            <ul className="space-y-2 mt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-gray-600">10 scans per maand</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-gray-600">Uitgebreide SEO analyse</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-gray-600">Content optimalisatie</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-gray-600">Competitor analyse</span>
              </li>
            </ul>
            <Button className="mt-6 w-full bg-[#2E9BDA] hover:bg-[#2E9BDA]/90 text-white">
              Start Proefperiode
            </Button>
          </Card>

          {/* Pro Tier */}
          <Card className="flex flex-col p-6 bg-white border-2 border-[#F5B041] transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#1a1a1a]">Pro</h3>
              <p className="text-gray-500">Voor professionele websites</p>
              <div className="text-4xl font-bold text-[#1a1a1a]">€99<span className="text-lg">/maand</span></div>
            </div>
            <ul className="space-y-2 mt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-gray-600">Onbeperkte scans</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-gray-600">AI-gestuurde optimalisatie</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-gray-600">Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-gray-600">API toegang</span>
              </li>
            </ul>
            <Button className="mt-6 w-full bg-[#F5B041] hover:bg-[#F5B041]/90 text-white">
              Start Proefperiode
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
} 