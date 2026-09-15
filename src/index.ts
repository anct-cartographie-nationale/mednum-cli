/**
 * Point d'entrée bibliothèque : n'expose que des capacités et des contrats, sans aucun effet
 * de bord. Lire ce module ne lance rien, à la différence de `cli/index.ts` que `bin/mednum`
 * exécute.
 *
 * Chaque capacité est exposée sous son propre espace de noms, et non à plat. Ce n'est pas une
 * commodité : plusieurs capacités déclarent des contrats de même nom, chacune exprimant ce
 * dont elle a besoin sans connaître celle qui le réalisera. Les aplatir les ferait entrer en
 * collision.
 *
 * Une intégration fournit les implémentations de ces contrats, comme le fait chaque commande
 * de la CLI, puis appelle l'ability voulue.
 */

export * as acquisitionSource from './features/acquisition-source/index.js';
export * as deduplication from './features/deduplication/index.js';
export * as enrichissementTerritorial from './features/enrichissement-territorial/index.js';
export * as fusion from './features/fusion/index.js';
export * as publication from './features/publication/index.js';
export * as transformation from './features/transformation/index.js';

export * as collectivites from './libraries/collectivites/index.js';
export * as fileSystem from './libraries/file-system/index.js';
export * as http from './libraries/http/index.js';
export * as injection from './libraries/injection/index.js';
export * as journal from './libraries/journal/index.js';
export * as loading from './libraries/loading/index.js';
export * as mediationNumerique from './libraries/mediation-numerique/index.js';
