import type { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { firstFile, readTextFileSync } from '../../../libraries/file-system/index.js';

// Affirmation : ce fichier porte des lieux au schéma mednum. `JSON.parse` ne vérifie rien.
export const loadLieuxFromJsonFile = (source: string): SchemaLieuMediationNumerique[] =>
  JSON.parse(readTextFileSync(firstFile(source) ?? source)) as SchemaLieuMediationNumerique[];
