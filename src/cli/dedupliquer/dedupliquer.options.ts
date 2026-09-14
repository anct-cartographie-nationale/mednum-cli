import type { Command } from 'commander';
import type { Question } from 'inquirer';

export type DedupliquerOptions = {
  source: string;
  baseSource: string;
  outputDirectory: string;
  sourceName: string;
  territory: string;
  cartographieNationaleApiUrl: string;
  cartographieNationaleApiKey?: string;
  allowInternal: boolean;
};

const validateNotEmpty =
  (message: string) =>
  (input?: unknown): string | true =>
    typeof input !== 'string' || input.trim() === '' ? message : true;

const validateOutputDirectory = validateNotEmpty('Le dossier de sortie est obligatoire');
const validateSource = validateNotEmpty('La source de données à dédupliquer est obligatoire');
const validateSourceName = validateNotEmpty("Le nom de la source à l'origine de la données est obligatoire");
const validateTerritory = validateNotEmpty('Le nom du territoire couvert par les données est obligatoire');

const cutoffOption = (program: Command): Command =>
  program.option(
    '-c, --cutoff <cutoff>',
    'Le seuil en pourcent au-delà duquel deux données sont considérées comme étant des doublons'
  );

const outputDirectoryOption = (program: Command): Command =>
  program.option('-o, --output-directory <output-directory>', 'Le dossier dans lequel écrire les fichiers dédupliqués');

const sourceOption = (program: Command): Command =>
  program.option('-s, --source <source>', 'La source de données à dédupliquer');

const baseSourceOption = (program: Command): Command =>
  program.option('-b, --base-source <base-source>', 'La source de données de base dans laquelle identifier les doublons');

const sourceNameOption = (program: Command): Command =>
  program.option('-n, --source-name <source-name>', "Le nom de l'entité source à l'origine de la collecte des données");

const territoryOption = (program: Command): Command =>
  program.option('-t, --territory <territory>', 'Le nom du territoire couvert par les données');

const apiKeyOption = (program: Command): Command =>
  program.option(
    '-k, --cartographie-nationale-api-key <api-key>',
    "Lorsque la clé d'API dela cartographie nationale est fournie, les groupes de fusion sont sauvegardés par API"
  );

const allowInternalOption = (program: Command): Command =>
  program.option('-i, --allow-internal <allow-internal>', 'Autorise les fusion interne à une même source de données');

export const DEDUPLIQUER_OPTIONS: ((program: Command) => Command)[] = [
  cutoffOption,
  outputDirectoryOption,
  sourceOption,
  baseSourceOption,
  sourceNameOption,
  territoryOption,
  apiKeyOption,
  allowInternalOption
];

export const dedupliquerOptionsQuestions = (dedupliquerOptions: DedupliquerOptions): Question[] => [
  {
    message: 'Chemin du dossier qui va recevoir les fichiers dédupliqués',
    name: 'outputDirectory',
    validate: validateOutputDirectory,
    when: (): boolean => validateOutputDirectory(dedupliquerOptions.outputDirectory) !== true,
    filter: (answer: string): string => answer.trim()
  },
  {
    message: 'Source de données à dédupliquer',
    name: 'baseSource',
    validate: validateSource,
    when: (): boolean => validateSource(dedupliquerOptions.source) !== true,
    filter: (answer: string): string => answer.trim()
  },
  {
    message: "Nom de l'entité source à l'origine de la collecte des données à dédupliquer",
    name: 'sourceName',
    validate: validateSourceName,
    when: (): boolean => validateSourceName(dedupliquerOptions.sourceName) !== true,
    filter: (answer: string): string => answer.trim()
  },
  {
    message: 'Nom du territoire couvert par les données à dédupliquer',
    name: 'territory',
    validate: validateTerritory,
    when: (): boolean => validateTerritory(dedupliquerOptions.territory) !== true,
    filter: (answer: string): string => answer.trim()
  }
];

const cartographieNationaleApiUrlIfAny = (cartographieNationaleApiUrl?: string): { cartographieNationaleApiUrl?: string } =>
  cartographieNationaleApiUrl == null ? {} : { cartographieNationaleApiUrl };

const cartographieNationaleApiKeyIfAny = (cartographieNationaleApiKey?: string): { cartographieNationaleApiKey?: string } =>
  cartographieNationaleApiKey == null ? {} : { cartographieNationaleApiKey };

export const toDedupliquerOptions = (environment: Record<string, string | undefined>): Partial<DedupliquerOptions> => ({
  ...cartographieNationaleApiUrlIfAny(environment['CARTOGRAPHIE_NATIONALE_API_URL']),
  ...cartographieNationaleApiKeyIfAny(environment['CARTOGRAPHIE_NATIONALE_API_KEY'])
});
