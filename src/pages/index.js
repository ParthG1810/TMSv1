import { useEffect } from 'react';
import { useRouter } from 'next/router';
// next
import Head from 'next/head';
// routes
import { PATH_DASHBOARD } from '../routes/paths';

// ----------------------------------------------------------------------

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard immediately
    router.replace(PATH_DASHBOARD.root);
  }, [router]);

  return (
    <>
      <Head>
        <title>Tiffin Management System</title>
      </Head>
      {/* Redirecting to dashboard... */}
    </>
  );
}
