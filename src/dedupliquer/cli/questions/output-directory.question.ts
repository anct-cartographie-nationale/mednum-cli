import type { Question } from 'inquirer';
import type { DedupliquerOptions } from '../dedupliquer-options';

enum OutputDirectoryValidationMessages {
  REQUIRED = 'Le dossier de sortie est obligatoire'
}

const validateOutputDirectory = (input?: unknown): OutputDirectoryValidationMessages | true =>
  typeof input !== 'string' || input.trim() === '' ? OutputDirectoryValidationMessages.REQUIRED : true;

export const outputDirectoryQuestion = (
  mednumImportProperties: DedupliquerOptions
): Question & { name: keyof DedupliquerOptions } => ({
  message: 'Chemin du dossier qui va recevoir les fichiers dédupliqués',
  name: 'outputDirectory',
  validate: validateOutputDirectory,
  when: (): boolean => validateOutputDirectory(mednumImportProperties.outputDirectory) !== true,
  filter: (answer: string): string => answer.trim()
});
