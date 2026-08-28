import type { Question } from 'inquirer';
import type { FusionnerOptions } from '../fusionner-options';

enum InputFilesPatternValidationMessages {
  REQUIRED = 'Le masque des chemins à fusionner est obligatoire'
}

const validateInputFilesPattern = (input?: unknown): InputFilesPatternValidationMessages | true =>
  typeof input !== 'string' || input.trim() === '' ? InputFilesPatternValidationMessages.REQUIRED : true;

export const inputFilesPatternDirectoryQuestion = (
  mednumImportProperties: FusionnerOptions
): Question & { name: keyof FusionnerOptions } => ({
  message: 'Masque des chemins à fusionner',
  name: 'inputFilesPattern',
  validate: validateInputFilesPattern,
  when: (): boolean => validateInputFilesPattern(mednumImportProperties.inputFilesPattern) !== true,
  filter: (answer: string): string => answer.trim()
});
