import { AuthProvider } from 'src/components/AuthProvider';
import { SupabaseProvider } from '@supabase/supabase-js';
import createClient from 'src/lib/supabase-server';

import 'src/styles/globals.css';

// do not cache this layout
export const revalidate = 0;

export default async function RootLayout({ children }) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token || null;

  return (
    <html lang="en">
      <head>
        <title>PokeBox</title>
      </head>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
          <main className="flex w-full flex-1 shrink-0 flex-col items-center justify-center px-8 text-center sm:px-20">
            <h1 className="mb-12 text-5xl font-bold sm:text-6xl">
              <span className="font-black text-green-400">Pokebox</span>
            </h1>
            <AuthProvider accessToken={accessToken}>{children}</AuthProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
