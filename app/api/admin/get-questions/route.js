
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  console.log('Session:', session?.user.role);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const questions = await prisma.question.findMany({
    select: {
      id: true,
      subject: true,
      topic: true,
      question_text: true,
      correct_option: true,
    },
    orderBy: { id: 'desc' },
  });

  return NextResponse.json({ questions });
}
