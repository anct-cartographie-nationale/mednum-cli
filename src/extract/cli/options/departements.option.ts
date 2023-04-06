import { Command } from 'commander';

export const departementsOption = (program: Command): Command =>
  program.option('-d, --departements <departements>', "Les départements pour la creation d'une zone géographique");
