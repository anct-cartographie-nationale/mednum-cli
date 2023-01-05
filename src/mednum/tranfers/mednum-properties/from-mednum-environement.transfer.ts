import { MednumProperties } from '../../cli';

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

export const fromMednumEnvironment = (environment: Record<string, string | undefined>): Partial<MednumProperties> => ({
  ...dataGouvApiUrlIfAny(environment['DATA_GOUV_API_URL']),
  ...dataGouvApiKeyIfAny(environment['DATA_GOUV_API_KEY']),
  ...dataGouvIdValueIfAny(environment['DATA_GOUV_REFERENCE_ID']),
  ...dataGouvIdTypeIfAny(toDataGouvIdType(environment['DATA_GOUV_REFERENCE_TYPE']))
});
