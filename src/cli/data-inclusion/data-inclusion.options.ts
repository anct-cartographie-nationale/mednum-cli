import type { Command } from 'commander';
import type { Question } from 'inquirer';

export type DataInclusionOptions = {
  outputFile: string;
  filter: string;
  dataInclusionApiKey: string;
};

const OUTPUT_FILE_REQUIRED = 'Le fichier de sortie est obligatoire';
const API_KEY_REQUIRED = "La clé d'API de Data Inclusion est obligatoire";

const validateNotEmpty =
  (message: string) =>
  (input?: unknown): string | true =>
    typeof input !== 'string' || input.trim() === '' ? message : true;

const validateOutputFile = validateNotEmpty(OUTPUT_FILE_REQUIRED);
const validateApiKey = validateNotEmpty(API_KEY_REQUIRED);

const outputFileOption = (program: Command): Command =>
  program.option(
    '-o, --output-file <output-file>',
    'Le chemin du fichier se sortie est utiliser pour créer le fichier qui va recevoir les données format JSON'
  );

const filterOption = (program: Command): Command =>
  program.option(
    '-f, --filter <filter>',
    'Le filtre permet de ne sélectionner que les lignes du fichier data.inclusion dont la source correspond au filtre.'
  );

const apiKeyOption = (program: Command): Command =>
  program.option(
    '-k, --data-inclusion-api-key <api-key>',
    "Une clé d'API data inclusion est nécessaire pour que l'outil ait les droits nécessaires à la récupération des données en votre nom en utilisant l'API (https://www.data.inclusion.beta.gouv.fr/api/lapi-data-inclusion)"
  );

export const DATA_INCLUSION_OPTIONS: ((program: Command) => Command)[] = [outputFileOption, filterOption, apiKeyOption];

export const dataInclusionOptionsQuestions = (dataInclusionOptions: DataInclusionOptions): Question[] => [
  {
    message: 'Chemin du fichier qui va recevoir les données extraites au format JSON',
    name: 'outputFile',
    validate: validateOutputFile,
    when: (): boolean => validateOutputFile(dataInclusionOptions.outputFile) !== true,
    filter: (answer: string): string => answer.trim()
  },
  {
    message: "Clé d'API Data Inclusion",
    name: 'dataInclusionApiKey',
    type: 'input',
    validate: validateApiKey,
    when: (): boolean => validateApiKey(dataInclusionOptions.dataInclusionApiKey) !== true,
    filter: (answer: string): string => answer.trim()
  }
];

const outputFileIfAny = (outputFile?: string): { outputFile?: string } => (outputFile == null ? {} : { outputFile });

const dataInclusionApiKeyIfAny = (dataInclusionApiKey?: string): { dataInclusionApiKey?: string } =>
  dataInclusionApiKey == null ? {} : { dataInclusionApiKey };

const filterIfAny = (filter?: string): { filter?: string } => (filter == null ? {} : { filter });

export const toDataInclusionOptions = (environment: Record<string, string | undefined>): Partial<DataInclusionOptions> => ({
  ...outputFileIfAny(environment['DATA_INCLUSION_OUTPUT_FILE']),
  ...dataInclusionApiKeyIfAny(environment['DATA_INCLUSION_API_KEY']),
  ...filterIfAny(environment['DATA_INCLUSION_FILTER'])
});
