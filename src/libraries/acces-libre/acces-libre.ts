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

export const fetchAccesLibreErps = async (url: string = ACCES_LIBRE_DATASET_URL): Promise<AccesLibreErp[]> => {
  const flux = (await axios.get<Readable>(url, { responseType: 'stream' })).data;
  const erps: AccesLibreErp[] = [];

  for await (const row of flux.pipe(parse({ columns: true, skip_records_with_error: true }))) {
    erps.push(toErp(row as AccesLibreRow));
  }

  return erps;
};
