import { InputQuestion } from 'inquirer';
import { PublierOptions } from '../publier-options';

enum DataGouvZoneValidationMessages {
  REQUIRED = 'La couverture spatiale est obligatoire'
}

const validateDataGouvZone = (input?: string): DataGouvZoneValidationMessages | true =>
  input == null || input.trim() === '' ? DataGouvZoneValidationMessages.REQUIRED : true;

export const zoneQuestion = (publierOptions: Partial<PublierOptions>): InputQuestion & { name: keyof PublierOptions } => ({
  message: 'La zone couverte par le jeu de données, exemple pour Maine-et-Loire : fr:departement:49',
  name: 'dataGouvZone',
  validate: validateDataGouvZone,
  when: (): boolean => validateDataGouvZone(publierOptions.dataGouvZone) !== true,
  filter: (answer: string): string => answer.trim()
});
