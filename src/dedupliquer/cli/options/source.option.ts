import { Command } from 'commander';

export const sourceOption = (program: Command): Command =>
  program.option('-s, --source <source>', 'La source de données à dédupliquer');
