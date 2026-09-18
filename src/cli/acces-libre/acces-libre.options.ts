import type { Command } from 'commander';
import type { Question } from 'inquirer';

export type AccesLibreOptions = {
  outputFile: string;
};

const OUTPUT_FILE_REQUIRED = 'Le fichier de sortie est obligatoire';

const validateOutputFile = (input?: unknown): string | true =>
  typeof input !== 'string' || input.trim() === '' ? OUTPUT_FILE_REQUIRED : true;

const outputFileOption = (program: Command): Command =>
  program.option('-o, --output-file <output-file>', "Le chemin du fichier JSON qui recevra les fiches d'Accès Libre");

export const ACCES_LIBRE_OPTIONS: ((program: Command) => Command)[] = [outputFileOption];

export const accesLibreOptionsQuestions = (accesLibreOptions: AccesLibreOptions): Question[] => [
  {
    name: 'outputFile',
    message: "Chemin du fichier JSON qui recevra les fiches d'Accès Libre :",
    validate: validateOutputFile,
    when: (): boolean => validateOutputFile(accesLibreOptions.outputFile) !== true
  }
];

export const toAccesLibreOptions = (environment: NodeJS.ProcessEnv): AccesLibreOptions => ({
  outputFile: environment['ACCES_LIBRE_OUTPUT_FILE'] ?? ''
});
