'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthModal } from '@/components/auth/AuthModal';

export default function TestAuthPage() {
  const { 
    user, 
    dbUser, 
    loading, 
    isAnonymous, 
    isAuthenticated, 
    displayName,
    signInAnonymously,
    signOut,
    getToken,
    error,
    clearError
  } = useAuth();
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [apiTestResult, setApiTestResult] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);

  const testAuthenticatedAPI = async () => {
    setApiLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setApiTestResult({ error: 'No token available' });
        return;
      }

      const response = await fetch('/api/test-auth', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setApiTestResult(data);
    } catch (error) {
      setApiTestResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setApiLoading(false);
    }
  };

  const testOptionalAuthAPI = async () => {
    setApiLoading(true);
    try {
      const token = await getToken();
      
      const response = await fetch('/api/test-auth', {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setApiTestResult(data);
    } catch (error) {
      setApiTestResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Auth Test Pagina</h1>
        <p className="text-muted-foreground mt-2">
          Test de Firebase Auth + Database integratie
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button 
              variant="link" 
              className="ml-2 p-0 h-auto" 
              onClick={clearError}
            >
              Sluiten
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Auth Status */}
        <Card>
          <CardHeader>
            <CardTitle>Auth Status</CardTitle>
            <CardDescription>Huidige authenticatie status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Loading:</span>
              <Badge variant={loading ? 'default' : 'secondary'}>
                {loading ? 'Ja' : 'Nee'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>User:</span>
              <Badge variant={user ? 'default' : 'secondary'}>
                {user ? 'Ingelogd' : 'Niet ingelogd'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Anonymous:</span>
              <Badge variant={isAnonymous ? 'default' : 'secondary'}>
                {isAnonymous ? 'Ja' : 'Nee'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Authenticated:</span>
              <Badge variant={isAuthenticated ? 'default' : 'secondary'}>
                {isAuthenticated ? 'Ja' : 'Nee'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Display Name:</span>
              <span className="text-sm">{displayName}</span>
            </div>
            
            {user && (
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span>Firebase UID:</span>
                  <span className="text-xs font-mono">{user.uid.substring(0, 8)}...</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Email:</span>
                  <span className="text-sm">{user.email || 'N/A'}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Database User */}
        <Card>
          <CardHeader>
            <CardTitle>Database User</CardTitle>
            <CardDescription>Gesynchroniseerde database gebruiker</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dbUser ? (
              <>
                <div className="flex items-center justify-between">
                  <span>ID:</span>
                  <span className="text-sm">{dbUser.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Email:</span>
                  <span className="text-sm">{dbUser.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Plan:</span>
                  <Badge variant={dbUser.plan_type === 'pro' ? 'default' : 'secondary'}>
                    {dbUser.plan_type}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Credits:</span>
                  <Badge variant="outline">{dbUser.credits_remaining}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Created:</span>
                  <span className="text-xs">{new Date(dbUser.created_at).toLocaleDateString()}</span>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Geen database gebruiker gevonden</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Auth Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Auth Acties</CardTitle>
          <CardDescription>Test verschillende authenticatie acties</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {!user && (
              <>
                <Button onClick={signInAnonymously} disabled={loading}>
                  Anoniem Inloggen
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                  }}
                >
                  Email Login
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setAuthMode('register');
                    setAuthModalOpen(true);
                  }}
                >
                  Registreren
                </Button>
              </>
            )}
            
            {isAnonymous && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setAuthMode('register');
                  setAuthModalOpen(true);
                }}
              >
                Account Upgraden
              </Button>
            )}
            
            {user && (
              <Button variant="destructive" onClick={signOut}>
                Uitloggen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* API Tests */}
      <Card>
        <CardHeader>
          <CardTitle>API Tests</CardTitle>
          <CardDescription>Test de auth middleware endpoints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={testAuthenticatedAPI} 
              disabled={apiLoading || !user}
            >
              Test Authenticated API
            </Button>
            <Button 
              variant="outline" 
              onClick={testOptionalAuthAPI} 
              disabled={apiLoading}
            >
              Test Optional Auth API
            </Button>
          </div>
          
          {apiTestResult && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">API Response:</h4>
              <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                {JSON.stringify(apiTestResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
        isUpgrade={isAnonymous && authMode === 'register'}
      />
    </div>
  );
} 