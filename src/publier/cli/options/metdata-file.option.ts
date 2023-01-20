import { Command } from 'commander';

export const metadataFileOption = (program: Command): Command =>
  program.option(
    '-m, --data-gouv-metadata-file <metadata-file>',
    'Le chemin vers le fichier de métadonnées permet de savoir quel est le jeu de données à publier ainsi que les ressources qui le composent'
  );
