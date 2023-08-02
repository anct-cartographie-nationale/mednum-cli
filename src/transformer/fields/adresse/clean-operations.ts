/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

import { DataSource } from '../../input';

export type CleanOperation = {
  name: string;
  selector: RegExp;
  negate?: boolean;
  fix: (toFix: string, source?: DataSource) => string;
};

const testCleanSelector = (cleanOperation: CleanOperation, property?: string): boolean =>
  property != null && new RegExp(cleanOperation.selector, 'u').test(property);

const shouldApplyFix = (cleanOperation: CleanOperation, property?: string): boolean =>
  cleanOperation.negate === true ? !testCleanSelector(cleanOperation, property) : testCleanSelector(cleanOperation, property);

export const toCleanField = (toFix: string, cleanOperation: CleanOperation): string =>
  shouldApplyFix(cleanOperation, toFix) ? cleanOperation.fix(toFix) : toFix;
