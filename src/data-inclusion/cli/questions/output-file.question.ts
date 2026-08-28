import type { Question } from 'inquirer';
import type { DataInclusionOptions } from '../data-inclusion-options';

enum OutputFileValidationMessages {
  REQUIRED = 'Le fichier de sortie est obligatoire'
}

const validateOutputFile = (input?: unknown): OutputFileValidationMessages | true =>
  typeof input !== 'string' || input.trim() === '' ? OutputFileValidationMessages.REQUIRED : true;

export const outputFileQuestion = (
  dataInclusionOptions: DataInclusionOptions
): Question & { name: keyof DataInclusionOptions } => ({
  message: 'Chemin du fichier qui va recevoir les données extraites au format JSON',
  name: 'outputFile',
  validate: validateOutputFile,
  when: (): boolean => validateOutputFile(dataInclusionOptions.outputFile) !== true,
  filter: (answer: string): string => answer.trim()
});
