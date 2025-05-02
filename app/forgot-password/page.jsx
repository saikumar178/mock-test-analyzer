'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  // Handle sending the verification code
  const handleSendCode = async () => {
    const res = await fetch('/api/auth/forgot-password/send-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      setStep(2); // Move to step 2 (enter verification code and new password)
      setMessage('Verification code sent! Please check your email.');
    } else {
      setMessage('Failed to send code. Please try again.');
    }
  };

  // Handle verifying the code and resetting the password
  const handleVerifyAndReset = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    const res = await fetch('/api/auth/forgot-password/verify', {
      method: 'POST',
      body: JSON.stringify({ email, resetCode: code, newPassword }),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Password updated successfully! You can now log in.');
      setStep(3); // Move to step 3 (show success message)
    } else {
      setMessage(data.error || 'Failed to reset password');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>

      {message && <p className="text-center mb-4 text-blue-600">{message}</p>}

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button
            onClick={handleSendCode}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Send Verification Code
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter verification code"
            className="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:text-white"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:text-white"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <button
            onClick={handleVerifyAndReset}
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Reset Password
          </button>
        </>
      )}

      {step === 3 && (
        <p className="text-center text-green-600">Password successfully changed. You can now log in.</p>
      )}
    </div>
  );
}
