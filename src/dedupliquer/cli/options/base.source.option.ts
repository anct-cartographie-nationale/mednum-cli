import { Command } from 'commander';

export const baseSourceOption = (program: Command): Command =>
  program.option('-b, --base-source <base-source>', 'La source de données de base dans laquelle identifier les doublons');
