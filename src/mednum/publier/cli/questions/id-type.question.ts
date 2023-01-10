import { ListQuestion } from 'inquirer';
import { PublierOptions } from '../publier-options';

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

export const idTypeQuestion = (publierOptions: Partial<PublierOptions>): ListQuestion & { name: keyof PublierOptions } => ({
  message: "Sélectionner le type d'id auquel rattacher la ressource sur Data.gouv",
  name: 'dataGouvIdType',
  type: 'list',
  validate: validateDataGouvIdType,
  when: (): boolean => validateDataGouvIdType(publierOptions.dataGouvIdType) !== true,
  choices: [IdTypeChoice.ORGANIZATION, IdTypeChoice.OWNER]
});
