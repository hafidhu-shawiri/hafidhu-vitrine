/**
 * Test RÉEL de la chaîne de messagerie.
 *
 *     node scripts/test-smtp.mjs
 *
 * Trois étapes, dans l'ordre :
 *   1. connexion et authentification au serveur SMTP ;
 *   2. envoi d'un message de contrôle au destinataire configuré ;
 *   3. lecture de la réponse du serveur (identifiant de mise en file).
 *
 * Aucun mot de passe n'est affiché. L'hôte et le destinataire le sont :
 * ce sont des informations de configuration, pas des secrets.
 */

import nodemailer from 'nodemailer';
import { loadEnv, requireEnv } from './db.mjs';

let failures = 0;

function check(ok, label, detail = '') {
  console.log(`  ${ok ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures += 1;
}

async function main() {
  await loadEnv();

  const host = requireEnv('SMTP_HOST');
  const port = Number(requireEnv('SMTP_PORT'));
  const user = requireEnv('SMTP_USER');
  const pass = requireEnv('SMTP_PASSWORD');
  const from = process.env.SMTP_FROM || user;
  const to = requireEnv('CONTACT_RECIPIENT');
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465;

  console.log('\n═══════════════════════════════════════════════════');
  console.log('  HAFIDHU — Test de la messagerie SMTP');
  console.log('═══════════════════════════════════════════════════\n');
  console.log(`  Serveur      : ${host}:${port} (${secure ? 'SSL implicite' : 'STARTTLS'})`);
  console.log(`  Destinataire : ${to}\n`);

  const transport = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });

  try {
    await transport.verify();
    check(true, 'connexion et authentification acceptées');
  } catch (error) {
    check(false, 'connexion et authentification', error.message);
    process.exit(1);
  }

  const stamp = new Date().toISOString();

  try {
    const info = await transport.sendMail({
      from,
      to,
      subject: `HAFIDHU — contrôle technique de la messagerie (${stamp})`,
      text:
        'Message de contrôle automatique émis par scripts/test-smtp.mjs.\n\n' +
        'Il vérifie que la chaîne de notification du site vitrine fonctionne ' +
        'de bout en bout : connexion, authentification, remise.\n\n' +
        'Aucune action n’est attendue de votre part.\n',
    });

    check(info.accepted?.length === 1, 'destinataire accepté par le serveur',
      `${info.accepted?.length ?? 0} accepté(s) / ${info.rejected?.length ?? 0} rejeté(s)`);
    check(Boolean(info.response), 'réponse du serveur', info.response);
    check(Boolean(info.messageId), 'identifiant de message attribué');
  } catch (error) {
    check(false, 'envoi du message', error.message);
  } finally {
    transport.close();
  }

  console.log('\n═══════════════════════════════════════════════════');
  console.log(failures === 0 ? '  ✓ Chaîne de messagerie opérationnelle.' : `  ✗ ${failures} échec(s).`);
  console.log('═══════════════════════════════════════════════════\n');

  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error('\n✗ Erreur inattendue :', error.message, '\n');
  process.exit(1);
});
