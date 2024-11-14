import { InputQuestion } from 'inquirer';
import { FusionnerOptions } from '../fusionner-options';

enum OutputDirectoryValidationMessages {
  REQUIRED = 'Le dossier de sortie est obligatoire'
}

const validateOutputDirectory = (input?: string): OutputDirectoryValidationMessages | true =>
  input == null || input.trim() === '' ? OutputDirectoryValidationMessages.REQUIRED : true;

export const outputDirectoryQuestion = (
  mednumImportProperties: FusionnerOptions
): InputQuestion & { name: keyof FusionnerOptions } => ({
  message: 'Chemin du dossier qui va recevoir les fichiers fusionnés',
  name: 'outputDirectory',
  validate: validateOutputDirectory,
  when: (): boolean => validateOutputDirectory(mednumImportProperties.outputDirectory) !== true,
  filter: (answer: string): string => answer.trim()
});
