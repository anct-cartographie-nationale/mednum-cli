import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { ExtractOptions } from '../extract-options';
import * as fs from 'fs';
import { SchemaStructureDataInclusionWithServices } from '../../../data-inclusion/main';
import { createFolderIfNotExist } from '../../../transformer/output/write-output-files';

const filterDataByDepartement = (
  lieuxMediationNumerique: SchemaStructureDataInclusionWithServices[],
  departements: string
): SchemaStructureDataInclusionWithServices[] => {
  return lieuxMediationNumerique.filter((lieu: SchemaStructureDataInclusionWithServices) => {
    const arrayDepartements = departements.split(',');
    const codePostalDepartement = lieu.code_postal.slice(0, 2);
    return arrayDepartements.includes(codePostalDepartement);
  });
};

export const extractAction = (extractOptions: ExtractOptions): void => {
  const filePath = './assets/input/data-inclusion/data-inclusion.json';
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      throw err;
    }
    const fullData: SchemaStructureDataInclusionWithServices[] = JSON.parse(data);
    const filteredLieux: SchemaStructureDataInclusionWithServices[] = filterDataByDepartement(
      fullData,
      extractOptions.departements
    );
    fs.writeFileSync(
      `${createFolderIfNotExist(extractOptions.outputDirectory)}/${extractOptions.sourceName}.json`,
      JSON.stringify(filteredLieux),
      'utf8'
    );
  });
};
