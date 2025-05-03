import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login?callbackUrl=/profile');
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {children}
    </main>
  );
}
