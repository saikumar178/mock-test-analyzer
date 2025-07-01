import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET() {
  const questions = await prisma.question.findMany();
  return NextResponse.json({ questions }); // 👈 Wrap in an object with "questions" key
}

export const dynamic = 'force-dynamic';