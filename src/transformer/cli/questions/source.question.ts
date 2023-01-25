import { InputQuestion } from 'inquirer';
import { TransformerOptions } from '../transformer-options';

enum SourceValidationMessages {
  REQUIRED = 'Le fichier source est obligatoire'
}

const validateSource = (input?: string): SourceValidationMessages | true =>
  input == null || input.trim() === '' ? SourceValidationMessages.REQUIRED : true;

export const sourceQuestion = (
  mednumImportProperties: TransformerOptions
): InputQuestion & { name: keyof TransformerOptions } => ({
  message: 'Source qui contient les données originales à transformer',
  name: 'source',
  validate: validateSource,
  when: (): boolean => validateSource(mednumImportProperties.source) !== true,
  filter: (answer: string): string => answer.trim()
});
