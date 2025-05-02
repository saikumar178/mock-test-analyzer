import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { id: 'asc' }, // or use random selection if needed
    });
    return NextResponse.json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err);
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 });
  }
}
