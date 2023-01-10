import { Command } from 'commander';

export const sourceFileOption = (program: Command): Command =>
  program.option(
    '-s, --source-file <source-file>',
    'Le chemin vers le fichier source original contenant les données à transformer selon le schéma des lieux de médiation numérique'
  );
