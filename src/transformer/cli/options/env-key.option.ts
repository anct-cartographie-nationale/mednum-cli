import { Command } from 'commander';

export const envKeyOption = (program: Command): Command =>
  program.option('-a, --api-env-key <api-env-key>', "Nom de la variable d'environnement permettant de récupérer la clé d'API");
