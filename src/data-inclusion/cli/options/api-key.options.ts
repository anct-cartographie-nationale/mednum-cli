import { Command } from 'commander';

export const apiKeyOption = (program: Command): Command =>
  program.option(
    '-k, --data-inclusion-api-key <api-key>',
    "Une clé d'API data inclusion est nécessaire pour que l'outil ait les droits nécessaires à la récupération des données en votre nom en utilisant l'API (https://www.data.inclusion.beta.gouv.fr/api/lapi-data-inclusion)"
  );
