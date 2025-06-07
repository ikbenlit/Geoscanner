// src/app/layout.tsx (Server Component)
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import RootClientLayout from './root-client-layout'; // Importeer je client layout
import './globals.css'; // Behoud globale stijlen hier

const sourceSans = localFont({
  src: [
    {
      path: '../../public/fonts/source-sans-3-v18-latin-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/source-sans-3-v18-latin-500.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/source-sans-3-v18-latin-600.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/source-sans-3-v18-latin-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-source-sans',
});

const sourceCodePro = localFont({
  src: [
    {
      path: '../../public/fonts/source-code-pro-v30-latin-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/source-code-pro-v30-latin-500.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/source-code-pro-v30-latin-600.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-source-code-pro',
});

const lora = localFont({
  src: [
    {
      path: '../../public/fonts/Lora-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Lora-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Lora-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Lora-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-lora',
});

const poppins = localFont({
  src: [
    {
      path: '../../public/fonts/Poppins-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Poppins-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Poppins-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Poppins-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'GEO Scanner',
  description: 'Analyseer en optimaliseer uw website voor AI-zoekmachines',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${sourceSans.variable} ${sourceCodePro.variable} ${lora.variable} ${poppins.variable}`}>
      <body>
        <RootClientLayout>{children}</RootClientLayout>
      </body>
    </html>
  );
}
