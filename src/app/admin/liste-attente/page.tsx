import Link from 'next/link';
import { requireAdmin } from '@/lib/admin/auth';
import { formatDate, listWaitlist } from '@/lib/admin/data';
import { AdminShell, EmptyState } from '@/components/admin/AdminShell';
import { WAITLIST_PROFILES } from '@/lib/validation';
import { Icon } from '@/components/ui/Icon';

export const dynamic = 'force-dynamic';

export default async function AdminWaitlist({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; profil?: string }>;
}) {
  const admin = await requireAdmin();
  const params = await searchParams;

  const search = params.q?.trim() ?? '';
  const profile = params.profil ?? 'Tous';

  const { rows, error } = await listWaitlist({ search, profile, limit: 500 });

  return (
    <AdminShell email={admin.email} active="waitlist">
      <h1 className="text-[1.375rem] font-bold text-navy">Liste d’attente</h1>
      <p className="mt-1.5 text-[0.875rem] text-muted">
        Inscriptions enregistrées depuis le site. Cette liste est privée et n’est jamais publiée.
      </p>

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
              placeholder="Nom, e-mail ou pays"
              className="w-full rounded-[12px] border border-border-strong bg-surface py-2.5 pl-10 pr-3.5 text-[0.875rem] text-ink focus:border-teal focus:outline-none focus:ring-3 focus:ring-teal/12"
            />
          </div>
        </div>

        <div>
          <label htmlFor="profil" className="mb-2 block text-[0.8125rem] font-semibold text-ink">
            Profil
          </label>
          <select
            id="profil"
            name="profil"
            defaultValue={profile}
            className="min-h-[42px] rounded-[12px] border border-border-strong bg-surface px-3 text-[0.875rem] text-ink focus:border-teal focus:outline-none focus:ring-3 focus:ring-teal/12"
          >
            <option value="Tous">Tous</option>
            {WAITLIST_PROFILES.map((p) => (
              <option key={p} value={p}>
                {p}
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

        {(search || profile !== 'Tous') && (
          <Link
            href="/admin/liste-attente"
            className="min-h-[42px] content-center text-[0.875rem] font-medium text-muted no-underline hover:text-ink"
          >
            Réinitialiser
          </Link>
        )}
      </form>

      <p aria-live="polite" className="mt-5 text-[0.8125rem] text-muted">
        {rows.length} inscription{rows.length > 1 ? 's' : ''}.
      </p>

      {error ? (
        <p role="alert" className="mt-4 rounded-[12px] border border-error/35 bg-error-bg px-4 py-3 text-[0.875rem] text-error">
          {error}
        </p>
      ) : rows.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="Aucune inscription ne correspond."
            body={
              search || profile !== 'Tous'
                ? 'Essayez d’élargir la recherche ou de réinitialiser les filtres.'
                : 'Les inscriptions enregistrées depuis la page « Rejoindre la liste d’attente » apparaîtront ici.'
            }
          />
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-[16px] border border-border bg-surface">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">
              Inscriptions à la liste d’attente, de la plus récente à la plus ancienne
            </caption>
            <thead>
              <tr className="border-b border-border">
                {['Nom', 'Email', 'Pays', 'Profil', 'Inscrit le'].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-4 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-surface-subtle last:border-0">
                  <td className="px-4 py-3 text-[0.875rem] font-medium text-navy">
                    {row.first_name} {row.last_name}
                  </td>
                  <td className="px-4 py-3 text-[0.875rem] text-ink">
                    <a href={`mailto:${row.email}`} className="no-underline hover:underline">
                      {row.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-[0.875rem] text-muted">{row.country}</td>
                  <td className="px-4 py-3 text-[0.875rem] text-muted">{row.profile}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[0.8125rem] text-muted">
                    {formatDate(row.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Les réponses libres sont affichées à part : elles orientent le produit. */}
      {rows.some((r) => r.feature_interest) ? (
        <section aria-labelledby="besoins" className="mt-10">
          <h2 id="besoins" className="text-[1.0625rem] font-semibold text-navy">
            Fonctionnalités demandées
          </h2>
          <p className="mt-1.5 text-[0.8125rem] text-muted">
            Réponses libres à « Quelle fonctionnalité vous serait la plus utile ? ».
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {rows
              .filter((r) => r.feature_interest)
              .map((r) => (
                <li key={r.id} className="rounded-[12px] border border-border bg-surface p-4">
                  <p className="text-[0.8125rem] text-muted">
                    {r.first_name} {r.last_name} — {r.profile}, {r.country}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-[0.9375rem] leading-[1.65] text-ink">
                    {r.feature_interest}
                  </p>
                </li>
              ))}
          </ul>
        </section>
      ) : null}
    </AdminShell>
  );
}
