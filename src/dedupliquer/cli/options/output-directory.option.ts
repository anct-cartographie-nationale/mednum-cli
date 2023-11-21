import { Command } from 'commander';

export const outputDirectoryOption = (program: Command): Command =>
  program.option('-o, --output-directory <output-directory>', 'Le dossier dans lequel écrire les fichiers dédupliqués');
