import { InputQuestion } from 'inquirer';
import { ExtractOptions } from '../extract-options';

enum OutputDirectoryValidationMessages {
  REQUIRED = 'Le dossier de sortie est obligatoire'
}

const validateOutputDirectory = (input?: string): OutputDirectoryValidationMessages | true =>
  input == null || input.trim() === '' ? OutputDirectoryValidationMessages.REQUIRED : true;

export const outputDirectoryQuestion = (
  mednumImportProperties: ExtractOptions
): InputQuestion & { name: keyof ExtractOptions } => ({
  message: 'Chemin du dossier qui va recevoir les fichiers extraits',
  name: 'outputDirectory',
  validate: validateOutputDirectory,
  when: (): boolean => validateOutputDirectory(mednumImportProperties.outputDirectory) !== true,
  filter: (answer: string): string => answer.trim()
});
