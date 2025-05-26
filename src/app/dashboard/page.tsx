'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, History, User, Zap } from 'lucide-react';
import CreditPurchase from '@/components/payment/CreditPurchase';
import { useRouter, useSearchParams } from 'next/navigation';

interface UserCredits {
  credits_remaining: number;
  plan_type: string;
  recent_transactions: Array<{
    id: number;
    transaction_type: string;
    credits_change: number;
    description: string;
    created_at: string;
  }>;
  user_info: {
    email: string;
    created_at: string;
    updated_at: string;
  };
}

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check voor payment status
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      // Refresh credits na succesvolle betaling
      fetchCredits();
    } else if (paymentStatus === 'cancelled') {
      // Toon cancelled message
      console.log('Payment was cancelled');
    }
  }, [searchParams]);

  const fetchCredits = async () => {
    if (!user || !isAuthenticated) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/user/credits', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCredits(data);
      } else {
        console.error('Failed to fetch credits');
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCredits();
    } else if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Dashboard laden...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect wordt afgehandeld in useEffect
  }

  const getPlanBadgeVariant = (planType: string) => {
    switch (planType) {
      case 'pro': return 'default';
      case 'starter': return 'secondary';
      default: return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Beheer je credits en bekijk je scan geschiedenis
          </p>
        </div>
        
        {credits && (
          <Card className="w-fit">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{credits.credits_remaining}</p>
                  <p className="text-sm text-muted-foreground">Credits over</p>
                </div>
                <Badge variant={getPlanBadgeVariant(credits.plan_type)}>
                  {credits.plan_type}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Payment Success Message */}
      {searchParams.get('payment') === 'success' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-green-800">
              <CreditCard className="w-5 h-5" />
              <p className="font-medium">Betaling succesvol! Je credits zijn toegevoegd.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="purchase">Credits Kopen</TabsTrigger>
          <TabsTrigger value="history">Geschiedenis</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Credits Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Credit Saldo
                </CardTitle>
                <CardDescription>
                  Je huidige credit status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {credits ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-primary">
                        {credits.credits_remaining}
                      </p>
                      <p className="text-muted-foreground">Credits beschikbaar</p>
                    </div>
                    
                    <div className="flex justify-center">
                      <Badge variant={getPlanBadgeVariant(credits.plan_type)} className="text-sm">
                        {credits.plan_type.charAt(0).toUpperCase() + credits.plan_type.slice(1)} Plan
                      </Badge>
                    </div>

                    {credits.credits_remaining === 0 && (
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-3">
                          Je hebt geen credits meer. Koop nieuwe credits om door te gaan.
                        </p>
                        <Button onClick={() => router.push('/dashboard?tab=purchase')}>
                          Credits Kopen
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>Laden...</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Recente Activiteit
                </CardTitle>
                <CardDescription>
                  Je laatste credit transacties
                </CardDescription>
              </CardHeader>
              <CardContent>
                {credits?.recent_transactions.length ? (
                  <div className="space-y-3">
                    {credits.recent_transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(transaction.created_at)}
                          </p>
                        </div>
                        <Badge variant={transaction.credits_change > 0 ? 'default' : 'secondary'}>
                          {transaction.credits_change > 0 ? '+' : ''}{transaction.credits_change}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nog geen transacties</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="purchase">
          <CreditPurchase />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Credit Geschiedenis</CardTitle>
              <CardDescription>
                Alle je credit transacties
              </CardDescription>
            </CardHeader>
            <CardContent>
              {credits?.recent_transactions.length ? (
                <div className="space-y-3">
                  {credits.recent_transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex-1">
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(transaction.created_at)} • {transaction.transaction_type}
                        </p>
                      </div>
                      <Badge variant={transaction.credits_change > 0 ? 'default' : 'secondary'}>
                        {transaction.credits_change > 0 ? '+' : ''}{transaction.credits_change} credits
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nog geen transacties gevonden
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Informatie
              </CardTitle>
            </CardHeader>
            <CardContent>
              {credits ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">{credits.user_info.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Plan Type</label>
                    <p className="text-sm text-muted-foreground">{credits.plan_type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Lid sinds</label>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(credits.user_info.created_at)}
                    </p>
                  </div>
                </div>
              ) : (
                <p>Laden...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 