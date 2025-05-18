import { NextResponse } from 'next/server';
import { Scanner } from '@/lib/scanner';

export async function POST(request: Request) {
  try {
    const { url, fullDomainScan } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is verplicht' },
        { status: 400 }
      );
    }

    const result = await Scanner.scan(url, { fullDomainScan });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden tijdens het scannen' },
      { status: 500 }
    );
  }
} 