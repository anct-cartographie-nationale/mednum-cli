import { Command } from 'commander';

export const idTypeOption = (program: Command): Command =>
  program.option(
    '-t, --data-gouv-id-type <id-type>',
    "Le type de l'id est nécessaire savoir s'il faut rattacher les données à publier à un utilisateur ou à une organisation"
  );
