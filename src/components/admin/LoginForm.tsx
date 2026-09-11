'use client';

/**
 * Formulaire de connexion à l'administration.
 *
 * Le mot de passe part directement vers Supabase Auth via une action
 * serveur. Il n'est ni stocké dans l'état React, ni journalisé, ni
 * comparé à une valeur codée en dur.
 */

import { useActionState } from 'react';
import { signIn, type ActionResult } from '@/lib/admin/actions';
import { Icon } from '@/components/ui/Icon';

export function LoginForm({ configError }: { configError?: boolean }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    signIn,
    null
  );

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      {configError ? (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-[12px] border border-warning-border bg-warning-bg px-3.5 py-3 text-[0.8125rem] leading-[1.55] text-warning-text"
        >
          <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
          La connexion à la base de données n’est pas configurée sur cet environnement. Renseignez
          les variables Supabase avant de vous connecter.
        </p>
      ) : null}

      {state && !state.ok ? (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-[12px] border border-error/35 bg-error-bg px-3.5 py-3 text-[0.8125rem] leading-[1.55] text-error"
        >
          <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
          {state.message}
        </p>
      ) : null}

      <div>
        <label htmlFor="admin-email" className="mb-2 block text-[0.875rem] font-semibold text-ink">
          Identifiant
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="username"
          disabled={pending}
          className="w-full rounded-[12px] border border-border-strong bg-surface px-3.5 py-3 text-[0.9375rem] text-ink transition-colors focus:border-teal focus:outline-none focus:ring-3 focus:ring-teal/12 disabled:bg-surface-subtle"
        />
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="mb-2 block text-[0.875rem] font-semibold text-ink"
        >
          Mot de passe
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          disabled={pending}
          className="w-full rounded-[12px] border border-border-strong bg-surface px-3.5 py-3 text-[0.9375rem] text-ink transition-colors focus:border-teal focus:outline-none focus:ring-3 focus:ring-teal/12 disabled:bg-surface-subtle"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="mt-1 inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-[12px] border border-teal bg-teal px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-teal-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
            Connexion…
          </>
        ) : (
          'Se connecter'
        )}
      </button>
    </form>
  );
}
