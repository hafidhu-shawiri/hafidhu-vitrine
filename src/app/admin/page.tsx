import Link from 'next/link';
import { requireAdmin } from '@/lib/admin/auth';
import { formatDate, getStats, listContacts, listWaitlist } from '@/lib/admin/data';
import { AdminShell, EmptyState, StatCard, StatusPill } from '@/components/admin/AdminShell';
import { Icon } from '@/components/ui/Icon';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const admin = await requireAdmin();

  const [stats, contacts, waitlist] = await Promise.all([
    getStats(),
    listContacts({ limit: 8 }),
    listWaitlist({ limit: 6 }),
  ]);

  return (
    <AdminShell email={admin.email} active="dashboard">
      <h1 className="text-[1.375rem] font-bold text-navy">Vue d’ensemble</h1>
      <p className="mt-1.5 text-[0.875rem] text-muted">
        Suivi des messages reçus et des inscriptions à la liste d’attente.
      </p>

      <section aria-label="Chiffres clés" className="mt-6">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li>
            <StatCard label="Contacts reçus" value={stats.contactsTotal} hint="Depuis l’ouverture" />
          </li>
          <li>
            <StatCard
              label="Nouveaux contacts"
              value={stats.contactsNew}
              hint="Statut « Nouveau »"
              tone="attention"
            />
          </li>
          <li>
            <StatCard
              label="En traitement"
              value={stats.contactsPending}
              hint="« À traiter » ou « En cours »"
            />
          </li>
          <li>
            <StatCard
              label="Liste d’attente"
              value={stats.waitlistTotal}
              hint={`dont ${stats.waitlistLast30Days} sur 30 jours`}
            />
          </li>
        </ul>
      </section>

      {/* ── Derniers contacts ─────────────────────────────────── */}
      <section aria-labelledby="derniers-contacts" className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="derniers-contacts" className="text-[1.0625rem] font-semibold text-navy">
            Derniers contacts
          </h2>
          <Link
            href="/admin/contacts"
            className="inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-teal no-underline hover:underline"
          >
            Tout voir
            <Icon name="arrow-right" size={15} />
          </Link>
        </div>

        {contacts.error ? (
          <p role="alert" className="mt-4 rounded-[12px] border border-error/35 bg-error-bg px-4 py-3 text-[0.875rem] text-error">
            {contacts.error}
          </p>
        ) : contacts.rows.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="Aucun message pour le moment."
              body="Les messages envoyés depuis le formulaire de contact du site apparaîtront ici, du plus récent au plus ancien."
            />
          </div>
        ) : (
          <ul className="mt-4 overflow-hidden rounded-[16px] border border-border bg-surface">
            {contacts.rows.map((row, i) => (
              <li key={row.id} className={i > 0 ? 'border-t border-surface-subtle' : ''}>
                <Link
                  href={`/admin/contacts/${row.id}`}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 no-underline transition-colors hover:bg-ivory sm:px-5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.9375rem] font-semibold text-navy">
                      {row.first_name} {row.last_name}
                      <span className="ml-2 font-normal text-muted">{row.email}</span>
                    </p>
                    <p className="mt-0.5 truncate text-[0.8125rem] text-muted">
                      {row.subject} — {row.message}
                    </p>
                  </div>
                  <span className="text-[0.75rem] text-muted">{formatDate(row.created_at)}</span>
                  <StatusPill status={row.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Dernières inscriptions ────────────────────────────── */}
      <section aria-labelledby="dernieres-inscriptions" className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="dernieres-inscriptions" className="text-[1.0625rem] font-semibold text-navy">
            Dernières inscriptions
          </h2>
          <Link
            href="/admin/liste-attente"
            className="inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-teal no-underline hover:underline"
          >
            Tout voir
            <Icon name="arrow-right" size={15} />
          </Link>
        </div>

        {waitlist.error ? (
          <p role="alert" className="mt-4 rounded-[12px] border border-error/35 bg-error-bg px-4 py-3 text-[0.875rem] text-error">
            {waitlist.error}
          </p>
        ) : waitlist.rows.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="Aucune inscription pour le moment."
              body="Les inscriptions à la liste d’attente apparaîtront ici. Cette liste reste privée et n’est jamais publiée."
            />
          </div>
        ) : (
          <ul className="mt-4 overflow-hidden rounded-[16px] border border-border bg-surface">
            {waitlist.rows.map((row, i) => (
              <li
                key={row.id}
                className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-3.5 sm:px-5 ${i > 0 ? 'border-t border-surface-subtle' : ''}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.9375rem] font-semibold text-navy">
                    {row.first_name} {row.last_name}
                    <span className="ml-2 font-normal text-muted">{row.email}</span>
                  </p>
                  <p className="mt-0.5 text-[0.8125rem] text-muted">
                    {row.profile} — {row.country}
                  </p>
                </div>
                <span className="text-[0.75rem] text-muted">{formatDate(row.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminShell>
  );
}
