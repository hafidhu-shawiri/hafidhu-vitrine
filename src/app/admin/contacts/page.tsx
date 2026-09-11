import Link from 'next/link';
import { requireAdmin } from '@/lib/admin/auth';
import { formatDate, listContacts } from '@/lib/admin/data';
import { AdminShell, EmptyState, StatusPill } from '@/components/admin/AdminShell';
import { CONTACT_SOURCES, CONTACT_STATUSES } from '@/lib/validation';
import { Icon } from '@/components/ui/Icon';

export const dynamic = 'force-dynamic';

export default async function AdminContacts({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; statut?: string; source?: string }>;
}) {
  const admin = await requireAdmin();
  const params = await searchParams;

  const search = params.q?.trim() ?? '';
  const status = params.statut ?? 'Tous';
  const source = params.source ?? 'Toutes';

  const { rows, error } = await listContacts({ search, status, source, limit: 200 });

  return (
    <AdminShell email={admin.email} active="contacts">
      <h1 className="text-[1.375rem] font-bold text-navy">Contacts</h1>
      <p className="mt-1.5 text-[0.875rem] text-muted">
        Messages reçus via le formulaire de contact du site.
      </p>

      {/* ── Recherche et filtres ──────────────────────────────── */}
      <form method="get" className="mt-6 flex flex-wrap items-end gap-3">
        <div className="min-w-[220px] flex-1">
          <label htmlFor="q" className="mb-2 block text-[0.8125rem] font-semibold text-ink">
            Rechercher
          </label>
          <div className="relative">
            <Icon
              name="search"
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={search}
              placeholder="Nom, e-mail, sujet ou message"
              className="w-full rounded-[12px] border border-border-strong bg-surface py-2.5 pl-10 pr-3.5 text-[0.875rem] text-ink focus:border-teal focus:outline-none focus:ring-3 focus:ring-teal/12"
            />
          </div>
        </div>

        <div>
          <label htmlFor="statut" className="mb-2 block text-[0.8125rem] font-semibold text-ink">
            Statut
          </label>
          <select
            id="statut"
            name="statut"
            defaultValue={status}
            className="min-h-[42px] rounded-[12px] border border-border-strong bg-surface px-3 text-[0.875rem] text-ink focus:border-teal focus:outline-none focus:ring-3 focus:ring-teal/12"
          >
            <option value="Tous">Tous</option>
            {CONTACT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="source" className="mb-2 block text-[0.8125rem] font-semibold text-ink">
            Source
          </label>
          <select
            id="source"
            name="source"
            defaultValue={source}
            className="min-h-[42px] rounded-[12px] border border-border-strong bg-surface px-3 text-[0.875rem] text-ink focus:border-teal focus:outline-none focus:ring-3 focus:ring-teal/12"
          >
            <option value="Toutes">Toutes</option>
            {CONTACT_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="min-h-[42px] cursor-pointer rounded-[12px] border border-teal bg-teal px-4 text-[0.875rem] font-semibold text-white transition-colors hover:bg-teal-hover"
        >
          Filtrer
        </button>

        {(search || status !== 'Tous' || source !== 'Toutes') && (
          <Link
            href="/admin/contacts"
            className="min-h-[42px] content-center text-[0.875rem] font-medium text-muted no-underline hover:text-ink"
          >
            Réinitialiser
          </Link>
        )}
      </form>

      <p aria-live="polite" className="mt-5 text-[0.8125rem] text-muted">
        {rows.length} résultat{rows.length > 1 ? 's' : ''}
        {rows.length === 200 ? ' (affichage limité aux 200 plus récents)' : ''}.
      </p>

      {/* ── Résultats ─────────────────────────────────────────── */}
      {error ? (
        <p role="alert" className="mt-4 rounded-[12px] border border-error/35 bg-error-bg px-4 py-3 text-[0.875rem] text-error">
          {error}
        </p>
      ) : rows.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="Aucun contact ne correspond."
            body={
              search || status !== 'Tous' || source !== 'Toutes'
                ? 'Essayez d’élargir la recherche ou de réinitialiser les filtres.'
                : 'Les messages envoyés depuis le formulaire de contact apparaîtront ici.'
            }
          />
        </div>
      ) : (
        <ul className="mt-4 overflow-hidden rounded-[16px] border border-border bg-surface">
          {rows.map((row, i) => (
            <li key={row.id} className={i > 0 ? 'border-t border-surface-subtle' : ''}>
              <Link
                href={`/admin/contacts/${row.id}`}
                className="flex flex-wrap items-start gap-x-4 gap-y-2 px-4 py-4 no-underline transition-colors hover:bg-ivory sm:px-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-x-2 text-[0.9375rem] font-semibold text-navy">
                    {row.first_name} {row.last_name}
                    <span className="font-normal text-muted">{row.email}</span>
                  </p>
                  <p className="mt-1 text-[0.8125rem] font-medium text-teal">{row.subject}</p>
                  <p className="mt-1 line-clamp-2 text-[0.8125rem] leading-[1.55] text-muted">
                    {row.message}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <StatusPill status={row.status} />
                  <span className="text-[0.75rem] text-muted">{formatDate(row.created_at)}</span>
                  {row.notes ? (
                    <span className="text-[0.6875rem] text-muted">Note interne</span>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
