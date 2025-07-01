import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      testRecords: {
        include: { question: true },
      },
      performance: true, // ✅ include PerformanceAnalysis data
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const topicStats = {};

  for (const record of user.testRecords) {
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
      accuracy: stats.correct / stats.total,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  const weakTopics = sortedTopics.filter((t) => t.accuracy < 0.8).slice(0, 3);
  const strongTopics = sortedTopics.filter((t) => t.accuracy >= 0.8).slice(-3).reverse();

  // ✅ Return all required data for dashboard
  return NextResponse.json({
    totalTests: user.performance?.total_tests || 0,
    avgScore: user.performance?.avg_score || 0,
    lastAttempt: user.performance?.last_attempt || null,
    weakTopics,
    strongTopics,
  });
}
