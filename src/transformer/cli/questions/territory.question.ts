import type { Question } from 'inquirer';
import type { TransformerOptions } from '../transformer-options';

enum TerritoryValidationMessages {
  REQUIRED = 'Le nom du territoire couvert par les données est obligatoire'
}

const validateTerritory = (input?: unknown): TerritoryValidationMessages | true =>
  typeof input !== 'string' || input.trim() === '' ? TerritoryValidationMessages.REQUIRED : true;

export const territoryQuestion = (
  mednumImportProperties: TransformerOptions
): Question & { name: keyof TransformerOptions } => ({
  message: 'Nom du territoire couvert par les données à transformer',
  name: 'territory',
  validate: validateTerritory,
  when: (): boolean => validateTerritory(mednumImportProperties.territory) !== true,
  filter: (answer: string): string => answer.trim()
});
