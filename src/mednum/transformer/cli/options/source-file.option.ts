import { Command } from 'commander';

export const sourceFileOption = (program: Command): Command =>
  program.option(
    '-s, --source-file <source>',
    'La source originale qui contient les données à transformer selon le schéma des lieux de médiation numérique. La source peut être un fichier ou une URL, les données doivent être au format CSV ou JSON'
  );
