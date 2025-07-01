// app/api/admin/add-question/route.js
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const data = await req.json();
  const { subject, topic, question_text, option_1, option_2, option_3, option_4, correct_option, difficulty } = data;

  if (!subject || !topic || !question_text || !option_1 || !option_2 || !option_3 || !option_4 || !correct_option) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    const newQuestion = await prisma.question.create({
      data: {
        subject,
        topic,
        question_text,
        option_1,
        option_2,
        option_3,
        option_4,
        correct_option,
        difficulty,
      },
    });

    return NextResponse.json({ success: true, question: newQuestion });
  } catch (err) {
    console.error('Error adding question:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
