import { Command } from 'commander';

export const inputFilesPatternOption = (program: Command): Command =>
  program.option(
    '-i, --input-files-pattern <input-files-pattern>',
    'Le masque correspondant au chemins des fichiers json ou csv à fusionner'
  );
