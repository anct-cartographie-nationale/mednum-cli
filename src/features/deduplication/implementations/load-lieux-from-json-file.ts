import type { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { firstFile, readJsonFile } from '../../../libraries/file-system/index.js';

// Affirmation : ce fichier porte des lieux au schéma mednum. Rien ici ne le vérifie.
export const loadLieuxFromJsonFile = (source: string): SchemaLieuMediationNumerique[] =>
  readJsonFile(firstFile(source) ?? source) as SchemaLieuMediationNumerique[];
