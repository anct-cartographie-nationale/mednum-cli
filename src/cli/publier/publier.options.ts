import type { Command } from 'commander';
import type { Question } from 'inquirer';

export type PublierOptions = {
  dataGouvApiKey: string;
  dataGouvApiUrl: string;
  dataGouvIdValue: string;
  dataGouvIdType: string;
  dataGouvMetadataFile: string;
  dataGouvZone: string;
};

export enum IdTypeChoice {
  ORGANIZATION = "id d'organisation",
  OWNER = "id d'utilisateur"
}

const UNEXPECTED_ID_TYPE = 'Seules les valeurs "id d\'organisation" et "id d\'utilisateur" sont admises';

const validateNotEmpty =
  (message: string) =>
  (input?: unknown): string | true =>
    typeof input !== 'string' || input.trim() === '' ? message : true;

const validateApiKey = validateNotEmpty("La clé d'API Data.gouv est obligatoire");
const validateIdValue = validateNotEmpty("La valeur de l'id est obligatoire");
const validateMetadataFile = validateNotEmpty('Le fichier de métadonnées est obligatoire');
const validateZone = validateNotEmpty('La couverture spatiale est obligatoire');

const isExpectedIdType = (input?: string): boolean =>
  [IdTypeChoice.OWNER.toString(), IdTypeChoice.ORGANIZATION.toString()].includes(`${input}`);

const validateIdType = (input?: string): string | true => (isExpectedIdType(input) ? true : UNEXPECTED_ID_TYPE);

const apiUrlOption = (program: Command): Command =>
  program.option(
    '-u, --data-gouv-api-url <api-url>',
    "L'URL de l'API data.gouv utilisé pour la publication. La valeur par défaut est l'URL de production : `https://www.data.gouv.fr/api/1`"
  );

const apiKeyOption = (program: Command): Command =>
  program.option(
    '-k, --data-gouv-api-key <api-key>',
    "Une clé d'API data.gouv est nécessaire pour que l'outil ait les droits nécessaires à la publication des données en votre nom en utilisant l'API (https://doc.data.gouv.fr/api/intro/#autorisations)"
  );

const idTypeOption = (program: Command): Command =>
  program.option(
    '-t, --data-gouv-id-type <id-type>',
    "Le type de l'id est nécessaire savoir s'il faut rattacher les données à publier à un utilisateur ou à une organisation"
  );

const idValueOption = (program: Command): Command =>
  program.option(
    '-v, --data-gouv-id-value <id-value>',
    "La valeur de l'id est nécessaire pour rattacher les données à publier à un utilisateur ou à une organisation existant sur data.gouv"
  );

const metadataFileOption = (program: Command): Command =>
  program.option(
    '-m, --data-gouv-metadata-file <metadata-file>',
    'Le chemin vers le fichier de métadonnées permet de savoir quel est le jeu de données à publier ainsi que les ressources qui le composent'
  );

const zoneOption = (program: Command): Command =>
  program.option(
    '-z, --data-gouv-zone <zone>',
    'La zone est nécessaire pour indiquer quel est le territoire couvert par le jeu de données'
  );

export const PUBLIER_OPTIONS: ((program: Command) => Command)[] = [
  apiUrlOption,
  apiKeyOption,
  idTypeOption,
  idValueOption,
  metadataFileOption,
  zoneOption
];

export const idTypeQuestion = (publierOptions: Partial<PublierOptions>): Question & { name: keyof PublierOptions } => ({
  message: "Sélectionner le type d'id auquel rattacher la ressource sur Data.gouv",
  name: 'dataGouvIdType',
  type: 'select',
  validate: validateIdType,
  when: (): boolean => validateIdType(publierOptions.dataGouvIdType) !== true,
  choices: [IdTypeChoice.ORGANIZATION, IdTypeChoice.OWNER]
});

export const publierOptionsQuestions = (publierOptions: PublierOptions): Question[] => [
  {
    message: "Clé d'API Data.gouv",
    name: 'dataGouvApiKey',
    type: 'input',
    validate: validateApiKey,
    when: (): boolean => validateApiKey(publierOptions.dataGouvApiKey) !== true,
    filter: (answer: string): string => answer.trim()
  },
  idTypeQuestion(publierOptions),
  {
    message: (answers: Record<string, string>): string =>
      `Valeur de l'${answers['dataGouvIdType'] ?? 'id'} auquel rattacher la ressource sur Data.gouv`,
    name: 'dataGouvIdValue',
    validate: validateIdValue,
    when: (): boolean => validateIdValue(publierOptions.dataGouvIdValue) !== true,
    filter: (answer: string): string => answer.trim()
  },
  {
    message: 'Chemin du fichier qui contient les métadonnées du jeu de données à publier',
    name: 'dataGouvMetadataFile',
    validate: validateMetadataFile,
    when: (): boolean => validateMetadataFile(publierOptions.dataGouvMetadataFile) !== true,
    filter: (answer: string): string => answer.trim()
  },
  {
    message: 'La zone couverte par le jeu de données, exemple pour Maine-et-Loire : fr:departement:49',
    name: 'dataGouvZone',
    validate: validateZone,
    when: (): boolean => validateZone(publierOptions.dataGouvZone) !== true,
    filter: (answer: string): string => answer.trim()
  }
];

const toDataGouvIdType = (environmentDataGouvIdType?: string): string | undefined => {
  if (environmentDataGouvIdType === 'organization') return IdTypeChoice.ORGANIZATION;
  if (environmentDataGouvIdType === 'owner') return IdTypeChoice.OWNER;
  return undefined;
};

const dataGouvApiUrlIfAny = (dataGouvApiUrl?: string): { dataGouvApiUrl?: string } =>
  dataGouvApiUrl == null ? {} : { dataGouvApiUrl };

const dataGouvApiKeyIfAny = (dataGouvApiKey?: string): { dataGouvApiKey?: string } =>
  dataGouvApiKey == null ? {} : { dataGouvApiKey };

const dataGouvIdValueIfAny = (dataGouvIdValue?: string): { dataGouvIdValue?: string } =>
  dataGouvIdValue == null ? {} : { dataGouvIdValue };

const dataGouvIdTypeIfAny = (dataGouvIdType?: string): { dataGouvIdType?: string } =>
  dataGouvIdType == null ? {} : { dataGouvIdType };

export const toPublierOptions = (environment: Record<string, string | undefined>): Partial<PublierOptions> => ({
  ...dataGouvApiUrlIfAny(environment['DATA_GOUV_API_URL']),
  ...dataGouvApiKeyIfAny(environment['DATA_GOUV_API_KEY']),
  ...dataGouvIdValueIfAny(environment['DATA_GOUV_REFERENCE_ID']),
  ...dataGouvIdTypeIfAny(toDataGouvIdType(environment['DATA_GOUV_REFERENCE_TYPE']))
});
