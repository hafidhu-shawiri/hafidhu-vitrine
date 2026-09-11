import 'server-only';

/**
 * Limitation de débit simple, en mémoire.
 *
 * Portée volontairement modeste : elle décourage les envois répétés
 * depuis une même adresse. Sur un hébergement sans serveur, la mémoire
 * n'est pas partagée entre instances — ce n'est donc pas une protection
 * absolue, mais un filtre de première intention, complémentaire du champ
 * leurre et de la validation serveur.
 *
 * Si le volume le justifie un jour, ce module est le seul point à
 * remplacer par un compteur partagé (Postgres ou Redis).
 */

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Le compteur s'incrémente avant la validation : une personne qui corrige
 * plusieurs fautes de saisie consomme donc des tentatives. Le plafond est
 * fixé assez haut pour ne jamais gêner un usage normal, tout en restant
 * bas pour un envoi automatisé.
 */
const MAX_REQUESTS = 12;

/** Purge opportuniste pour éviter que la table ne grossisse indéfiniment. */
function sweep(now: number) {
  if (buckets.size < 500) return;
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  sweep(now);

  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  entry.count += 1;

  if (entry.count > MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

/** Adresse du client, telle que transmise par la couche d'hébergement. */
export function clientKey(request: Request, scope: string): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'inconnu';
  return `${scope}:${ip}`;
}
