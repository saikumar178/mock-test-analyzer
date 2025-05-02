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

    // ✅ Get the logged-in user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ✅ Fetch all questions attempted
    const questions = await prisma.question.findMany({
      where: {
        id: { in: Object.keys(answers).map(id => parseInt(id)) }
      }
    });

    let score = 0;

    // ✅ Create a new TestAttempt
    const newAttempt = await prisma.TestAttempt.create({
      data: {
        userId: user.id,
        started_at: new Date(),
        score:0,
      },
    });

    // ✅ Save each TestRecord linked to the attempt
    for (const question of questions) {
      const selected = answers[question.id];
      const isCorrect = selected === question.correct_option;
      if (isCorrect) score += 1;

      await prisma.TestRecord.create({
        data: {
          userId: user.id,
          questionId: question.id,
          selected_option: selected,
          correct: isCorrect,
          test_date: new Date(),
          attemptId: newAttempt.id,  // ✅ Link this TestRecord to the Attempt
        },
      });
    }

    // ✅ Update the attempt with final score
    await prisma.TestAttempt.update({
      where: { id: newAttempt.id },
      data: {
        score: score,
        completed_at: new Date(),
      },
    });

    // ✅ Update or create the PerformanceAnalysis

    const totalTests = await prisma.TestAttempt.count({
      where: { userId: user.id },
    });

    const totalCorrectAnswers = await prisma.TestRecord.count({
      where: { userId: user.id, correct: true },
    });

    const avgScore = totalCorrectAnswers / totalTests;

    await prisma.PerformanceAnalysis.upsert({
      where: { userId: user.id },
      update: {
        total_tests: totalTests,
        avg_score: avgScore,
        last_attempt: new Date(),
      },
      create: {
        userId: user.id,
        total_tests: totalTests,
        avg_score: avgScore,
        last_attempt: new Date(),
      },
    });

    // ✅ Return success
    return NextResponse.json({ success: true, score });
    
  } catch (error) {
    console.error('❌ Submission error:', error);
    return NextResponse.json({ error: 'Submission failed', message: error.message }, { status: 500 });
  }
}
