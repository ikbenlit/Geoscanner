'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  isUpgrade?: boolean; // For upgrading anonymous users
}

export function RegisterForm({ 
  onSuccess, 
  onSwitchToLogin,
  isUpgrade = false
}: RegisterFormProps) {
  const { registerUser, upgradeAnonymous, loading, error, clearError, isAnonymous } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    // Validation
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      // This would be handled by a validation library in production
      return;
    }

    if (!formData.acceptTerms) {
      return;
    }

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName || undefined,
      };

      if (isUpgrade && isAnonymous) {
        await upgradeAnonymous(userData);
      } else {
        await registerUser(userData);
      }
      
      onSuccess?.();
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

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      acceptTerms: checked
    }));
    clearError();
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const isPasswordValid = formData.password.length >= 6;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {isUpgrade ? 'Account Upgraden' : 'Registreren'}
        </CardTitle>
        <CardDescription className="text-center">
          {isUpgrade 
            ? 'Upgrade je anonieme account naar een volledig account'
            : 'Maak een nieuw GEO Scanner account aan'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Naam (optioneel)</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="displayName"
                type="text"
                placeholder="Je naam"
                value={formData.displayName}
                onChange={handleInputChange('displayName')}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
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
            <Label htmlFor="password">Wachtwoord *</Label>
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
            {formData.password && !isPasswordValid && (
              <p className="text-sm text-destructive">
                Wachtwoord moet minimaal 6 karakters bevatten
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Bevestig Wachtwoord *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                className="pl-10 pr-10"
                required
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {formData.confirmPassword && !passwordsMatch && (
              <p className="text-sm text-destructive">
                Wachtwoorden komen niet overeen
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={handleCheckboxChange}
              disabled={loading}
            />
            <Label htmlFor="acceptTerms" className="text-sm">
              Ik ga akkoord met de{' '}
              <a href="/terms" className="text-primary hover:underline" target="_blank">
                algemene voorwaarden
              </a>{' '}
              en{' '}
              <a href="/privacy" className="text-primary hover:underline" target="_blank">
                privacybeleid
              </a>
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={
              loading || 
              !formData.email || 
              !formData.password || 
              !formData.confirmPassword ||
              !passwordsMatch ||
              !isPasswordValid ||
              !formData.acceptTerms
            }
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUpgrade ? 'Upgraden...' : 'Registreren...'}
              </>
            ) : (
              isUpgrade ? 'Account Upgraden' : 'Account Aanmaken'
            )}
          </Button>
        </form>

        {onSwitchToLogin && !isUpgrade && (
          <div className="text-center text-sm">
            Al een account?{' '}
            <Button
              type="button"
              variant="link"
              className="px-0"
              onClick={onSwitchToLogin}
              disabled={loading}
            >
              Inloggen
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 