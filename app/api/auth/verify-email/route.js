import { generateEmailToken, sendVerificationEmail } from '@/lib/sendVerificationEmail';
import { NextResponse } from 'next/server';
import { tempStore } from '@/lib/teamSignupCache'; 
export const dynamic = 'force-dynamic';

export async function POST(req) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const token = generateEmailToken();
  tempStore.set(email, { token, name, password, timestamp: Date.now() });

  await sendVerificationEmail(email, token);

  return NextResponse.json({ message: 'Verification code sent to email.' });
}
