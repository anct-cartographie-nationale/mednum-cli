import { createReadStream, createWriteStream, existsSync, renameSync } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import type { Readable } from 'node:stream';
import axios from 'axios';
import { parse } from 'csv-parse';
import type { AccesLibreErp, AccesLibreRow } from './acces-libre.types';

const ACCES_LIBRE_DATASET_URL = 'https://www.data.gouv.fr/api/1/datasets/r/93ae96a7-1db7-4cb4-a9f1-6d778370b640';

const toErp = (row: AccesLibreRow): AccesLibreErp => ({
  nom: row.name,
  activite: row.activite,
  codeInsee: row.code_insee,
  numero: row.numero,
  voie: row.voie,
  codePostal: row.postal_code,
  ficheUrl: row.web_url
});

const telecharger = async (url: string): Promise<Readable> => (await axios.get<Readable>(url, { responseType: 'stream' })).data;

const telechargerVers = async (url: string, destination: string): Promise<string> => {
  const enCours = `${destination}.partiel`;

  await pipeline(await telecharger(url), createWriteStream(enCours));
  renameSync(enCours, destination);

  return destination;
};

const projeter = async (flux: Readable): Promise<AccesLibreErp[]> => {
  const erps: AccesLibreErp[] = [];

  for await (const row of flux.pipe(parse({ columns: true, skip_records_with_error: true }))) {
    erps.push(toErp(row as AccesLibreRow));
  }

  return erps;
};

const fluxDeLExport = async (cheminLocal?: string, url: string = ACCES_LIBRE_DATASET_URL): Promise<Readable> => {
  if (cheminLocal == null) return telecharger(url);

  return createReadStream(existsSync(cheminLocal) ? cheminLocal : await telechargerVers(url, cheminLocal));
};

export const accesLibreErps = async (cheminLocal?: string, url?: string): Promise<AccesLibreErp[]> =>
  projeter(await fluxDeLExport(cheminLocal, url));
