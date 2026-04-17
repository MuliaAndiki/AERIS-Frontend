export default async function PrivateProviders({ children }: { children: React.ReactNode }) {
  // if (!isAuth) {
  //   redirect('/login');
  // }

  return <>{children}</>;
}
