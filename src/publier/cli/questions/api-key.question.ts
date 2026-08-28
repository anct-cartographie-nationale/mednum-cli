import type { Question } from 'inquirer';
import type { PublierOptions } from '../publier-options';

enum DataGouvApiKeyValidationMessages {
  REQUIRED = "La clé d'API Data.gouv est obligatoire"
}

const validateDataGouvApiKey = (input?: unknown): DataGouvApiKeyValidationMessages | true =>
  typeof input !== 'string' || input.trim() === '' ? DataGouvApiKeyValidationMessages.REQUIRED : true;

export const apiKeyQuestion = (publierOptions: Partial<PublierOptions>): Question & { name: keyof PublierOptions } => ({
  message: "Clé d'API Data.gouv",
  name: 'dataGouvApiKey',
  type: 'input',
  validate: validateDataGouvApiKey,
  when: (): boolean => validateDataGouvApiKey(publierOptions.dataGouvApiKey) !== true,
  filter: (answer: string): string => answer.trim()
});
