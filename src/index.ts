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

export * as acquisitionSource from './features/acquisition-source';
export * as deduplication from './features/deduplication';
export * as enrichissementTerritorial from './features/enrichissement-territorial';
export * as fusion from './features/fusion';
export * as publication from './features/publication';
export * as transformation from './features/transformation';

export * as collectivites from './libraries/collectivites';
export * as fileSystem from './libraries/file-system';
export * as http from './libraries/http';
export * as injection from './libraries/injection';
export * as journal from './libraries/journal';
export * as mediationNumerique from './libraries/mediation-numerique';
