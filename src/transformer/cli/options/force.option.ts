import { Command } from 'commander';

export const forceOption = (program: Command): Command =>
  program.option('-f, --force', 'Évite la vérification du hash des données déjà transformées');
