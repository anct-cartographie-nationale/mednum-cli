import { Command } from 'commander';

export const configFileOption = (program: Command): Command =>
  program.option(
    '-c, --config-file <config-file>',
    'Le chemin vers le fichier de configuration contenant les instructions de transformation'
  );
