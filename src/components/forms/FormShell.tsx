'use client';

/**
 * Enveloppe commune aux formulaires : mise en page, état d'envoi,
 * message de retour global et panneau de confirmation.
 */

import Link from 'next/link';
import { forwardRef } from 'react';
import { routes } from '@/content/navigation';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/primitives';

export type FormStatus = 'idle' | 'loading' | 'error' | 'success';

type ShellProps = {
  onSubmit: (e: React.FormEvent) => void;
  status: FormStatus;
  feedback: string;
  children: React.ReactNode;
};

export const FormShell = forwardRef<HTMLFormElement, ShellProps>(function FormShell(
  { onSubmit, status, feedback, children },
  ref
) {
  return (
    <form
      ref={ref}
      onSubmit={onSubmit}
      noValidate
      className="relative grid gap-5 rounded-[16px] border border-border bg-surface p-5 sm:grid-cols-2 sm:p-7"
    >
      {/* Retour global annoncé aux technologies d'assistance. */}
      {status === 'error' && feedback ? (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-[12px] border border-error/35 bg-error-bg px-4 py-3 text-[0.875rem] leading-[1.55] text-error sm:col-span-2"
        >
          <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
          {feedback}
        </p>
      ) : null}

      {children}
    </form>
  );
});

export function SubmitRow({
  busy,
  label,
  busyLabel,
  legal,
}: {
  busy: boolean;
  label: string;
  busyLabel: string;
  legal: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 pt-1 sm:col-span-2">
      <Button type="submit" disabled={busy} aria-busy={busy}>
        {busy ? (
          <>
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
            {busyLabel}
          </>
        ) : (
          label
        )}
      </Button>

      <p className="max-w-[42ch] text-[0.8125rem] leading-[1.55] text-muted">
        {legal}{' '}
        <Link href={routes.privacy} className="no-underline hover:underline">
          Voir la politique de confidentialité
        </Link>
        .
      </p>
    </div>
  );
}

export function SuccessPanel({
  title,
  body,
  actionLabel,
  onReset,
}: {
  title: string;
  body: string;
  actionLabel: string;
  onReset: () => void;
}) {
  return (
    <div
      role="status"
      className="animate-rise rounded-[16px] border border-success/40 bg-surface p-6 sm:p-8"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-success-bg text-success">
        <Icon name="check" size={22} strokeWidth={2.25} />
      </span>
      <h2 className="mt-4 text-[1.1875rem] font-semibold text-navy">{title}</h2>
      <p className="mt-2.5 text-[0.9375rem] leading-[1.7] text-muted">{body}</p>
      <Button variant="secondary" onClick={onReset} className="mt-6">
        {actionLabel}
      </Button>
    </div>
  );
}
