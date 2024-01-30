import { Command } from 'commander';

export const duplicatesOption = (program: Command): Command =>
  program.option('-c, --duplicates <duplicates>', 'Récupère également les doublons s(true par défaut)');
