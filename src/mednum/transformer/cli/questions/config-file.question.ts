import { InputQuestion } from 'inquirer';
import { TransformerOptions } from '../transformer-options';

enum ConfigFileValidationMessages {
  REQUIRED = 'Le fichier de configuration est obligatoire'
}

const validateConfigFile = (input?: string): ConfigFileValidationMessages | true =>
  input == null || input.trim() === '' ? ConfigFileValidationMessages.REQUIRED : true;

export const configFileQuestion = (
  mednumImportProperties: TransformerOptions
): InputQuestion & { name: keyof TransformerOptions } => ({
  message: 'Chemin du fichier de configuration qui contient les instructions de transformation',
  name: 'configFile',
  validate: validateConfigFile,
  when: (): boolean => validateConfigFile(mednumImportProperties.configFile) !== true,
  filter: (answer: string): string => answer.trim()
});
