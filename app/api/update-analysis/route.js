import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { score, weak_topics, strength_topics } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const existing = await prisma.performanceAnalysis.findUnique({
    where: { userId: user.id },
  });

  if (existing) {
    const new_total = existing.total_tests + 1;
    const new_avg = (existing.avg_score * existing.total_tests + score) / new_total;

    await prisma.performanceAnalysis.update({
      where: { userId: user.id },
      data: {
        total_tests: new_total,
        avg_score: new_avg,
        weak_topics,
        strength_topics,
        last_attempt: new Date(),
      },
    });
  } else {
    await prisma.performanceAnalysis.create({
      data: {
        userId: user.id,
        total_tests: 1,
        avg_score: score,
        weak_topics,
        strength_topics,
        last_attempt: new Date(),
      },
    });
  }

  return NextResponse.json({ success: true });
}

export const dynamic = 'force-dynamic';