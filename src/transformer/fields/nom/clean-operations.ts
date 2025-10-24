import { DataSource } from '../../input';

type CleanOperation = {
  name: string;
  selector: RegExp;
  negate?: boolean;
  fix: (toFix: string, source?: DataSource) => string;
};
const testCleanSelector = (cleanOperation: CleanOperation, property?: string): boolean =>
  property != null && new RegExp(cleanOperation.selector, 'u').test(property);

const shouldApplyFix = (cleanOperation: CleanOperation, property?: string): boolean =>
  cleanOperation.negate === true ? !testCleanSelector(cleanOperation, property) : testCleanSelector(cleanOperation, property);

const REMOVE_NOM_INVALID: CleanOperation = {
  name: 'remove nom invalid',
  selector:
    /^(Réussir mes échanges avec France Travail|Découvrir et m'approprier les services de francetravail.fr|Mobiliser mes services numériques France Travail|Ordinateur|Wifi)$/,
  fix: (): string => ''
};

export const CLEAN_NOM = [REMOVE_NOM_INVALID];

export const toCleanField = (toFix: string, cleanOperation: CleanOperation): string =>
  shouldApplyFix(cleanOperation, toFix) ? cleanOperation.fix(toFix) : toFix;
