'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ScanResults } from '@/components/scan-results';
import { Header } from '@/components/molecules/Header';
import { HeroSection } from '@/components/molecules/HeroSection';
import { FeaturesSection } from '@/components/molecules/FeaturesSection';
import { PricingSection } from '@/components/molecules/PricingSection';
import { Footer } from '@/components/molecules/Footer';
import { ScanResult } from '@/lib/types';

export default function Home() {
  const [showResults, setShowResults] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const { toast } = useToast();

  const handleNewScan = () => {
    setShowResults(false);
    setScanResult(null);
  };

  const handleScanComplete = (result: ScanResult) => {
    setScanResult(result);
    setShowResults(true);
  };

  if (showResults && scanResult) {
    return (
      <div className="container py-8">
        <ScanResults result={scanResult} onNewScan={handleNewScan} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa]">
      <Header />
      <main className="flex-1">
        <HeroSection onScanComplete={handleScanComplete} />
        <FeaturesSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
