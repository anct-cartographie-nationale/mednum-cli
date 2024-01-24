import { InputQuestion } from 'inquirer';
import { ExtractOptions } from '../extract-options';

enum TerritoryValidationMessages {
  REQUIRED = 'Le nom du territoire couvert par les données est obligatoire'
}

const validateTerritory = (input?: string): TerritoryValidationMessages | true =>
  input == null || input.trim() === '' ? TerritoryValidationMessages.REQUIRED : true;

export const territoryQuestion = (mednumImportProperties: ExtractOptions): InputQuestion & { name: keyof ExtractOptions } => ({
  message: 'Nom du territoire couvert par les données à extraire',
  name: 'territory',
  validate: validateTerritory,
  when: (): boolean => validateTerritory(mednumImportProperties.territory) !== true,
  filter: (answer: string): string => answer.trim()
});
