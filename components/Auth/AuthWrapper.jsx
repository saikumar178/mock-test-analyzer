'use client';
export default function AuthWrapper({ children }) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-[var(--background)] text-[var(--foreground)]">
        <div className="w-full max-w-md p-6 rounded-2xl shadow-xl bg-white dark:bg-[#111111]">
          {children}
        </div>
      </div>
    );
  }
  