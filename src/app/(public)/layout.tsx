import NavLayout from '@/core/layouts/nav.layout';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <NavLayout>{children}</NavLayout>;
}
