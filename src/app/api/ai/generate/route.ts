import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  const response = NextResponse.json({ status: 'ok' });

  response.cookies.set('auth-token', idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ status: 'ok' });
  response.cookies.delete('auth-token');
  return response;
}