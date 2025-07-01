// /app/api/total-users/route.ts
import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma'; 

export async function GET() {
  try {
    const count = await prisma.user.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Failed to fetch user count:', error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';