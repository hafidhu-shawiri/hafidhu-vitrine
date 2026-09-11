'use client';

import { useRef, useState } from 'react';
import { fieldErrors, WAITLIST_PROFILES, waitlistSchema } from '@/lib/validation';
import { HoneypotField, SelectField, TextAreaField, TextField } from './Field';
import { FormShell, SubmitRow, SuccessPanel, type FormStatus } from './FormShell';

const EMPTY = {
  firstName: '',
  lastName: '',
  email: '',
  country: '',
  profile: WAITLIST_PROFILES[0] as string,
  featureInterest: '',
  website: '',
};

export function WaitlistForm() {
  const [values, setValues] = useState({ ...EMPTY });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [feedback, setFeedback] = useState('');
  const [duplicate, setDuplicate] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const set = (key: keyof typeof EMPTY) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: '' } : e));
  };

  function focusFirstError(found: Record<string, string>) {
    const first = Object.keys(found)[0];
    if (!first) return;
    formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === 'loading') return;

    const parsed = waitlistSchema.safeParse(values);
    if (!parsed.success) {
      const found = fieldErrors(parsed.error);
      setErrors(found);
      setStatus('idle');
      setFeedback('');
      focusFirstError(found);
      return;
    }

    setStatus('loading');
    setFeedback('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        if (data.errors) {
          setErrors(data.errors);
          focusFirstError(data.errors);
        }
        setStatus('error');
        setFeedback(
          data.message ?? 'Votre inscription n’a pas pu être enregistrée. Merci de réessayer.'
        );
        return;
      }

      setDuplicate(Boolean(data.duplicate));
      setStatus('success');
      setValues({ ...EMPTY });
      setErrors({});
    } catch {
      setStatus('error');
      setFeedback(
        'La connexion au serveur a échoué. Vérifiez votre connexion internet et réessayez, ' +
          'ou écrivez-nous directement à contact@morashawiri.com.'
      );
    }
  }

  if (status === 'success') {
    return (
      <SuccessPanel
        title={duplicate ? 'Vous êtes déjà inscrit.' : 'Votre inscription est enregistrée.'}
        body={
          duplicate
            ? 'Cette adresse figure déjà sur la liste d’attente. Vous serez informé de l’avancement de HAFIDHU — rien de plus à faire.'
            : 'Vous serez informé de l’avancement de HAFIDHU. Aucune offre commerciale ne vous sera adressée.'
        }
        actionLabel="Inscrire une autre personne"
        onReset={() => {
          setStatus('idle');
          setFeedback('');
          setDuplicate(false);
        }}
      />
    );
  }

  const busy = status === 'loading';

  return (
    <FormShell ref={formRef} onSubmit={onSubmit} status={status} feedback={feedback}>
      <TextField
        label="Prénom"
        name="firstName"
        value={values.firstName}
        onChange={set('firstName')}
        error={errors.firstName}
        autoComplete="given-name"
        required
        disabled={busy}
      />
      <TextField
        label="Nom"
        name="lastName"
        value={values.lastName}
        onChange={set('lastName')}
        error={errors.lastName}
        autoComplete="family-name"
        required
        disabled={busy}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={set('email')}
        error={errors.email}
        placeholder="vous@exemple.com"
        autoComplete="email"
        required
        disabled={busy}
        wide
      />
      <TextField
        label="Pays de résidence"
        name="country"
        value={values.country}
        onChange={set('country')}
        error={errors.country}
        autoComplete="country-name"
        required
        disabled={busy}
      />
      <SelectField
        label="Profil"
        name="profile"
        value={values.profile}
        onChange={set('profile')}
        error={errors.profile}
        options={WAITLIST_PROFILES}
        required
        disabled={busy}
      />
      <TextAreaField
        label="Quelle fonctionnalité vous serait la plus utile ?"
        name="featureInterest"
        value={values.featureInterest}
        onChange={set('featureInterest')}
        error={errors.featureInterest}
        hint="(optionnel)"
        placeholder="Décrivez une situation concrète que vous aimeriez simplifier."
        disabled={busy}
        wide
      />

      <HoneypotField value={values.website} onChange={set('website')} />

      <SubmitRow
        busy={busy}
        label="Rejoindre la liste d'attente"
        busyLabel="Enregistrement…"
        legal="Vos informations servent uniquement à vous tenir informé de l’avancement du produit."
      />
    </FormShell>
  );
}
