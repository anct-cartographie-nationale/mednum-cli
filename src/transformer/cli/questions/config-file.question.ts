import type { Question } from 'inquirer';
import type { TransformerOptions } from '../transformer-options';

enum ConfigFileValidationMessages {
  REQUIRED = 'Le fichier de configuration est obligatoire'
}

const validateConfigFile = (input?: unknown): ConfigFileValidationMessages | true =>
  typeof input !== 'string' || input.trim() === '' ? ConfigFileValidationMessages.REQUIRED : true;

export const configFileQuestion = (
  mednumImportProperties: TransformerOptions
): Question & { name: keyof TransformerOptions } => ({
  message: 'Chemin du fichier de configuration qui contient les instructions de transformation',
  name: 'configFile',
  validate: validateConfigFile,
  when: (): boolean => validateConfigFile(mednumImportProperties.configFile) !== true,
  filter: (answer: string): string => answer.trim()
});
