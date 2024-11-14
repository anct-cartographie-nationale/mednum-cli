/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as path from 'path';
import { glob } from 'glob';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { FusionnerOptions } from '../fusionner-options';

const hasMixedFormats =
  (files: string[]) =>
  (fileFormat: string): boolean =>
    files.some((file: string): boolean => path.extname(file).toLowerCase() !== fileFormat);

const getFileFormat = (files: string[] & [string]): string => path.extname(files[0]).toLowerCase();

const isAllowedFileFormat =
  (fileFormat: string) =>
  (...allowedFileFormats: `.${string}`[]): boolean =>
    allowedFileFormats.includes(fileFormat as `.${string}`);

const toCsvToMerge = (file: string): unknown[] => parse(fs.readFileSync(file, 'utf-8'), { columns: true });

const mergeCsvFiles = (files: string[], outputDirectory: string): void => {
  const outputFilePath: string = path.join(outputDirectory, 'merged_output.csv');
  fs.writeFileSync(outputFilePath, stringify(files.flatMap(toCsvToMerge), { header: true }), 'utf-8');
  /* eslint-disable-next-line no-console */
  console.log(`Les fichiers CSV fusionnés ont été sauvegardés dans ${outputFilePath}`);
};

const toJsonToMerge = (file: string): unknown[] => JSON.parse(fs.readFileSync(file, 'utf-8'));

const mergeJsonFiles = (files: string[], outputDirectory: string): void => {
  const outputFilePath: string = path.join(outputDirectory, 'merged_output.json');
  fs.writeFileSync(outputFilePath, JSON.stringify(files.map(toJsonToMerge), null, 2), 'utf-8');
  /* eslint-disable-next-line no-console */
  console.log(`Les fichiers JSON fusionnés ont été sauvegardés dans ${outputFilePath}`);
};

const atLeastOneItemIn = (files: string[]): files is string[] & [string] => files.length !== 0;

export const fusionnerAction = ({ inputFilesPattern, outputDirectory }: FusionnerOptions): void => {
  const files: string[] = glob.sync(inputFilesPattern);

  if (!atLeastOneItemIn(files)) throw new Error('Aucun fichier trouvé pour le modèle fourni.');

  const fileFormat: string = getFileFormat(files);

  if (!isAllowedFileFormat(fileFormat)('.json', '.csv'))
    throw new Error(`Le format de fichier ${fileFormat} n'est pas pris en charge. Veuillez utiliser des fichiers CSV ou JSON.`);

  if (hasMixedFormats(files)(fileFormat))
    throw new Error(
      "Formats de fichiers mixtes détectés. Veuillez vous assurer que tous les fichiers d'entrée sont soit ay format CSV, soit au format JSON."
    );

  if (fileFormat === '.csv') mergeCsvFiles(files, outputDirectory);
  else mergeJsonFiles(files, outputDirectory);
};
