import { InputQuestion } from 'inquirer';
import { TransformerOptions } from '../transformer-options';

enum SourceNameValidationMessages {
  REQUIRED = "Le nom de la source à l'origine de la données est obligatoire"
}

const validateSourceName = (input?: string): SourceNameValidationMessages | true =>
  input == null || input.trim() === '' ? SourceNameValidationMessages.REQUIRED : true;

export const sourceNameQuestion = (
  mednumImportProperties: TransformerOptions
): InputQuestion & { name: keyof TransformerOptions } => ({
  message: "Nom de l'entité source à l'origine de la collecte des données à transformer",
  name: 'sourceName',
  validate: validateSourceName,
  when: (): boolean => validateSourceName(mednumImportProperties.sourceName) !== true,
  filter: (answer: string): string => answer.trim()
});
