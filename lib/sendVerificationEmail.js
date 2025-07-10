import nodemailer from 'nodemailer';

export function generateEmailToken(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
}

export async function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Your Mock Analyzer Verification Code",
    html: `<p>Your verification code is: <b>${token}</b></p>`,
  });
}
