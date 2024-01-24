import axios from 'axios';
import {
  fromSchemaLieuDeMediationNumerique,
  LieuMediationNumerique,
  SchemaLieuMediationNumerique
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { saveOutputsInFiles } from '../../../transformer/data';
import { ExtractOptions } from '../extract-options';

export const extractAction = async (extractOptions: ExtractOptions): Promise<void> => {
  const lieuxToPublish: LieuMediationNumerique[] = (
    await axios.get<SchemaLieuMediationNumerique[]>(
      `${extractOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique/with-duplicates?adresse[beginsWith][code_insee]=${extractOptions.departements}&and[mergedIds][exists]=false`
    )
  ).data.map(fromSchemaLieuDeMediationNumerique);

  await saveOutputsInFiles(extractOptions)(lieuxToPublish);
};
