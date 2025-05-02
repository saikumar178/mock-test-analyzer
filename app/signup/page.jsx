'use client';
import AuthWrapper from '../../components/Auth/AuthWrapper';
import SignupForm from '../../components/Auth/SignupForm';



export default function SignupPage() {
  return (
    <AuthWrapper>
        <SignupForm/>
    </AuthWrapper>
  );
}
