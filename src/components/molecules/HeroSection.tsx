import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScanResult } from '@/lib/types';

interface HeroSectionProps {
  onScanComplete: (result: ScanResult) => void;
}

export function HeroSection({ onScanComplete }: HeroSectionProps) {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsScanning(true);
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error('Scan mislukt');

      const result = await response.json();
      onScanComplete(result);
    } catch (error) {
      console.error('Scan error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <Badge variant="v0-blue">🚀 Eerste AI-gereedheid scanner</Badge>
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl text-v0-dark">
                Is jouw website <span className="text-v0-blue">LLM-proof</span>?
              </h1>
              <p className="font-sans max-w-[600px] text-gray-600 text-lg md:text-xl">
                Ontdek hoe goed jouw website vindbaar is voor AI-systemen zoals ChatGPT, Perplexity en Google Gemini. Krijg concrete verbeteringen om voorop te lopen.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
              <Input
                variant="v0"
                placeholder="https://jouwwebsite.nl"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isScanning}
              />
              <Button variant="v0-blue" size="v0-lg" disabled={isScanning}>
                {isScanning ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Bezig met scannen...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    Scan je site
                  </>
                )}
              </Button>
            </form>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-green-500"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="m9 11 3 3L22 4" />
                </svg>
                <span>Gratis eerste scan</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-green-500"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="m9 11 3 3L22 4" />
                </svg>
                <span>Geen registratie vereist</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-v0-blue/5 to-v0-orange/5 p-4 rounded-lg border border-v0-blue/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Voorbeeld AI-vindbaarheid:</span>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-v0-blue">86%</div>
                  <Badge variant="v0-success">Goed</Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-80 h-80 rounded-full border-8 border-v0-blue/20 flex items-center justify-center bg-gradient-to-br from-v0-blue/10 to-v0-orange/10 animate-spin-slow">
                <div className="w-60 h-60 rounded-full border-4 border-v0-blue/40 flex items-center justify-center bg-white/80">
                  <div className="text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-16 w-16 text-v0-blue mx-auto mb-4"
                    >
                      <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34" />
                      <path d="M4 6h.01" />
                      <path d="M2.29 9.62A10 10 0 1 0 21.31 8.35" />
                      <path d="M16.24 7.76A6 6 0 1 0 8.23 16.67" />
                      <path d="M12 18h.01" />
                      <path d="M17.99 11.66A6 6 0 0 1 15.77 16.67" />
                      <circle cx="12" cy="12" r="2" />
                      <path d="m13.41 10.59 5.66-5.66" />
                    </svg>
                    <div className="font-display text-3xl font-bold text-v0-blue mb-2">AI Scan</div>
                    <div className="font-sans text-sm text-gray-600">Realtime analyse</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg border border-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-v0-orange"
                >
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
                </svg>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg border border-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-v0-red"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 