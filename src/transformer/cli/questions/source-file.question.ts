import { InputQuestion } from 'inquirer';
import { TransformerOptions } from '../transformer-options';

enum SourceFileValidationMessages {
  REQUIRED = 'Le fichier source est obligatoire'
}

const validateSourceFile = (input?: string): SourceFileValidationMessages | true =>
  input == null || input.trim() === '' ? SourceFileValidationMessages.REQUIRED : true;

export const sourceFileQuestion = (
  mednumImportProperties: TransformerOptions
): InputQuestion & { name: keyof TransformerOptions } => ({
  message: 'Source qui contient les données originales à transformer',
  name: 'sourceFile',
  validate: validateSourceFile,
  when: (): boolean => validateSourceFile(mednumImportProperties.sourceFile) !== true,
  filter: (answer: string): string => answer.trim()
});
