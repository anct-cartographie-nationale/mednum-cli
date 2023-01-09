import { Command } from 'commander';

export const zoneOption = (program: Command): Command =>
  program.option(
    '-z, --data-gouv-zone <zone>',
    'La zone est nécessaire pour indiquer quel est le territoire couvert par le jeu de données'
  );
