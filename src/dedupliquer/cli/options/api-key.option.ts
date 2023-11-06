import { Command } from 'commander';

export const apiKeyOption = (program: Command): Command =>
  program.option(
    '-k, --cartographie-nationale-api-key <api-key>',
    "Lorsque la clé d'API dela cartographie nationale est fournie, les groupes de fusion sont sauvegardés par API"
  );
