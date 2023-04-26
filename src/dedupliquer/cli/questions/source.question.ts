import { InputQuestion } from 'inquirer';
import { DedupliquerOptions } from '../dedupliquer-options';

enum SourceValidationMessages {
  REQUIRED = 'La source de données à dédupliquer est obligatoire'
}

const validateSource = (input?: string): SourceValidationMessages | true =>
  input == null || input.trim() === '' ? SourceValidationMessages.REQUIRED : true;

export const sourceQuestion = (
  mednumDedupliquerProperties: DedupliquerOptions
): InputQuestion & { name: keyof DedupliquerOptions } => ({
  message: 'Source de données à dédupliquer',
  name: 'source',
  validate: validateSource,
  when: (): boolean => validateSource(mednumDedupliquerProperties.source) !== true,
  filter: (answer: string): string => answer.trim()
});
