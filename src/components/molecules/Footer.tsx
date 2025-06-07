import React from 'react';
import Link from 'next/link';
import { Globe, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t bg-white py-8">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
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
            <p className="font-sans text-sm text-gray-600">
              De eerste AI-gereedheid scanner voor websites. Optimaliseer je content voor de toekomst van zoeken.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-sm font-semibold text-[#1a1a1a]">Product</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="#" className="font-sans text-gray-600 hover:text-[#2E9BDA]">
                Features
              </Link>
              <Link href="#" className="font-sans text-gray-600 hover:text-[#2E9BDA]">
                Prijzen
              </Link>
              <Link href="#" className="font-sans text-gray-600 hover:text-[#2E9BDA]">
                API
              </Link>
              <Link href="#" className="font-sans text-gray-600 hover:text-[#2E9BDA]">
                Changelog
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-sm font-semibold text-[#1a1a1a]">Bedrijf</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="#" className="font-sans text-gray-600 hover:text-[#2E9BDA]">
                Over ons
              </Link>
              <Link href="#" className="font-sans text-gray-600 hover:text-[#2E9BDA]">
                Blog
              </Link>
              <Link href="#" className="font-sans text-gray-600 hover:text-[#2E9BDA]">
                Contact
              </Link>
              <Link href="#" className="font-sans text-gray-600 hover:text-[#2E9BDA]">
                Careers
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-sm font-semibold text-[#1a1a1a]">Support</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="#" className="font-sans text-gray-600 hover:text-[#2E9BDA]">
                Help Center
              </Link>
              <Link href="#" className="font-sans text-gray-600 hover:text-[#2E9BDA]">
                Privacy
              </Link>
              <Link href="#" className="font-sans text-gray-600 hover:text-[#2E9BDA]">
                Voorwaarden
              </Link>
              <Link href="#" className="font-sans text-gray-600 hover:text-[#2E9BDA]">
                Status
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-sans text-xs text-gray-500">
            © {new Date().getFullYear()} AIO Scanner. Alle rechten voorbehouden.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-gray-400 hover:text-[#2E9BDA]">
              <Globe className="h-4 w-4" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-[#2E9BDA]">
              <Twitter className="h-4 w-4" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-[#2E9BDA]">
              <Instagram className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 