/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
import axios, { AxiosResponse } from 'axios';
import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { ExtractOptions } from '../extract-options';

const filterDataByDepartement = (
  lieuxMediationNumerique: SchemaLieuMediationNumerique[],
  departements: string
): SchemaLieuMediationNumerique[] =>
  lieuxMediationNumerique.filter((lieu: SchemaLieuMediationNumerique): boolean => {
    const arrayDepartements: string[] = departements.split(',');
    const codePostalDepartement: string = lieu.code_postal.slice(0, arrayDepartements[0]?.length);
    return arrayDepartements.includes(codePostalDepartement);
  });

export const extractAction = async (extractOptions: ExtractOptions): Promise<void> => {
  const fetchLieuxFromDataInclusion: AxiosResponse = await axios.get(
    'https://www.data.gouv.fr/fr/datasets/r/b5e5a1e1-122e-4f87-b6cf-d1ce342671be'
  );
  const filteredLieuxForExtraction: SchemaLieuMediationNumerique[] = filterDataByDepartement(
    fetchLieuxFromDataInclusion.data,
    extractOptions.departements
  );
  fs.writeFileSync(
    `./assets/input/${extractOptions.sourceName}/${extractOptions.sourceName}.json`,
    JSON.stringify(filteredLieuxForExtraction),
    'utf8'
  );
};
