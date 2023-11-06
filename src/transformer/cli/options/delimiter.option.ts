import { Command } from 'commander';

export const delimiterOption = (program: Command): Command =>
  program.option('-d, --delimiter <delimiter>', "Le délimiteur entre les données d'un fichier csv");
