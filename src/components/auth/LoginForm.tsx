'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  showAnonymousOption?: boolean;
}

export function LoginForm({ 
  onSuccess, 
  onSwitchToRegister, 
  showAnonymousOption = true 
}: LoginFormProps) {
  const { signInUser, signInAnonymously, sendPasswordReset, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!formData.email || !formData.password) {
      return;
    }

    try {
      await signInUser(formData);
      onSuccess?.();
    } catch (error) {
      // Error is handled by auth context
    }
  };

  const handleAnonymousSignIn = async () => {
    clearError();
    try {
      await signInAnonymously();
      onSuccess?.();
    } catch (error) {
      // Error is handled by auth context
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      return;
    }

    try {
      await sendPasswordReset(formData.email);
      setResetEmailSent(true);
    } catch (error) {
      // Error is handled by auth context
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    clearError();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Inloggen</CardTitle>
        <CardDescription className="text-center">
          Log in op je GEO Scanner account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {resetEmailSent && (
          <Alert>
            <AlertDescription>
              Wachtwoord reset email verzonden naar {formData.email}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="je@email.com"
                value={formData.email}
                onChange={handleInputChange('email')}
                className="pl-10"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Wachtwoord</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange('password')}
                className="pl-10 pr-10"
                required
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="link"
              className="px-0 text-sm"
              onClick={handlePasswordReset}
              disabled={loading || !formData.email}
            >
              Wachtwoord vergeten?
            </Button>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !formData.email || !formData.password}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inloggen...
              </>
            ) : (
              'Inloggen'
            )}
          </Button>
        </form>

        {showAnonymousOption && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Of
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleAnonymousSignIn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Bezig...
                </>
              ) : (
                'Doorgaan zonder account (Gratis scan)'
              )}
            </Button>
          </>
        )}

        {onSwitchToRegister && (
          <div className="text-center text-sm">
            Nog geen account?{' '}
            <Button
              type="button"
              variant="link"
              className="px-0"
              onClick={onSwitchToRegister}
              disabled={loading}
            >
              Registreren
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 