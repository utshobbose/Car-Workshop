'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthRoute({ children, adminOnly = false }) {
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    if (!userId) {
      router.push('/login');
      return;
    }

    if (adminOnly && role !== 'admin') {
      router.push('/');
      return;
    }

    setVerified(true);
  }, [router]);

  if (!verified) return <div>Loading...</div>;
  return children;
}
