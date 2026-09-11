'use client';

/**
 * Formulaires de traitement d'un contact : statut et note interne.
 * Chaque action est revérifiée côté serveur avant d'agir.
 */

import { useActionState } from 'react';
import {
  updateContactNotes,
  updateContactStatus,
  type ActionResult,
} from '@/lib/admin/actions';
import { CONTACT_STATUSES } from '@/lib/validation';
import { Icon } from '@/components/ui/Icon';
import { cx } from '@/components/ui/primitives';

function Feedback({ state }: { state: ActionResult | null }) {
  if (!state) return null;

  return (
    <p
      role="status"
      className={cx(
        'mt-3 flex items-start gap-2 rounded-[10px] px-3 py-2 text-[0.8125rem]',
        state.ok ? 'bg-success-bg text-success' : 'bg-error-bg text-error'
      )}
    >
      <Icon name={state.ok ? 'check' : 'alert'} size={15} className="mt-0.5 shrink-0" />
      {state.message}
    </p>
  );
}

export function StatusForm({ id, current }: { id: string; current: string }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    updateContactStatus,
    null
  );

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />

      <label
        htmlFor="contact-status"
        className="mb-2 block text-[0.8125rem] font-semibold text-ink"
      >
        Statut
      </label>

      <div className="flex flex-wrap gap-2">
        <select
          id="contact-status"
          name="status"
          defaultValue={current}
          disabled={pending}
          className="min-h-[42px] flex-1 rounded-[12px] border border-border-strong bg-surface px-3 text-[0.875rem] text-ink focus:border-teal focus:outline-none focus:ring-3 focus:ring-teal/12"
        >
          {CONTACT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="min-h-[42px] cursor-pointer rounded-[12px] border border-teal bg-teal px-4 text-[0.875rem] font-semibold text-white transition-colors hover:bg-teal-hover disabled:opacity-60"
        >
          {pending ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>

      <Feedback state={state} />
    </form>
  );
}

export function NotesForm({ id, current }: { id: string; current: string | null }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    updateContactNotes,
    null
  );

  return (
    <form action={action} className="mt-6">
      <input type="hidden" name="id" value={id} />

      <label htmlFor="contact-notes" className="mb-2 block text-[0.8125rem] font-semibold text-ink">
        Note interne
        <span className="ml-1 font-normal text-muted">
          (visible uniquement dans l’administration)
        </span>
      </label>

      <textarea
        id="contact-notes"
        name="notes"
        rows={5}
        defaultValue={current ?? ''}
        disabled={pending}
        placeholder="Suivi, réponse apportée, éléments à retenir…"
        className="w-full resize-y rounded-[12px] border border-border-strong bg-surface px-3.5 py-3 text-[0.875rem] text-ink focus:border-teal focus:outline-none focus:ring-3 focus:ring-teal/12"
      />

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="mt-3 min-h-[42px] cursor-pointer rounded-[12px] border border-teal bg-surface px-4 text-[0.875rem] font-semibold text-teal transition-colors hover:bg-surface-subtle disabled:opacity-60"
      >
        {pending ? 'Enregistrement…' : 'Enregistrer la note'}
      </button>

      <Feedback state={state} />
    </form>
  );
}
