import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      testAttempts: {
        orderBy: { completed_at: 'desc' },
        include: {
          records: {
            include: { question: true }
          }
        }
      }
    },
  });

  const attempts = user?.testAttempts || [];
  if (attempts.length === 0) {
    return NextResponse.json(null); // frontend handles this
  }

  const totalTests = attempts.length;
  const avgScore =
    attempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalTests;

  // Count incorrect answers per topic
  const topicStats = {};
  attempts.forEach(attempt => {
    attempt.records.forEach(record => {
      const topic = record.question.topic;
      if (!topicStats[topic]) {
        topicStats[topic] = { total: 0, incorrect: 0 };
      }
      topicStats[topic].total += 1;
      if (!record.correct) {
        topicStats[topic].incorrect += 1;
      }
    });
  });

  const topicAccuracy = Object.entries(topicStats).map(([topic, stat]) => ({
    topic,
    accuracy: ((stat.total - stat.incorrect) / stat.total) * 100,
  }));

  topicAccuracy.sort((a, b) => a.accuracy - b.accuracy);

  const weakTopics = topicAccuracy.slice(0, 3); // bottom 3 accuracy

  return NextResponse.json({
    totalTests,
    avgScore,
    weakTopics,
    lastAttempt: attempts[0].completed_at,
  });
}
