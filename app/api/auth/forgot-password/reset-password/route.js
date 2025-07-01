// app/api/auth/forgot-password/reset-password/route.js
export const dynamic = 'force-dynamic';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, resetCode, newPassword } = await req.json();

    // Validate if the user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the reset code is valid and hasn't expired
    if (user.resetToken !== resetCode) {
      return NextResponse.json({ error: 'Invalid reset code' }, { status: 400 });
    }

    if (new Date() > new Date(user.resetCodeExpires)) {
      return NextResponse.json({ error: 'Reset code expired' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);

    // Update the password and reset the reset token fields
    await prisma.user.update({
      where: { email },
      data: {
        password_hash: hashedPassword,
        resetToken: null, // Clear the reset token after successful password reset
        resetCodeExpires: null, // Clear the expiration
      },
    });

    return NextResponse.json({ message: 'Password reset successful. You can now log in.' });
  } catch (err) {
    console.error('Error in reset-password route:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
