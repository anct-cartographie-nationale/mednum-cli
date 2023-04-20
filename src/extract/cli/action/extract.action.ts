/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
import { ExtractOptions } from '../extract-options';
import { SchemaStructureDataInclusionWithServices } from '../../../data-inclusion/main';
import axios, { AxiosResponse } from 'axios';

const filterDataByDepartement = (
  lieuxMediationNumerique: SchemaStructureDataInclusionWithServices[],
  departements: string
): SchemaStructureDataInclusionWithServices[] =>
  lieuxMediationNumerique.filter((lieu: SchemaStructureDataInclusionWithServices): boolean => {
    const arrayDepartements: string[] = departements.split(',');
    const codePostalDepartement: string = lieu.code_postal.slice(0, arrayDepartements[0].length);
    return arrayDepartements.includes(codePostalDepartement);
  });

export const extractAction = async (extractOptions: ExtractOptions): Promise<void> => {
  const fetchLieuxFromDataInclusion: AxiosResponse = await axios.get(
    'https://www.data.gouv.fr/fr/datasets/r/b5e5a1e1-122e-4f87-b6cf-d1ce342671be'
  );
  const filteredLieuxForExtraction: SchemaStructureDataInclusionWithServices[] = filterDataByDepartement(
    fetchLieuxFromDataInclusion.data,
    extractOptions.departements
  );
  fs.writeFileSync(
    `./assets/input/${extractOptions.sourceName}/${extractOptions.sourceName}.json`,
    JSON.stringify(filteredLieuxForExtraction),
    'utf8'
  );
};
