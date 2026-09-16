import type { Command } from 'commander';
import type { Question } from 'inquirer';

export type TransformerOptions = {
  source: string;
  encoding?: string;
  delimiter?: string;
  apiEnvKey?: string;
  configFile: string;
  outputDirectory: string;
  sourceName: string;
  territory: string;
  envKey?: string;
  addressCache: string;
};

/**
 * Le cache des adresses déjà géocodées n'est pas livré avec le paquet : hors du dépôt, ce
 * chemin n'existe pas et la transformation regéocode tout.
 */
const DEFAULT_ADDRESS_CACHE = './assets/input/addresses.json';

const validateNotEmpty =
  (message: string) =>
  (input?: unknown): string | true =>
    typeof input !== 'string' || input.trim() === '' ? message : true;

const validateSource = validateNotEmpty('Le fichier source est obligatoire');
const validateConfigFile = validateNotEmpty('Le fichier de configuration est obligatoire');
const validateOutputDirectory = validateNotEmpty('Le dossier de sortie est obligatoire');
const validateSourceName = validateNotEmpty("Le nom de la source à l'origine de la données est obligatoire");
const validateTerritory = validateNotEmpty('Le nom du territoire couvert par les données est obligatoire');

const configFileOption = (program: Command): Command =>
  program.option(
    '-c, --config-file <config-file>',
    'Le chemin vers le fichier de configuration contenant les instructions de transformation'
  );

const delimiterOption = (program: Command): Command =>
  program.option('-d, --delimiter <delimiter>', "Le délimiteur entre les données d'un fichier csv");

const encodingOption = (program: Command): Command => program.option('-e, --encoding <encoding>', "L'encodage des données");

const envKeyOption = (program: Command): Command =>
  program.option('-a, --api-env-key <api-env-key>', "Nom de la variable d'environnement permettant de récupérer la clé d'API");

const addressCacheOption = (program: Command): Command =>
  program.option(
    '--address-cache <address-cache>',
    `Le fichier des adresses déjà géocodées, réutilisées plutôt que redemandées à la Base Adresse Nationale (défaut : ${DEFAULT_ADDRESS_CACHE})`
  );

const outputDirectoryOption = (program: Command): Command =>
  program.option('-o, --output-directory <output-directory>', 'Le dossier dans lequel écrire les fichiers transformés');

const sourceOption = (program: Command): Command =>
  program.option(
    '-s, --source <source>',
    'La source originale qui contient les données à transformer selon le schéma des lieux de médiation numérique. La source peut être un fichier ou une URL, les données doivent être au format CSV ou JSON'
  );

const sourceNameOption = (program: Command): Command =>
  program.option('-n, --source-name <source-name>', "Le nom de l'entité source à l'origine de la collecte des données");

const territoryOption = (program: Command): Command =>
  program.option('-t, --territory <territory>', 'Le nom du territoire couvert par les données');

export const TRANSFORMER_OPTIONS: ((program: Command) => Command)[] = [
  addressCacheOption,
  configFileOption,
  delimiterOption,
  encodingOption,
  envKeyOption,
  outputDirectoryOption,
  sourceOption,
  sourceNameOption,
  territoryOption
];

export const transformerOptionsQuestions = (transformerOptions: TransformerOptions): Question[] => [
  {
    message: 'Source qui contient les données originales à transformer',
    name: 'source',
    validate: validateSource,
    when: (): boolean => validateSource(transformerOptions.source) !== true,
    filter: (answer: string): string => answer.trim()
  },
  {
    message: 'Chemin du fichier de configuration qui contient les instructions de transformation',
    name: 'configFile',
    validate: validateConfigFile,
    when: (): boolean => validateConfigFile(transformerOptions.configFile) !== true,
    filter: (answer: string): string => answer.trim()
  },
  {
    message: 'Chemin du dossier qui va recevoir les fichiers transformés',
    name: 'outputDirectory',
    validate: validateOutputDirectory,
    when: (): boolean => validateOutputDirectory(transformerOptions.outputDirectory) !== true,
    filter: (answer: string): string => answer.trim()
  },
  {
    message: "Nom de l'entité source à l'origine de la collecte des données à transformer",
    name: 'sourceName',
    validate: validateSourceName,
    when: (): boolean => validateSourceName(transformerOptions.sourceName) !== true,
    filter: (answer: string): string => answer.trim()
  },
  {
    message: 'Nom du territoire couvert par les données à transformer',
    name: 'territory',
    validate: validateTerritory,
    when: (): boolean => validateTerritory(transformerOptions.territory) !== true,
    filter: (answer: string): string => answer.trim()
  }
];

export const toTransformerOptions = (environment: Record<string, string | undefined>): Partial<TransformerOptions> => ({
  addressCache: environment['ADDRESS_CACHE'] ?? DEFAULT_ADDRESS_CACHE
});
