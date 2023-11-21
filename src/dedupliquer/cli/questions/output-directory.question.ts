import { InputQuestion } from 'inquirer';
import { DedupliquerOptions } from '../dedupliquer-options';

enum OutputDirectoryValidationMessages {
  REQUIRED = 'Le dossier de sortie est obligatoire'
}

const validateOutputDirectory = (input?: string): OutputDirectoryValidationMessages | true =>
  input == null || input.trim() === '' ? OutputDirectoryValidationMessages.REQUIRED : true;

export const outputDirectoryQuestion = (
  mednumImportProperties: DedupliquerOptions
): InputQuestion & { name: keyof DedupliquerOptions } => ({
  message: 'Chemin du dossier qui va recevoir les fichiers dédupliqués',
  name: 'outputDirectory',
  validate: validateOutputDirectory,
  when: (): boolean => validateOutputDirectory(mednumImportProperties.outputDirectory) !== true,
  filter: (answer: string): string => answer.trim()
});
