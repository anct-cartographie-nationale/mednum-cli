import { Command } from 'commander';

export const apiUrlOption = (program: Command): Command =>
  program.option(
    '-u, --data-gouv-api-url <api-url>',
    "L'URL de l'API data.gouv utilisé pour la publication. La valeur par défaut est l'URL de production"
  );
