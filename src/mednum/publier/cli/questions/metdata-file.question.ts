import { InputQuestion } from 'inquirer';
import { PublierOptions } from '../publier-options';

enum DataGouvMetadataFileValidationMessages {
  REQUIRED = 'Le fichier de métadonnées est obligatoire'
}

const validateDataGouvMetadataFile = (input?: string): DataGouvMetadataFileValidationMessages | true =>
  input == null || input.trim() === '' ? DataGouvMetadataFileValidationMessages.REQUIRED : true;

export const metadataFileQuestion = (
  mednumImportProperties: PublierOptions
): InputQuestion & { name: keyof PublierOptions } => ({
  message: 'Chemin du fichier qui contient les métadonnées du jeu de données à publier',
  name: 'dataGouvMetadataFile',
  validate: validateDataGouvMetadataFile,
  when: (): boolean => validateDataGouvMetadataFile(mednumImportProperties.dataGouvMetadataFile) !== true,
  filter: (answer: string): string => answer.trim()
});
