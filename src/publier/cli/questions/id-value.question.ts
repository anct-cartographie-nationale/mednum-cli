import { InputQuestion } from 'inquirer';
import { PublierOptions } from '../publier-options';

enum DataGouvIdValueValidationMessages {
  REQUIRED = "La valeur de l'id est obligatoire"
}

const validateDataGouvIdValue = (input?: string): DataGouvIdValueValidationMessages | true =>
  input == null || input.trim() === '' ? DataGouvIdValueValidationMessages.REQUIRED : true;

export const idValueQuestion = (publierOptions: Partial<PublierOptions>): InputQuestion & { name: keyof PublierOptions } => ({
  message: (answers: Record<string, string>): string =>
    `Valeur de l'${answers['dataGouvIdType'] ?? 'id'} auquel rattacher la ressource sur Data.gouv`,
  name: 'dataGouvIdValue',
  validate: validateDataGouvIdValue,
  when: (): boolean => validateDataGouvIdValue(publierOptions.dataGouvIdValue) !== true,
  filter: (answer: string): string => answer.trim()
});
