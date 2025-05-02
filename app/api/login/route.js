import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid'; // To generate a unique token for email verification
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Setup email transporter (you may use environment variables for security)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail email address
    pass: process.env.EMAIL_PASS, // Your Gmail password (use app password if 2FA is enabled)
  },
});

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await hash(password, 10);

    // Generate a unique token for email verification
    const emailToken = uuidv4();

    // Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: hashedPassword,
        emailToken,
        isVerified: false, // Default is not verified
      },
    });

    // Send verification email to the user
    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${emailToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking on the following link: ${verificationLink}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with a success message
    return NextResponse.json({
      message: 'Signup successful. Please check your email to verify your account.',
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
