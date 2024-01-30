import axios from 'axios';
import {
  fromSchemaLieuDeMediationNumerique,
  LieuMediationNumerique,
  SchemaLieuMediationNumerique
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { saveOutputsInFiles } from '../../../transformer/data';
import { ExtractOptions } from '../extract-options';
import { buildApiUrl } from './build-api-url';

export const extractAction = async (extractOptions: ExtractOptions): Promise<void> => {
  const lieuxToPublish: LieuMediationNumerique[] = (
    await axios.get<SchemaLieuMediationNumerique[]>(buildApiUrl(extractOptions))
  ).data.map(fromSchemaLieuDeMediationNumerique);

  await saveOutputsInFiles(extractOptions)(lieuxToPublish, extractOptions.duplicates ? undefined : 'sans-doublons');
};
