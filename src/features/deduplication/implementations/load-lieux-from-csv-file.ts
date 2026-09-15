import type { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { parseCsvRecords, withoutEmptyFields } from '../../../libraries/csv/index.js';
import { firstFile, readTextFileSync } from '../../../libraries/file-system/index.js';

export const loadLieuxFromCsvFile = (source: string): SchemaLieuMediationNumerique[] =>
  parseCsvRecords(readTextFileSync(firstFile(source) ?? source)).map(
    withoutEmptyFields
  ) as unknown as SchemaLieuMediationNumerique[];
