import {
  LieuMediationNumerique,
  SchemaLieuMediationNumerique,
  toSchemaLieuMediationNumerique
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import axios, { AxiosResponse } from 'axios';
import { authHeader, headers } from '../../../common';
import { TransformerOptions } from '../../cli/transformer-options';

const onlyDefined = <T>(nullable?: T): nullable is T => nullable != null;

export const saveOutputsWithLieuxInclusionNumeriqueApi =
  (transformerOptions: TransformerOptions) =>
  async (lieuxMediationNumerique: LieuMediationNumerique[]): Promise<void> => {
    transformerOptions.cartographieNationaleApiKey != null &&
      (await axios.patch<unknown, AxiosResponse, SchemaLieuMediationNumerique[]>(
        `${transformerOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique`,
        lieuxMediationNumerique
          .filter(onlyDefined)
          .map(
            (lieuMediationNumerique: LieuMediationNumerique): SchemaLieuMediationNumerique =>
              toSchemaLieuMediationNumerique(lieuMediationNumerique)
          ),
        headers(authHeader(transformerOptions.cartographieNationaleApiKey))
      ));
  };
