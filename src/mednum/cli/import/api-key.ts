import { Command } from 'commander';
import { Question } from 'inquirer';

export type MednumProperties = {
  dataGouvApiKey: string;
  dataGouvIdValue: string;
  dataGouvIdType: string;
  dataGouvMetadataFile: string;
};

enum DataGouvApiKeyValidationMessages {
  REQUIRED = "La clé d'API Data.gouv est obligatoire"
}

const validateDataGouvApiKey = (input?: string): DataGouvApiKeyValidationMessages | true =>
  input == null || input.trim() === '' ? DataGouvApiKeyValidationMessages.REQUIRED : true;

export const dataGouvApiKeyQuestion = (
  mednumImportProperties: MednumProperties
): Question & { name: keyof MednumProperties } => ({
  message: "Clé d'API Data.gouv",
  name: 'dataGouvApiKey',
  type: 'input',
  validate: validateDataGouvApiKey,
  when: (): boolean => validateDataGouvApiKey(mednumImportProperties.dataGouvApiKey) !== true,
  filter: (answer: string): string => answer.trim()
});

export const addApiKeyOption = (program: Command): Command =>
  program.option(
    '-k, --data-gouv-api-key <api-key>',
    "Une clé d'API data.gouv est nécessaire pour que l'outil ait les droits nécessaires à la publication des données en votre nom en utilisant l'API (https://doc.data.gouv.fr/api/intro/#autorisations)"
  );
