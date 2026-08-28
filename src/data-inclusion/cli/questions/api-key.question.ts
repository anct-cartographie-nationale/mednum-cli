import type { Question } from 'inquirer';
import type { DataInclusionOptions } from '../data-inclusion-options';

enum DataInclusionApiKeyValidationMessages {
  REQUIRED = "La clé d'API de Data Inclusion est obligatoire"
}

const validateDataInclusionApiKey = (input?: unknown): DataInclusionApiKeyValidationMessages | true =>
  typeof input !== 'string' || input.trim() === '' ? DataInclusionApiKeyValidationMessages.REQUIRED : true;

export const apiKeyQuestion = (
  dataInclusionOptions: Partial<DataInclusionOptions>
): Question & { name: keyof DataInclusionOptions } => ({
  message: "Clé d'API Data Inclusion",
  name: 'dataInclusionApiKey',
  type: 'input',
  validate: validateDataInclusionApiKey,
  when: (): boolean => validateDataInclusionApiKey(dataInclusionOptions.dataInclusionApiKey) !== true,
  filter: (answer: string): string => answer.trim()
});
