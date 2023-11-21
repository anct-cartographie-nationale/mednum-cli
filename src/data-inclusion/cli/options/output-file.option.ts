import { Command } from 'commander';

export const outputFileOption = (program: Command): Command =>
  program.option(
    '-o, --output-file <output-file>',
    'Le chemin du fichier se sortie est utiliser pour créer le fichier qui va recevoir les données format JSON'
  );
