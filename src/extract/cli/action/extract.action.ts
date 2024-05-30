import {
  fromSchemaLieuDeMediationNumerique,
  LieuMediationNumerique,
  SchemaLieuMediationNumerique
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { paginate } from '../../../common';
import { saveOutputsInFiles } from '../../../transformer/data';
import { ExtractOptions } from '../extract-options';
import { extractQueryString } from './build-api-url';

export const extractAction = async (extractOptions: ExtractOptions): Promise<void> => {
  const lieuxToPublish: LieuMediationNumerique[] = (
    await paginate<SchemaLieuMediationNumerique>(
      `${extractOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique/with-duplicates?page[number]=0&page[size]=10000`,
      extractQueryString(extractOptions)
    )
  ).map(fromSchemaLieuDeMediationNumerique);

  await saveOutputsInFiles(extractOptions)(lieuxToPublish, extractOptions.duplicates ? 'avec-doublons' : undefined);
};
