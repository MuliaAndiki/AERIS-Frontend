'use client';
import Link from 'next/link';
export default function ContainerHome() {
  return (
    <main className="w-full min-h-screen flex justify-center items-center">
      <Link className="text-2xl font-semibold" href={'/login'}>
        Login
      </Link>
    </main>
  );
}
