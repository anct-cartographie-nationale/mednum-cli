import type { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { firstFile, readTextFileSync } from '../../../libraries/file-system/index.js';

export const loadLieuxFromJsonFile = (source: string): SchemaLieuMediationNumerique[] =>
  JSON.parse(readTextFileSync(firstFile(source) ?? source));
