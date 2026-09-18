import type { Command } from 'commander';
import type { Question } from 'inquirer';

export type AnnuaireOptions = {
  inputFilesPattern: string;
  outputFile: string;
};

const MOTIF_REQUIS = "Le motif des fichiers d'entrée est obligatoire";

const FICHIER_REQUIS = 'Le fichier de sortie est obligatoire';

const nonVide =
  (message: string) =>
  (valeur?: unknown): string | true =>
    typeof valeur !== 'string' || valeur.trim() === '' ? message : true;

const validerMotif = nonVide(MOTIF_REQUIS);

const validerFichier = nonVide(FICHIER_REQUIS);

const inputFilesPatternOption = (program: Command): Command =>
  program.option('-i, --input-files-pattern <input-files-pattern>', 'Le motif des fichiers de lieux déjà transformés');

const outputFileOption = (program: Command): Command =>
  program.option('-o, --output-file <output-file>', 'Le fichier JSON qui recevra les établissements retenus');

export const ANNUAIRE_OPTIONS: ((program: Command) => Command)[] = [inputFilesPatternOption, outputFileOption];

export const annuaireOptionsQuestions = (annuaireOptions: AnnuaireOptions): Question[] => [
  {
    name: 'inputFilesPattern',
    message: 'Motif des fichiers de lieux déjà transformés :',
    validate: validerMotif,
    when: (): boolean => validerMotif(annuaireOptions.inputFilesPattern) !== true
  },
  {
    name: 'outputFile',
    message: 'Fichier JSON qui recevra les établissements retenus :',
    validate: validerFichier,
    when: (): boolean => validerFichier(annuaireOptions.outputFile) !== true
  }
];

export const toAnnuaireOptions = (environment: NodeJS.ProcessEnv): Partial<AnnuaireOptions> => ({
  outputFile: environment['ANNUAIRE'] ?? './assets/input/annuaire-entreprises.json'
});
