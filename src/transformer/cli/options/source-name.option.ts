import { Command } from 'commander';

export const sourceNameOption = (program: Command): Command =>
  program.option('-n, --source-name <source-name>', "Le nom de l'entité source à l'origine de la collecte des données");
