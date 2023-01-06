import { Command } from 'commander';

import { apiKeyOption, apiUrlOption, idTypeOption, idValueOption, metadataFileOption } from './options';
import { apiKeyQuestion, idTypeQuestion, metadataFileQuestion, valueQuestion } from './questions';
import { Question } from 'inquirer';

export type PublierOptions = {
  dataGouvApiKey: string;
  dataGouvApiUrl: string;
  dataGouvIdValue: string;
  dataGouvIdType: string;
  dataGouvMetadataFile: string;
};

export const PUBLIER_OPTIONS: ((program: Command) => Command)[] = [
  metadataFileOption,
  idValueOption,
  idTypeOption,
  apiKeyOption,
  apiUrlOption
];

export const publierOptionsQuestions = (publierOptions: PublierOptions): Question[] => [
  apiKeyQuestion(publierOptions),
  idTypeQuestion(publierOptions),
  valueQuestion(publierOptions),
  metadataFileQuestion(publierOptions)
];

const toDataGouvIdType = (environmentDataGouvIdType?: string): string | undefined => {
  if (environmentDataGouvIdType === 'organization') return "id d'organisation";
  if (environmentDataGouvIdType === 'owner') return "id d'utilisateur";
  return undefined;
};

const dataGouvApiUrlIfAny = (dataGouvApiUrl?: string): { dataGouvApiUrl?: string } =>
  dataGouvApiUrl == null ? {} : { dataGouvApiUrl };

const dataGouvApiKeyIfAny = (dataGouvApiKey?: string): { dataGouvApiKey?: string } =>
  dataGouvApiKey == null ? {} : { dataGouvApiKey };

const dataGouvIdValueIfAny = (dataGouvIdValue?: string): { dataGouvIdValue?: string } =>
  dataGouvIdValue == null ? {} : { dataGouvIdValue };

const dataGouvIdTypeIfAny = (dataGouvIdType?: string): { dataGouvIdType?: string } =>
  dataGouvIdType == null ? {} : { dataGouvIdType };

export const toPublierOptions = (environment: Record<string, string | undefined>): Partial<PublierOptions> => ({
  ...dataGouvApiUrlIfAny(environment['DATA_GOUV_API_URL']),
  ...dataGouvApiKeyIfAny(environment['DATA_GOUV_API_KEY']),
  ...dataGouvIdValueIfAny(environment['DATA_GOUV_REFERENCE_ID']),
  ...dataGouvIdTypeIfAny(toDataGouvIdType(environment['DATA_GOUV_REFERENCE_TYPE']))
});
