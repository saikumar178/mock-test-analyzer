import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { answers } = await req.json();
    if (!answers || Object.keys(answers).length === 0) {
      return NextResponse.json({ error: 'No answers provided' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const questions = await prisma.question.findMany({
      where: {
        id: { in: Object.keys(answers).map(id => parseInt(id)) }
      }
    });

    let score = 0;

    const newAttempt = await prisma.testAttempt.create({
      data: {
        userId: user.id,
        score: 0,
        started_at: new Date(),
      },
    });

    for (const question of questions) {
      const selected = answers[question.id];
      const isCorrect = selected === question.correct_option;
      if (isCorrect) score += 1;

      await prisma.testRecord.create({
        data: {
          userId: user.id,
          questionId: question.id,
          selected_option: selected,
          correct: isCorrect,
          test_date: new Date(),
          attemptId: newAttempt.id,
        },
      });
    }

    await prisma.testAttempt.update({
      where: { id: newAttempt.id },
      data: {
        score,
        completed_at: new Date(),
      },
    });

    const allAttempts = await prisma.testAttempt.findMany({
      where: { userId: user.id },
    });

    const totalTestsCount = allAttempts.length;
    const totalScore = allAttempts.reduce((sum, a) => sum + a.score, 0);
    const avgScore = totalTestsCount > 0 ? totalScore / totalTestsCount : 0;

    await prisma.performanceAnalysis.upsert({
      where: { userId: user.id },
      update: {
        total_tests: totalTestsCount,
        avg_score: avgScore,
        last_attempt: new Date(),
      },
      create: {
        userId: user.id,
        total_tests: totalTestsCount,
        avg_score: avgScore,
        last_attempt: new Date(),
      },
    });

    return NextResponse.json({ success: true, score });
  } catch (error) {
    console.error('❌ Submission error:', error);
    return NextResponse.json({ error: 'Submission failed', message: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';