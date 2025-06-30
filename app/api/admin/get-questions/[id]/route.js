import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params; // id is a string
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Fetch the question by ID
  const question = await prisma.question.findUnique({
    where: { id: parseInt(id, 10) },
    select: {
      id: true,
      subject: true,
      topic: true,
      question_text: true,
      option_1: true,
      option_2: true,
      option_3: true,
      option_4: true,
      correct_option: true,
    },
  });

  if (!question) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  }

  return NextResponse.json({ question });
}
