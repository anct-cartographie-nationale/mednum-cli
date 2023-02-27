import { Command } from 'commander';

export const encodingOption = (program: Command): Command =>
  program.option('-e, --encoding <encoding>', "L'encodage des données");
