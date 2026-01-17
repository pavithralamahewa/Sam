import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    hasApiKey: !!process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
    timestamp: new Date().toISOString()
  });
}
