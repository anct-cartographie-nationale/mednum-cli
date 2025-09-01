import { Command } from 'commander';

export const nestedOption = (program: Command): Command =>
  program.option('-nt, --nested', "Ne pas aplatir, désactivation de l'option par défaut de flatten");
