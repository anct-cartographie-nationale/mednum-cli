import { Command } from 'commander';

export const apiKeyOption = (program: Command): Command =>
  program.option(
    '-k, --data-gouv-api-key <api-key>',
    "Une clé d'API data.gouv est nécessaire pour que l'outil ait les droits nécessaires à la publication des données en votre nom en utilisant l'API (https://doc.data.gouv.fr/api/intro/#autorisations)"
  );
