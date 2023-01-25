import { Command } from 'commander';

export const sourceOption = (program: Command): Command =>
  program.option(
    '-s, --source <source>',
    'La source originale qui contient les données à transformer selon le schéma des lieux de médiation numérique. La source peut être un fichier ou une URL, les données doivent être au format CSV ou JSON'
  );
