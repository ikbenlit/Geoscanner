'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Zap, Star } from 'lucide-react';
import { redirectToCheckout } from '@/lib/stripe/client';
import { useAuth } from '@/lib/auth-context';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  description: string;
  popular?: boolean;
  features: string[];
}

const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 2,
    price: 19.95,
    description: 'Perfect voor kleine websites',
    features: [
      '2 uitgebreide scans',
      'PDF rapporten',
      'Email ondersteuning',
      '30 dagen geschiedenis',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    credits: 5,
    price: 49.95,
    description: 'Voor professionele optimalisatie',
    popular: true,
    features: [
      '5 AI-enhanced scans',
      'Implementatie roadmap',
      'Code snippets',
      'Concurrentie benchmarking',
      '90 dagen geschiedenis',
    ],
  },
  {
    id: 'extra_credits',
    name: 'Extra Credit',
    credits: 1,
    price: 9.95,
    description: 'Eenmalige extra scan',
    features: [
      '1 extra scan',
      'Alle Pro features',
      'Flexibel bijkopen',
    ],
  },
];

export default function CreditPurchase() {
  const [loading, setLoading] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const handlePurchase = async (packageId: string) => {
    if (!isAuthenticated || !user) {
      alert('Je moet ingelogd zijn om credits te kopen');
      return;
    }

    setLoading(packageId);

    try {
      // Maak checkout sessie aan
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          packageType: packageId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Er ging iets mis');
      }

      const { sessionId } = await response.json();
      
      // Redirect naar Stripe Checkout
      await redirectToCheckout(sessionId);

    } catch (error) {
      console.error('Purchase error:', error);
      alert(error instanceof Error ? error.message : 'Er ging iets mis bij het aanmaken van de betaling');
    } finally {
      setLoading(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Log in om credits te kopen
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Koop Credits</h2>
        <p className="text-muted-foreground mt-2">
          Kies het pakket dat bij jouw behoeften past
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {CREDIT_PACKAGES.map((package_) => (
          <Card 
            key={package_.id} 
            className={`relative ${package_.popular ? 'border-primary shadow-lg' : ''}`}
          >
            {package_.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Star className="w-3 h-3 mr-1" />
                Populair
              </Badge>
            )}
            
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {package_.id === 'pro' && <Zap className="w-5 h-5 text-yellow-500" />}
                {package_.name}
              </CardTitle>
              <CardDescription>{package_.description}</CardDescription>
              
              <div className="text-3xl font-bold">
                €{package_.price.toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  / {package_.credits} credit{package_.credits > 1 ? 's' : ''}
                </span>
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-2 mb-6">
                {package_.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handlePurchase(package_.id)}
                disabled={loading === package_.id}
                className="w-full"
                variant={package_.popular ? 'default' : 'outline'}
              >
                {loading === package_.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Bezig...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Koop Nu
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Veilig betalen met Stripe • Ondersteunt iDEAL en creditcards</p>
      </div>
    </div>
  );
} 