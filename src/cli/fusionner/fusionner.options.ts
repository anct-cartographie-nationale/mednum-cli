import type { Command } from 'commander';
import type { Question } from 'inquirer';

export type FusionnerOptions = {
  outputDirectory: string;
  inputFilesPattern: string;
};

const INPUT_FILES_PATTERN_REQUIRED = 'Le masque des chemins à fusionner est obligatoire';
const OUTPUT_DIRECTORY_REQUIRED = 'Le dossier de sortie est obligatoire';

const validateNotEmpty =
  (message: string) =>
  (input?: unknown): string | true =>
    typeof input !== 'string' || input.trim() === '' ? message : true;

const validateInputFilesPattern = validateNotEmpty(INPUT_FILES_PATTERN_REQUIRED);
const validateOutputDirectory = validateNotEmpty(OUTPUT_DIRECTORY_REQUIRED);

const inputFilesPatternOption = (program: Command): Command =>
  program.option(
    '-i, --input-files-pattern <input-files-pattern>',
    'Le masque correspondant au chemins des fichiers json ou csv à fusionner'
  );

const outputDirectoryOption = (program: Command): Command =>
  program.option('-o, --output-directory <output-directory>', 'Le dossier dans lequel écrire les fichiers fusionnés');

export const FUSIONNER_OPTIONS: ((program: Command) => Command)[] = [inputFilesPatternOption, outputDirectoryOption];

export const fusionnerOptionsQuestions = (fusionnerOptions: FusionnerOptions): Question[] => [
  {
    message: 'Masque des chemins à fusionner',
    name: 'inputFilesPattern',
    validate: validateInputFilesPattern,
    when: (): boolean => validateInputFilesPattern(fusionnerOptions.inputFilesPattern) !== true,
    filter: (answer: string): string => answer.trim()
  },
  {
    message: 'Chemin du dossier qui va recevoir les fichiers fusionnés',
    name: 'outputDirectory',
    validate: validateOutputDirectory,
    when: (): boolean => validateOutputDirectory(fusionnerOptions.outputDirectory) !== true,
    filter: (answer: string): string => answer.trim()
  }
];
