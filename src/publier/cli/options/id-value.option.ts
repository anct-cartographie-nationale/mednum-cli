import { Command } from 'commander';

export const idValueOption = (program: Command): Command =>
  program.option(
    '-v, --data-gouv-id-value <id-value>',
    "La valeur de l'id est nécessaire pour rattacher les données à publier à un utilisateur ou à une organisation existant sur data.gouv"
  );
