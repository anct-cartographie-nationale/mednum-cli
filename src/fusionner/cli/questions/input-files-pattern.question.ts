import { InputQuestion } from 'inquirer';
import { FusionnerOptions } from '../fusionner-options';

enum InputFilesPatternValidationMessages {
  REQUIRED = 'Le masque des chemins à fusionner est obligatoire'
}

const validateInputFilesPattern = (input?: string): InputFilesPatternValidationMessages | true =>
  input == null || input.trim() === '' ? InputFilesPatternValidationMessages.REQUIRED : true;

export const inputFilesPatternDirectoryQuestion = (
  mednumImportProperties: FusionnerOptions
): InputQuestion & { name: keyof FusionnerOptions } => ({
  message: 'Masque des chemins à fusionner',
  name: 'inputFilesPattern',
  validate: validateInputFilesPattern,
  when: (): boolean => validateInputFilesPattern(mednumImportProperties.inputFilesPattern) !== true,
  filter: (answer: string): string => answer.trim()
});
