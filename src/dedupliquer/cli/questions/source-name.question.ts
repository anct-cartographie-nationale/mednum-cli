import { InputQuestion } from 'inquirer';
import { DedupliquerOptions } from '../dedupliquer-options';

enum SourceNameValidationMessages {
  REQUIRED = "Le nom de la source à l'origine de la données est obligatoire"
}

const validateSourceName = (input?: string): SourceNameValidationMessages | true =>
  input == null || input.trim() === '' ? SourceNameValidationMessages.REQUIRED : true;

export const sourceNameQuestion = (
  mednumImportProperties: DedupliquerOptions
): InputQuestion & { name: keyof DedupliquerOptions } => ({
  message: "Nom de l'entité source à l'origine de la collecte des données à dédupliquer",
  name: 'sourceName',
  validate: validateSourceName,
  when: (): boolean => validateSourceName(mednumImportProperties.sourceName) !== true,
  filter: (answer: string): string => answer.trim()
});
