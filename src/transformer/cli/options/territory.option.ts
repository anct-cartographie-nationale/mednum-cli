import { Command } from 'commander';

export const territoryOption = (program: Command): Command =>
  program.option('-t, --territory <territory>', 'Le nom du territoire couvert par les données');
