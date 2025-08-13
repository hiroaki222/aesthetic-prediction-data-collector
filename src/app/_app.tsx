import { createClient } from '@/utils/supabase/client';
import type { AppProps } from 'next/app'
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }: AppProps) {
  const supabase = createClient();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.info('Auth state changed:', event, session);
      if (event === 'INITIAL_SESSION') {
        // handle initial session
      } else if (event === 'SIGNED_IN') {
        // handle sign in event
      } else if (event === 'SIGNED_OUT') {
        redirect('/signin');
      } else if (event === 'PASSWORD_RECOVERY') {
        redirect('/reset-password');
      } else if (event === 'TOKEN_REFRESHED') {
        // handle token refreshed event
      } else if (event === 'USER_UPDATED') {
        // handle user updated event
      }
    })

    data.subscription.unsubscribe()
  }, [supabase.auth]);
  return <Component {...pageProps} />
}