'use client';

import { useState } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import LoginForm from '@/components/auth/LoginForm';

export default function AccountPage() {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 text-lg font-semibold ${!isRegistering ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-500'}`}
            onClick={() => setIsRegistering(false)}
          >
            ورود
          </button>
          <button
            className={`px-4 py-2 text-lg font-semibold ${isRegistering ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-500'}`}
            onClick={() => setIsRegistering(true)}
          >
            ثبت نام
          </button>
        </div>
        {isRegistering ? <RegisterForm /> : <LoginForm />}
      </div>
    </div>
  );
} 