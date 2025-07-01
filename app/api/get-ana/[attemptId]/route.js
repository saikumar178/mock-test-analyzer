import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const attemptId = parseInt(params.attemptId, 10);

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

  const topicStats = {};

  for (const record of attempt.records) {
    const topic = record.question.topic || 'General';
    if (!topicStats[topic]) {
      topicStats[topic] = { total: 0, correct: 0 };
    }
    topicStats[topic].total += 1;
    if (record.correct) topicStats[topic].correct += 1;
  }

  const sortedTopics = Object.entries(topicStats)
    .map(([topic, stats]) => ({
      topic,
      accuracy: parseFloat(((stats.correct / stats.total) * 100).toFixed(1)),

    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  const weakTopics = sortedTopics.filter((t) => t.accuracy < 0.8).slice(0, 3);
  const strongTopics = sortedTopics.filter((t) => t.accuracy >= 0.8).slice(-3).reverse();

  return NextResponse.json({
    attemptId: attempt.id,
    date: attempt.date || attempt.createdAt || null,
    weakTopics,
    strongTopics,
  });
}
