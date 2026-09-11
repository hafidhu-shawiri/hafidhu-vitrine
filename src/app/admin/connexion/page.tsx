import Image from 'next/image';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: 'Connexion — Dashboard MORA Shawiri',
  robots: { index: false, follow: false, nocache: true },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-12">
      <div className="w-full max-w-[420px]">
        <div className="flex justify-center">
          <Image
            src="/brand/logo-horizontal.png"
            alt="HAFIDHU"
            width={1981}
            height={577}
            priority
            sizes="180px"
            className="h-[40px] w-auto"
          />
        </div>

        <div className="mt-8 rounded-[16px] border border-border bg-surface p-6 sm:p-8">
          <h1 className="text-[1.25rem] font-bold text-navy">Dashboard MORA Shawiri</h1>
          <p className="mt-1.5 text-[0.875rem] text-muted">
            Administration du site HAFIDHU — accès réservé.
          </p>

          <LoginForm configError={erreur === 'configuration'} />
        </div>

        <p className="mt-6 text-center text-[0.75rem] text-muted">
          Cet espace est privé. Les données des visiteurs ne sont accessibles qu’après connexion.
        </p>
      </div>
    </div>
  );
}
