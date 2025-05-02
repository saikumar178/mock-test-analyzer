import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const attemptId = parseInt(params.attemptId);

  const attempt = await prisma.testAttempt.findUnique({
    where: { id: attemptId },
    include: {
      records: {
        include: {
          question: true,
        },
      },
    },
  });

  if (!attempt) {
    return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
  }

  return NextResponse.json({ attempt });
}
