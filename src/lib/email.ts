import 'server-only';

/**
 * Envoi des notifications par e-mail — SERVEUR UNIQUEMENT.
 *
 * Principe : l'e-mail ne bloque jamais la réponse au visiteur. La donnée
 * est déjà enregistrée en base quand l'envoi part ; si le SMTP échoue,
 * le visiteur reçoit quand même sa confirmation et l'incident est
 * journalisé — sans jamais écrire de secret dans les logs.
 */

import nodemailer from 'nodemailer';
import { contact as publicContact } from '@/content/contact';

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD
  );
}

function createTransport() {
  const port = Number(process.env.SMTP_PORT ?? 465);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // Port 465 : SSL implicite. Port 587 : STARTTLS.
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASSWORD!,
    },
  });
}

/** Échappe le HTML : le contenu provient d'un formulaire public. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function layout(title: string, rows: readonly [string, string][], footer: string): string {
  const cells = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #E4E1D7;vertical-align:top;width:180px;color:#62727F;font-size:13px">${escapeHtml(label)}</td>
          <td style="padding:10px 0;border-bottom:1px solid #E4E1D7;vertical-align:top;color:#24323D;font-size:14px;white-space:pre-wrap">${escapeHtml(value) || '—'}</td>
        </tr>`
    )
    .join('');

  return `<!doctype html>
<html lang="fr"><body style="margin:0;background:#F8F7F2;font-family:Inter,Segoe UI,system-ui,sans-serif">
  <div style="max-width:640px;margin:0 auto;padding:24px">
    <div style="background:#102A43;border-radius:12px 12px 0 0;padding:20px 24px">
      <p style="margin:0;color:#D4A72C;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase">HAFIDHU — Le Gardien</p>
      <h1 style="margin:6px 0 0;color:#FFFFFF;font-size:18px;font-weight:600">${escapeHtml(title)}</h1>
    </div>
    <div style="background:#FFFFFF;border:1px solid #E4E1D7;border-top:0;border-radius:0 0 12px 12px;padding:8px 24px 20px">
      <table style="width:100%;border-collapse:collapse">${cells}</table>
      <p style="margin:18px 0 0;color:#62727F;font-size:12px;line-height:1.6">${escapeHtml(footer)}</p>
    </div>
  </div>
</body></html>`;
}

type SendResult = { sent: boolean; reason?: string };

async function send(subject: string, html: string, text: string, replyTo?: string): Promise<SendResult> {
  if (!isEmailConfigured()) {
    return { sent: false, reason: 'SMTP non configuré' };
  }

  try {
    const transporter = createTransport();
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER!,
      to: process.env.CONTACT_RECIPIENT ?? publicContact.email,
      replyTo,
      subject,
      text,
      html,
    });
    return { sent: true };
  } catch (error) {
    // Le message d'erreur du transport peut contenir des éléments de
    // configuration : on ne journalise qu'une trace générique.
    console.error(
      '[email] Échec de l’envoi de la notification.',
      error instanceof Error ? error.name : 'erreur inconnue'
    );
    return { sent: false, reason: 'échec du transport' };
  }
}

export async function sendContactNotification(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<SendResult> {
  const rows: [string, string][] = [
    ['Nom', `${data.firstName} ${data.lastName}`],
    ['Email', data.email],
    ['Téléphone', data.phone ?? ''],
    ['Sujet', data.subject],
    ['Message', data.message],
  ];

  return send(
    `[HAFIDHU] Contact — ${data.subject}`,
    layout('Nouveau message de contact', rows, 'Reçu via le formulaire de contact du site HAFIDHU.'),
    rows.map(([k, v]) => `${k} : ${v}`).join('\n'),
    data.email
  );
}

export async function sendWaitlistNotification(data: {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  profile: string;
  featureInterest?: string;
}): Promise<SendResult> {
  const rows: [string, string][] = [
    ['Nom', `${data.firstName} ${data.lastName}`],
    ['Email', data.email],
    ['Pays', data.country],
    ['Profil', data.profile],
    ['Fonctionnalité souhaitée', data.featureInterest ?? ''],
  ];

  return send(
    `[HAFIDHU] Liste d'attente — ${data.profile}`,
    layout(
      "Nouvelle inscription à la liste d'attente",
      rows,
      "Reçu via le formulaire de liste d'attente du site HAFIDHU."
    ),
    rows.map(([k, v]) => `${k} : ${v}`).join('\n'),
    data.email
  );
}
