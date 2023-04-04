/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;
import { ExtractOptions } from '../extract-options';
import { SchemaStructureDataInclusionWithServices } from '../../../data-inclusion/main';
import { createFolderIfNotExist } from '../../../transformer/output/write-output-files';

const filterDataByDepartement = (
  lieuxMediationNumerique: SchemaStructureDataInclusionWithServices[],
  departements: string
): SchemaStructureDataInclusionWithServices[] =>
  lieuxMediationNumerique.filter((lieu: SchemaStructureDataInclusionWithServices): boolean => {
    const arrayDepartements: string[] = departements.split(',');
    const codePostalDepartement: string = lieu.code_postal.slice(0, 2);
    return arrayDepartements.includes(codePostalDepartement);
  });

export const extractAction = (extractOptions: ExtractOptions): void => {
  const filePath: string = './assets/input/data-inclusion/data-inclusion.json';
  fs.readFile(filePath, 'utf8', (_: ErrnoException | null, data: string): void => {
    const allLieuxFromDataInclusion: SchemaStructureDataInclusionWithServices[] = JSON.parse(data);
    const filteredLieuxForExtraction: SchemaStructureDataInclusionWithServices[] = filterDataByDepartement(
      allLieuxFromDataInclusion,
      extractOptions.departements
    );
    fs.writeFileSync(
      `${createFolderIfNotExist(extractOptions.outputDirectory)}/${extractOptions.sourceName}.json`,
      JSON.stringify(filteredLieuxForExtraction),
      'utf8'
    );
  });
};
