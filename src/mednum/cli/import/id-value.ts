import { Command } from 'commander';
import { InputQuestion } from 'inquirer';
import { MednumProperties } from '../mednum-properties';

enum DataGouvIdValueValidationMessages {
  REQUIRED = "La valeur de l'id est obligatoire"
}

const validateDataGouvIdValue = (input?: string): DataGouvIdValueValidationMessages | true =>
  input == null || input.trim() === '' ? DataGouvIdValueValidationMessages.REQUIRED : true;

export const dataGouvIdValueQuestion = (
  mednumImportProperties: MednumProperties
): InputQuestion & { name: keyof MednumProperties } => ({
  message: (answers: Record<string, string>): string =>
    `Valeur de l'${answers['dataGouvIdType'] ?? 'id'} auquel rattacher la ressource sur Data.gouv`,
  name: 'dataGouvIdValue',
  validate: validateDataGouvIdValue,
  when: (): boolean => validateDataGouvIdValue(mednumImportProperties.dataGouvIdValue) !== true,
  filter: (answer: string): string => answer.trim()
});

export const addIdValueOption = (program: Command): Command =>
  program.option(
    '-i, --data-gouv-id-value <id-value>',
    "La valeur de l'id est nécessaire pour rattacher les données à publier à un utilisateur ou à une organisation existant sur data.gouv"
  );
