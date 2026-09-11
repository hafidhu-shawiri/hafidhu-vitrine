import Image from 'next/image';
import Link from 'next/link';
import { signOut } from '@/lib/admin/actions';
import { Icon } from '@/components/ui/Icon';
import { cx } from '@/components/ui/primitives';

/**
 * Ossature commune aux écrans d'administration :
 * en-tête, navigation, identité de la session.
 */
export function AdminShell({
  email,
  active,
  children,
}: {
  email: string;
  active: 'dashboard' | 'contacts' | 'waitlist';
  children: React.ReactNode;
}) {
  const tabs = [
    { key: 'dashboard', label: "Vue d'ensemble", href: '/admin' },
    { key: 'contacts', label: 'Contacts', href: '/admin/contacts' },
    { key: 'waitlist', label: "Liste d'attente", href: '/admin/liste-attente' },
  ] as const;

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center gap-4 px-5 py-4 sm:px-6">
          <Link href="/admin" className="flex shrink-0 items-center">
            <Image
              src="/brand/logo-horizontal.png"
              alt="HAFIDHU"
              width={1981}
              height={577}
              sizes="130px"
              className="h-[30px] w-auto"
            />
          </Link>

          <div className="min-w-0">
            <p className="truncate text-[0.9375rem] font-semibold text-navy">
              Dashboard MORA Shawiri
            </p>
            <p className="truncate text-[0.75rem] text-muted">Site HAFIDHU — administration</p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-[0.8125rem] text-muted sm:inline">{email}</span>
            <Link
              href="/"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-[10px] border border-border px-3 text-[0.8125rem] font-medium text-ink no-underline transition-colors hover:border-teal hover:text-teal"
            >
              <Icon name="external" size={15} />
              Voir le site
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex min-h-[40px] cursor-pointer items-center rounded-[10px] border border-border px-3 text-[0.8125rem] font-medium text-ink transition-colors hover:border-error hover:text-error"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>

        <nav aria-label="Navigation de l'administration" className="border-t border-border">
          <ul className="mx-auto flex w-full max-w-[1240px] gap-1 overflow-x-auto px-5 sm:px-6">
            {tabs.map((tab) => (
              <li key={tab.key}>
                <Link
                  href={tab.href}
                  aria-current={active === tab.key ? 'page' : undefined}
                  className={cx(
                    'inline-flex min-h-[44px] items-center whitespace-nowrap border-b-2 px-3 text-[0.875rem] font-medium no-underline transition-colors',
                    active === tab.key
                      ? 'border-teal text-teal'
                      : 'border-transparent text-muted hover:text-ink'
                  )}
                >
                  {tab.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1240px] px-5 py-8 sm:px-6">{children}</main>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = 'neutral',
}: {
  label: string;
  value: number | string;
  hint?: string;
  tone?: 'neutral' | 'attention';
}) {
  return (
    <div
      className={cx(
        'rounded-[16px] border bg-surface p-5',
        tone === 'attention' && Number(value) > 0 ? 'border-gold' : 'border-border'
      )}
    >
      <p className="text-[0.8125rem] text-muted">{label}</p>
      <p className="mt-2 text-[1.75rem] font-bold leading-none text-navy">{value}</p>
      {hint ? <p className="mt-2 text-[0.75rem] text-muted">{hint}</p> : null}
    </div>
  );
}

const statusTone: Record<string, string> = {
  Nouveau: 'bg-teal-soft text-teal',
  'À traiter': 'bg-warning-bg text-warning-text',
  'En cours': 'bg-warning-bg text-warning-text',
  Répondu: 'bg-success-bg text-success',
  Archivé: 'bg-surface-subtle text-muted-strong',
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center rounded-[8px] px-2 py-1 text-[0.75rem] font-semibold',
        statusTone[status] ?? 'bg-surface-subtle text-muted-strong'
      )}
    >
      {status}
    </span>
  );
}

/** État vide : dire ce qui manque, pourquoi, et quoi faire. */
export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[16px] border border-dashed border-border-strong bg-surface p-10 text-center">
      <p className="text-[1rem] font-semibold text-navy">{title}</p>
      <p className="mx-auto mt-2 max-w-[46ch] text-[0.875rem] leading-[1.65] text-muted">{body}</p>
    </div>
  );
}
