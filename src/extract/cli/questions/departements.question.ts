import { InputQuestion } from 'inquirer';
import { ExtractOptions } from '../extract-options';

enum DepartementValidationMessages {
  REQUIRED = 'Au moins un département est obligatoire pour situer la zone géographique'
}

const validateDepartements = (input?: string): DepartementValidationMessages | true =>
  input == null || input.trim() === '' ? DepartementValidationMessages.REQUIRED : true;

export const departementsQuestion = (
  mednumImportProperties: ExtractOptions
): InputQuestion & { name: keyof ExtractOptions } => ({
  message: 'Departement pour filtrer les données sur une zone spécifique',
  name: 'departements',
  validate: validateDepartements,
  when: (): boolean => validateDepartements(mednumImportProperties.departements) !== true,
  filter: (answer: string): string => answer.trim()
});
