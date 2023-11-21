import { InputQuestion } from 'inquirer';
import { DedupliquerOptions } from '../dedupliquer-options';

enum TerritoryValidationMessages {
  REQUIRED = 'Le nom du territoire couvert par les données est obligatoire'
}

const validateTerritory = (input?: string): TerritoryValidationMessages | true =>
  input == null || input.trim() === '' ? TerritoryValidationMessages.REQUIRED : true;

export const territoryQuestion = (
  mednumImportProperties: DedupliquerOptions
): InputQuestion & { name: keyof DedupliquerOptions } => ({
  message: 'Nom du territoire couvert par les données à dédupliquer',
  name: 'territory',
  validate: validateTerritory,
  when: (): boolean => validateTerritory(mednumImportProperties.territory) !== true,
  filter: (answer: string): string => answer.trim()
});
