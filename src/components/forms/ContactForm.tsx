'use client';

import { useRef, useState } from 'react';
import { CONTACT_SUBJECTS, contactSchema, fieldErrors } from '@/lib/validation';
import { HoneypotField, SelectField, TextAreaField, TextField } from './Field';
import { FormShell, SubmitRow, SuccessPanel, type FormStatus } from './FormShell';

const EMPTY = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: CONTACT_SUBJECTS[0] as string,
  message: '',
  website: '',
};

export function ContactForm() {
  const [values, setValues] = useState({ ...EMPTY });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [feedback, setFeedback] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const set = (key: keyof typeof EMPTY) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: '' } : e));
  };

  /** Place le focus sur le premier champ en erreur : sans cela, l'erreur
   *  peut rester invisible sur un long formulaire mobile. */
  function focusFirstError(found: Record<string, string>) {
    const first = Object.keys(found)[0];
    if (!first) return;
    formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === 'loading') return;

    const parsed = contactSchema.safeParse(values);
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
      const res = await fetch('/api/contact', {
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
        setFeedback(data.message ?? 'Votre message n’a pas pu être envoyé. Merci de réessayer.');
        return;
      }

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
        title="Votre message est enregistré."
        body="Nous revenons vers vous dès que possible. Une copie a été transmise à l’équipe du projet."
        actionLabel="Envoyer un autre message"
        onReset={() => {
          setStatus('idle');
          setFeedback('');
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
      />
      <TextField
        label="Téléphone"
        name="phone"
        type="tel"
        value={values.phone}
        onChange={set('phone')}
        error={errors.phone}
        hint="(optionnel)"
        autoComplete="tel"
        disabled={busy}
      />
      <SelectField
        label="Sujet"
        name="subject"
        value={values.subject}
        onChange={set('subject')}
        error={errors.subject}
        options={CONTACT_SUBJECTS}
        required
        disabled={busy}
        wide
      />
      <TextAreaField
        label="Message"
        name="message"
        value={values.message}
        onChange={set('message')}
        error={errors.message}
        placeholder="Décrivez votre question ou la situation que vous souhaitez nous soumettre."
        required
        disabled={busy}
        wide
      />

      <HoneypotField value={values.website} onChange={set('website')} />

      <SubmitRow
        busy={busy}
        label="Envoyer"
        busyLabel="Envoi en cours…"
        legal="Les informations transmises servent uniquement à traiter votre demande."
      />
    </FormShell>
  );
}
