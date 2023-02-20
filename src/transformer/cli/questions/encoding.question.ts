import { InputQuestion } from 'inquirer';
import { TransformerOptions } from '../transformer-options';

enum EncodingValidationMessages {
  REQUIRED = "Le type d'encodage n'est pas valide"
}

const encodingIsValide = (encoding: string) => {
  switch (encoding.toLocaleLowerCase()) {
    case 'ascii':
    case 'utf-8':
    case 'utf-16':
    case 'utf-32':
    case 'iso-8859-1':
    case 'windows-1252':
    case 'win-1252':
    case '':
      return true;
    default:
      return false;
  }
};

const validateEncoding = (input?: string): EncodingValidationMessages | true =>
  encodingIsValide(input ?? '') || EncodingValidationMessages.REQUIRED;

export const encodingQuestion = (
  mednumImportProperties: TransformerOptions
): InputQuestion & { name: keyof TransformerOptions } => ({
  message: "Le type d'encodage des données",
  name: 'encoding',
  validate: validateEncoding,
  when: (): boolean => validateEncoding(mednumImportProperties.encoding) !== true,
  filter: (answer: string): string => answer.trim()
});
