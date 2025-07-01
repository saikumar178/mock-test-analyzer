import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import { tempStore } from '@/lib/teamSignupCache'; 

export async function POST(req) {
  const { email, verificationCode } = await req.json();
  const data = tempStore.get(email);

  if (!data) return NextResponse.json({ error: 'No signup request found.' }, { status: 400 });
  if (data.token !== verificationCode) return NextResponse.json({ error: 'Invalid code.' }, { status: 400 });

  const isExpired = Date.now() - data.timestamp > 10 * 60 * 1000;
  if (isExpired) return NextResponse.json({ error: 'Code expired.' }, { status: 400 });

  const hashedPassword = await hash(data.password, 10);

  await prisma.user.create({
    data: {
      name: data.name,
      email,
      password_hash: hashedPassword,
      isVerified: true,
    },
  });

  tempStore.delete(email);
  return NextResponse.json({ message: 'Signup complete. You can now log in.' });
}

export const dynamic = 'force-dynamic';