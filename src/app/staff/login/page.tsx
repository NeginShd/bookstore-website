'use client';

import StaffLoginForm from '@/components/auth/StaffLoginForm';

export default function StaffLoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md">
        <StaffLoginForm />
      </div>
    </div>
  );
} 