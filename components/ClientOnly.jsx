'use client'
export default function ClientOnly({ children }) {
  if (typeof window === 'undefined') return null;
  return <>{children}</>;
}
