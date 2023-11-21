import { Command } from 'commander';

export const allowInternalOption = (program: Command): Command =>
  program.option('-i, --allow-internal <allow-internal>', 'Autorise les fusion interne à une même source de données');
