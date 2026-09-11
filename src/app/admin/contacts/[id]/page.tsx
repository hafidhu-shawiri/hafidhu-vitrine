import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin/auth';
import { formatDate, getContact } from '@/lib/admin/data';
import { AdminShell, StatusPill } from '@/components/admin/AdminShell';
import { NotesForm, StatusForm } from '@/components/admin/ContactDetailForms';
import { Icon } from '@/components/ui/Icon';

export const dynamic = 'force-dynamic';

export default async function ContactDetail({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;

  const contact = await getContact(id);
  if (!contact) notFound();

  const rows: [string, React.ReactNode][] = [
    ['Reçu le', formatDate(contact.created_at)],
    [
      'Email',
      <a key="email" href={`mailto:${contact.email}`} className="no-underline hover:underline">
        {contact.email}
      </a>,
    ],
    [
      'Téléphone',
      contact.phone ? (
        <a key="tel" href={`tel:${contact.phone}`} className="no-underline hover:underline">
          {contact.phone}
        </a>
      ) : (
        <span key="tel" className="text-muted">
          Non renseigné
        </span>
      ),
    ],
    ['Sujet', contact.subject],
    ['Source', contact.source],
  ];

  return (
    <AdminShell email={admin.email} active="contacts">
      <Link
        href="/admin/contacts"
        className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-teal no-underline hover:underline"
      >
        <Icon name="chevron-left" size={15} />
        Retour aux contacts
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold text-navy">
            {contact.first_name} {contact.last_name}
          </h1>
          <p className="mt-1 text-[0.875rem] text-muted">{contact.email}</p>
        </div>
        <StatusPill status={contact.status} />
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* ── Message ─────────────────────────────────────────── */}
        <div className="rounded-[16px] border border-border bg-surface p-5 sm:p-6">
          <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted">
            Informations
          </h2>

          <dl className="mt-4">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="flex flex-wrap gap-x-4 gap-y-1 border-b border-surface-subtle py-2.5 last:border-0"
              >
                <dt className="w-[120px] shrink-0 text-[0.8125rem] text-muted">{label}</dt>
                <dd className="min-w-0 flex-1 text-[0.875rem] text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-7 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted">
            Message
          </h2>
          <p className="mt-3 whitespace-pre-wrap rounded-[12px] bg-ivory p-4 text-[0.9375rem] leading-[1.7] text-ink">
            {contact.message}
          </p>

          <a
            href={`mailto:${contact.email}?subject=${encodeURIComponent(`Re : ${contact.subject}`)}`}
            className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-[12px] border border-teal bg-teal px-4 text-[0.875rem] font-semibold text-white no-underline transition-colors hover:bg-teal-hover hover:text-white"
          >
            <Icon name="mail" size={16} />
            Répondre par e-mail
          </a>
        </div>

        {/* ── Traitement ──────────────────────────────────────── */}
        <div className="rounded-[16px] border border-border bg-surface p-5 sm:p-6">
          <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted">
            Traitement
          </h2>

          <div className="mt-4">
            <StatusForm id={contact.id} current={contact.status} />
            <NotesForm id={contact.id} current={contact.notes} />
          </div>

          <p className="mt-6 border-t border-surface-subtle pt-4 text-[0.75rem] text-muted">
            Dernière modification : {formatDate(contact.updated_at)}
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
