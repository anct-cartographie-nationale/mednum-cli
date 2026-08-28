import type { Question } from 'inquirer';
import type { FusionnerOptions } from '../fusionner-options';

enum OutputDirectoryValidationMessages {
  REQUIRED = 'Le dossier de sortie est obligatoire'
}

const validateOutputDirectory = (input?: unknown): OutputDirectoryValidationMessages | true =>
  typeof input !== 'string' || input.trim() === '' ? OutputDirectoryValidationMessages.REQUIRED : true;

export const outputDirectoryQuestion = (
  mednumImportProperties: FusionnerOptions
): Question & { name: keyof FusionnerOptions } => ({
  message: 'Chemin du dossier qui va recevoir les fichiers fusionnés',
  name: 'outputDirectory',
  validate: validateOutputDirectory,
  when: (): boolean => validateOutputDirectory(mednumImportProperties.outputDirectory) !== true,
  filter: (answer: string): string => answer.trim()
});
