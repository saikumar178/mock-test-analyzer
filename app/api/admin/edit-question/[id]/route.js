// app/api/admin/edit-question/[id]/route.js
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const questionId = parseInt(params.id);
  const data = await req.json();

  const {
    subject,
    topic,
    question_text,
    option_1,
    option_2,
    option_3,
    option_4,
    correct_option,
  } = data;

  if (!subject || !topic || !question_text || !correct_option) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const updated = await prisma.question.update({
      where: { id: questionId },
      data: {
        subject,
        topic,
        question_text,
        option_1,
        option_2,
        option_3,
        option_4,
        correct_option,
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
