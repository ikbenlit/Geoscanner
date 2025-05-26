'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { AuthModal } from './AuthModal';
import { 
  User, 
  LogOut, 
  Settings, 
  CreditCard, 
  History,
  Crown,
  UserPlus
} from 'lucide-react';

export function UserMenu() {
  const { 
    user, 
    dbUser, 
    loading, 
    isAnonymous, 
    isAuthenticated, 
    displayName, 
    signOut 
  } = useAuth();
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleSignOut = async () => {
    await signOut();
  };

  const openLoginModal = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthMode('register');
    setAuthModalOpen(true);
  };

  const openUpgradeModal = () => {
    setAuthMode('register');
    setAuthModalOpen(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
      </div>
    );
  }

  // Not authenticated - show login/register buttons
  if (!user) {
    return (
      <>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={openLoginModal}>
            Inloggen
          </Button>
          <Button onClick={openRegisterModal}>
            Registreren
          </Button>
        </div>
        
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultMode={authMode}
        />
      </>
    );
  }

  // Anonymous user - show upgrade option
  if (isAnonymous) {
    return (
      <>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            Anoniem
          </Badge>
          <Button size="sm" onClick={openUpgradeModal}>
            <UserPlus className="h-4 w-4 mr-1" />
            Account Maken
          </Button>
        </div>
        
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultMode="register"
          showAnonymousOption={false}
          isUpgrade={true}
        />
      </>
    );
  }

  // Authenticated user - show user menu
  return (
    <>
      <div className="flex items-center space-x-2">
        {/* Credits display */}
        {dbUser && (
          <div className="flex items-center space-x-1 text-sm">
            <CreditCard className="h-4 w-4" />
            <span>{dbUser.credits_remaining} credits</span>
          </div>
        )}

        {/* Plan badge */}
        {dbUser && (
          <Badge 
            variant={dbUser.plan_type === 'pro' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {dbUser.plan_type === 'pro' && <Crown className="h-3 w-3 mr-1" />}
            {dbUser.plan_type.charAt(0).toUpperCase() + dbUser.plan_type.slice(1)}
          </Badge>
        )}

        {/* User dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Instellingen</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem>
              <History className="mr-2 h-4 w-4" />
              <span>Scan Geschiedenis</span>
            </DropdownMenuItem>
            
            {dbUser?.plan_type === 'free' && (
              <DropdownMenuItem>
                <Crown className="mr-2 h-4 w-4" />
                <span>Upgrade Plan</span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Credits Bijkopen</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Uitloggen</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
} 