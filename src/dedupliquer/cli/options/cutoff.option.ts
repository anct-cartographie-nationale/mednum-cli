import { Command } from 'commander';

export const cutoffOption = (program: Command): Command =>
  program.option(
    '-c, --cutoff <cutoff>',
    'Le seuil en pourcent au-delà duquel deux données sont considérées comme étant des doublons'
  );
