// app/api/auth/forgot-password/send-code/route.js

import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email } = await req.json();

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated reset code:', resetCode);

    // Update user with reset code and expiration time
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: resetCode,
        resetCodeExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiration
      },
    });

    // Configure the transporter for email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send the reset code to the user's email
    await transporter.sendMail({
      from: `"Mock Test Analyzer" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${resetCode}`,
    });

    return NextResponse.json({ message: 'Reset code sent successfully' });
  } catch (err) {
    console.error('Error in send-code route:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
