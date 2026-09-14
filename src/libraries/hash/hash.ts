import { createHash } from 'node:crypto';

/**
 * Empreinte déterministe d'une valeur. C'est du calcul pur : la même entrée donne toujours la
 * même empreinte, ce sur quoi reposent l'identité des groupes de fusion et la détection des
 * changements d'une source à l'autre.
 */
export const sha256 = (value: string): string => createHash('sha256').update(value).digest('hex');
