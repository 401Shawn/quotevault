import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    // Exchange the code for a session - but since we're using client-side auth,
    // we just redirect back and the client picks up the session
    return NextResponse.redirect(`${origin}/`);
  }

  return NextResponse.redirect(`${origin}/auth/login?error=Could not authenticate`);
}
