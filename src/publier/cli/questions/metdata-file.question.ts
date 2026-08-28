import type { Question } from 'inquirer';
import type { PublierOptions } from '../publier-options';

enum DataGouvMetadataFileValidationMessages {
  REQUIRED = 'Le fichier de métadonnées est obligatoire'
}

const validateDataGouvMetadataFile = (input?: unknown): DataGouvMetadataFileValidationMessages | true =>
  typeof input !== 'string' || input.trim() === '' ? DataGouvMetadataFileValidationMessages.REQUIRED : true;

export const metadataFileQuestion = (mednumImportProperties: PublierOptions): Question & { name: keyof PublierOptions } => ({
  message: 'Chemin du fichier qui contient les métadonnées du jeu de données à publier',
  name: 'dataGouvMetadataFile',
  validate: validateDataGouvMetadataFile,
  when: (): boolean => validateDataGouvMetadataFile(mednumImportProperties.dataGouvMetadataFile) !== true,
  filter: (answer: string): string => answer.trim()
});
