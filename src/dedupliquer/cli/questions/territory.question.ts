import type { Question } from 'inquirer';
import type { DedupliquerOptions } from '../dedupliquer-options';

enum TerritoryValidationMessages {
  REQUIRED = 'Le nom du territoire couvert par les données est obligatoire'
}

const validateTerritory = (input?: unknown): TerritoryValidationMessages | true =>
  typeof input !== 'string' || input.trim() === '' ? TerritoryValidationMessages.REQUIRED : true;

export const territoryQuestion = (
  mednumImportProperties: DedupliquerOptions
): Question & { name: keyof DedupliquerOptions } => ({
  message: 'Nom du territoire couvert par les données à dédupliquer',
  name: 'territory',
  validate: validateTerritory,
  when: (): boolean => validateTerritory(mednumImportProperties.territory) !== true,
  filter: (answer: string): string => answer.trim()
});
