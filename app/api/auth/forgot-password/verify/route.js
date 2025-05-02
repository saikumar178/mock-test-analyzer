import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { email, resetCode, newPassword } = await req.json();

    if (!email || !resetCode || !newPassword) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.resetToken) {
      return NextResponse.json({ error: 'User not found or no reset code' }, { status: 404 });
    }

    console.log('Stored reset token:', user.resetToken);
    console.log('User entered reset code:', resetCode);

    if (user.resetToken !== resetCode) {
      return NextResponse.json({ error: 'Invalid reset code' }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear the reset token
    await prisma.user.update({
      where: { email },
      data: {
        password_hash: hashedPassword,
        resetToken: null,
      },
    });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
