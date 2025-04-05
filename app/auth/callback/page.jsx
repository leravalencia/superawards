'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Handle session automatically
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.push('/dashboard'); // or wherever you want to go
      } else {
        router.push('/login');
      }
    });
  }, []);

  return <p>Logging you in...</p>;
}
