import { Command } from 'commander';

export const apiKeyOption = (program: Command): Command =>
  program.option(
    '-k, --cartographie-nationale-api-key <cartographie-nationale-api-key>',
    "Lorsque la clé d'API dela cartographie nationale est fournie, les hash des fichiers transformés sont sauvegardés par API"
  );
