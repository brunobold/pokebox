import Link from 'next/link';

import createClient from 'src/lib/supabase-server';

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

     return (
      <div>
        {!user ? (
          <Link href="/login">
            <button className="button-inverse w-full" type="submit">
              Login
            </button>
        </Link>
        ) : (
          <Link href="/profile">
            <button className="button-inverse w-full" type="submit">
              Dashboard
            </button>
          </Link>
        )}
      </div>
     )
}
