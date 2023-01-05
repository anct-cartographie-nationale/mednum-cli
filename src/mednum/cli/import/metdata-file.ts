import { Command } from 'commander';
import { InputQuestion } from 'inquirer';
import { MednumProperties } from '../mednum-properties';

enum DataGouvMetadataFileValidationMessages {
  REQUIRED = 'Le fichier de métadonnées est obligatoire'
}

const validateDataGouvMetadataFile = (input?: string): DataGouvMetadataFileValidationMessages | true =>
  input == null || input.trim() === '' ? DataGouvMetadataFileValidationMessages.REQUIRED : true;

export const dataGouvMetadataFileQuestion = (
  mednumImportProperties: MednumProperties
): InputQuestion & { name: keyof MednumProperties } => ({
  message: 'Chemin du fichier qui contient les métadonnées du jeu de données à publier',
  name: 'dataGouvMetadataFile',
  validate: validateDataGouvMetadataFile,
  when: (): boolean => validateDataGouvMetadataFile(mednumImportProperties.dataGouvMetadataFile) !== true,
  filter: (answer: string): string => answer.trim()
});

export const addMetadataFileOption = (program: Command): Command =>
  program.option(
    '-m, --data-gouv-metadata-file <metadata-file>',
    'Le chemin vers le fichier de métadonnées permet de savoir quel est le jeu de données à publier ainsi que les ressources qui le composent'
  );
