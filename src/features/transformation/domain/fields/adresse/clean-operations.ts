import type { DataSource } from '../../matching';

export type CleanOperation = {
  name: string;
  selector: RegExp;
  negate?: boolean;
  fix: (toFix: string, source?: DataSource) => string;
};

/**
 * Le sélecteur est reconstruit pour garantir le drapeau `u` et écarter `g` et `y`, dont l'état
 * interne fausserait un `test` répété. Les autres drapeaux — `i` au premier chef — sont
 * conservés : les perdre a déjà rendu muettes des opérations qui semblaient pourtant écrites.
 */
const selectorFlags = (selector: RegExp): string =>
  `${selector.flags.replace(/[gy]/gu, '')}${selector.flags.includes('u') ? '' : 'u'}`;

const testCleanSelector = (cleanOperation: CleanOperation, property?: string): boolean =>
  property != null && new RegExp(cleanOperation.selector.source, selectorFlags(cleanOperation.selector)).test(property);

const shouldApplyFix = (cleanOperation: CleanOperation, property?: string): boolean =>
  cleanOperation.negate === true ? !testCleanSelector(cleanOperation, property) : testCleanSelector(cleanOperation, property);

export const toCleanField = (toFix: string, cleanOperation: CleanOperation): string =>
  shouldApplyFix(cleanOperation, toFix) ? cleanOperation.fix(toFix) : toFix;
