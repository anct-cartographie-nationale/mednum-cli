import type { Command } from 'commander';

export const filterOption = (program: Command): Command =>
  program.option(
    '-f, --filter <filter>',
    'Le filtre permet de ne sélectionner que les lignes du fichier data.inclusion dont la source correspond au filtre.'
  );
