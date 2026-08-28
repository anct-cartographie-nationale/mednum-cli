import type { Question } from 'inquirer';
import type { DedupliquerOptions } from '../dedupliquer-options';

enum SourceValidationMessages {
  REQUIRED = 'La source de données à dédupliquer est obligatoire'
}

const validateSource = (input?: unknown): SourceValidationMessages | true =>
  typeof input !== 'string' || input.trim() === '' ? SourceValidationMessages.REQUIRED : true;

export const sourceQuestion = (
  mednumDedupliquerProperties: DedupliquerOptions
): Question & { name: keyof DedupliquerOptions } => ({
  message: 'Source de données à dédupliquer',
  name: 'baseSource',
  validate: validateSource,
  when: (): boolean => validateSource(mednumDedupliquerProperties.source) !== true,
  filter: (answer: string): string => answer.trim()
});
