/**
 * Décalage d'une apparition séquentielle.
 *
 * Fonction volontairement isolée dans un module SANS « use client » :
 * elle est appelée pendant le rendu serveur, pour calculer la valeur
 * passée en props à <Reveal>. Exportée depuis le module client, elle
 * serait refusée par React — une fonction client ne s'invoque pas
 * depuis le serveur.
 *
 * Le décalage est plafonné : au-delà d'une poignée d'éléments, attendre
 * deviendrait pénible plutôt qu'élégant. Les suivants partagent alors le
 * dernier palier.
 */
export function stagger(index: number, step = 70, max = 350): number {
  return Math.min(index * step, max);
}
