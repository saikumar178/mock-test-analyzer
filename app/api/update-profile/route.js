// app/api/update-profile/route.js
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name } = await req.json();

  const updatedUser = await prisma.user.update({
    where: { email: session.user.email },
    data: { name },
  });

  return NextResponse.json({ success: true, updatedUser });
}

export const dynamic = 'force-dynamic';