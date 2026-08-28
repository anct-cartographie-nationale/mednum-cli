import type { Question } from 'inquirer';
import type { TransformerOptions } from '../transformer-options';

enum SourceValidationMessages {
  REQUIRED = 'Le fichier source est obligatoire'
}

const validateSource = (input?: unknown): SourceValidationMessages | true =>
  typeof input !== 'string' || input.trim() === '' ? SourceValidationMessages.REQUIRED : true;

export const sourceQuestion = (mednumImportProperties: TransformerOptions): Question & { name: keyof TransformerOptions } => ({
  message: 'Source qui contient les données originales à transformer',
  name: 'source',
  validate: validateSource,
  when: (): boolean => validateSource(mednumImportProperties.source) !== true,
  filter: (answer: string): string => answer.trim()
});
