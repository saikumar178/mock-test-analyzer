'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

export default function LoginForm() {
  const [error, setError] = useState('');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">Login</h2>
      
      {error && (
        <p className="text-red-500 bg-red-100 border border-red-400 p-2 rounded text-sm text-center mb-2">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
        />

        {/* Password Field with Show/Hide Button */}
        <div className="relative">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            required
            className="p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white w-full pr-16"
          />
           <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 dark:text-gray-300 focus:outline-none"
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>

        <p className="text-sm mt-2 ml-3 text-blue-600 hover:underline">
          <a href="/forgot-password">Forgot password?</a>
        </p>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          Login
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-gray-500 dark:text-gray-300 mb-2">Or</p>
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}
