import { Command } from 'commander';
import { ListQuestion } from 'inquirer';
import { MednumProperties } from '../mednum-properties';

export enum IdTypeChoice {
  ORGANIZATION = "id d'organisation",
  OWNER = "id d'utilisateur"
}

enum DataGouvIdTypeValidationMessages {
  UnexpectedIdType = 'Seules les valeurs "id d\'organisation" et "id d\'utilisateur" sont admises'
}

const isExpectedIdType = (input?: string): boolean =>
  [IdTypeChoice.OWNER.toString(), IdTypeChoice.ORGANIZATION.toString()].includes(`${input}`);

const validateDataGouvIdType = (input?: string): DataGouvIdTypeValidationMessages | true =>
  isExpectedIdType(input) ? true : DataGouvIdTypeValidationMessages.UnexpectedIdType;

export const dataGouvIdTypeQuestion = (
  mednumImportProperties: Partial<MednumProperties>
): ListQuestion & { name: keyof MednumProperties } => ({
  message: "Sélectionner le type d'id auquel rattacher la ressource sur Data.gouv",
  name: 'dataGouvIdType',
  type: 'list',
  validate: validateDataGouvIdType,
  when: (): boolean => validateDataGouvIdType(mednumImportProperties.dataGouvIdType) !== true,
  choices: [IdTypeChoice.ORGANIZATION, IdTypeChoice.OWNER]
});

export const addIdTypeOption = (program: Command): Command =>
  program.option(
    '-t, --data-gouv-id-type <id-type>',
    "Le type de l'id est nécessaire savoir s'il faut rattacher les données à publier à un utilisateur ou à une organisation"
  );
