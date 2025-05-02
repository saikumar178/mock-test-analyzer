'use client';
import LoginForm from '@/components/Auth/LoginForm';
import AuthWrapper from '@/components/Auth/AuthWrapper';

export default function LoginPage() {
  return (
     <AuthWrapper>
      <LoginForm/>
     </AuthWrapper>
  );
}
