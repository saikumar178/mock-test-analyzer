// app/api/leaderboard/route.js
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        testAttempts: true,
      },
    });

    const rankedUsers = users
      .map((user) => {
        const testCount = user.testAttempts.length;
        const avgScore =
          testCount === 0
            ? 0
            : user.testAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) /
              testCount;

        return {
          id: user.id,
          name: user.name,
          image: user.image,
          testCount,
          avgScore,
        };
      })
      .sort((a, b) => {
        // Primary sort: avgScore, Secondary: testCount
        if (b.avgScore !== a.avgScore) return b.avgScore - a.avgScore;
        return b.testCount - a.testCount;
      });

    return NextResponse.json({ users: rankedUsers });
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    return NextResponse.json({ error: 'Failed to load leaderboard' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';