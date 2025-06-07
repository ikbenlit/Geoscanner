import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 ${className}`}>
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#1a1a1a]">
            <div className="grid grid-cols-2 gap-0.5 h-5 w-5">
              <div className="rounded-sm bg-[#2E9BDA]"></div>
              <div className="rounded-sm bg-[#F5B041]"></div>
              <div className="rounded-sm bg-[#E74C3C]"></div>
              <div className="rounded-sm bg-[#F5B041]"></div>
            </div>
          </div>
          <span className="font-display text-xl font-bold text-[#1a1a1a]">AIO Scanner</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="#features" className="font-sans text-gray-600 hover:text-[#2E9BDA] transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="font-sans text-gray-600 hover:text-[#2E9BDA] transition-colors">
            Prijzen
          </Link>
          <Link href="#" className="font-sans text-gray-600 hover:text-[#2E9BDA] transition-colors">
            Blog
          </Link>
          <Button size="sm" className="font-sans bg-[#2E9BDA] hover:bg-[#2580c4] text-white">
            Inloggen
          </Button>
        </nav>
      </div>
    </header>
  );
} 