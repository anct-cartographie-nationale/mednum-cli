import { createGunzip } from 'node:zlib';
import type { Readable } from 'node:stream';
import { createReadStream, existsSync, createWriteStream, renameSync } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import axios from 'axios';
import { parse } from 'csv-parse';
import { cleDAdresse, type ClesRetenues, type EtablissementALAdresse } from './annuaire-entreprises.types';

const ETABLISSEMENTS_URL = 'https://www.data.gouv.fr/api/1/datasets/r/12812d7d-d11c-45f4-965c-35a3b149c585';

const UNITES_LEGALES_URL = 'https://www.data.gouv.fr/api/1/datasets/r/b8e5376c-c158-4d88-91f3-f6bb0d165332';

const ADRESSE_AVEC_COMMUNE = /^(.*?)\s+(\d{5})\s+(.+)$/u;

const NUMERO_EN_TETE = /^\s*(\d+)\s*(bis|ter|quater|b|t)?\b/iu;

const LIGATURES = /[œŒæÆ]/gu;

const REMPLACEMENTS: Record<string, string> = { œ: 'oe', Œ: 'oe', æ: 'ae', Æ: 'ae' };

const normaliser = (valeur: string): string =>
  (valeur ?? '')
    .replace(LIGATURES, (ligature: string): string => REMPLACEMENTS[ligature] ?? ligature)
    .normalize('NFD')
    .replace(/[̀-ͯ]/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, ' ')
    .trim();

export const numeroDeVoie = (valeur: string): string => {
  const trouve: RegExpExecArray | null = NUMERO_EN_TETE.exec(valeur ?? '');

  return trouve == null ? '' : `${trouve[1]}${(trouve[2] ?? '').toLowerCase().charAt(0)}`;
};

export const voieNormalisee = (valeur: string): string => normaliser((valeur ?? '').replace(NUMERO_EN_TETE, ''));

const cleDeLEtablissement = (adresse: string): string | undefined => {
  const decoupee: RegExpExecArray | null = ADRESSE_AVEC_COMMUNE.exec(adresse ?? '');

  if (decoupee?.[1] == null || decoupee[2] == null) return undefined;

  return cleDAdresse({ codePostal: decoupee[2], numero: numeroDeVoie(decoupee[1]), voie: voieNormalisee(decoupee[1]) });
};

const fluxDistant = async (url: string): Promise<Readable> => (await axios.get<Readable>(url, { responseType: 'stream' })).data;

const telechargerVers = async (url: string, destination: string): Promise<string> => {
  const enCours = `${destination}.partiel`;

  await pipeline(await fluxDistant(url), createWriteStream(enCours));
  renameSync(enCours, destination);

  return destination;
};

const fluxDeLExport = async (url: string, cheminLocal?: string): Promise<Readable> => {
  if (cheminLocal == null) return fluxDistant(url);

  return createReadStream(existsSync(cheminLocal) ? cheminLocal : await telechargerVers(url, cheminLocal));
};

const lignes = async function* (url: string, cheminLocal?: string): AsyncGenerator<Record<string, string>> {
  const flux = (await fluxDeLExport(url, cheminLocal)).pipe(createGunzip());

  for await (const ligne of flux.pipe(parse({ columns: true, skip_records_with_error: true }))) {
    yield ligne as Record<string, string>;
  }
};

type Retenu = { siret: string; siren: string; adresse: string; actif: boolean };

export type CheminsLocaux = {
  etablissements?: string;
  unitesLegales?: string;
};

const ETABLISSEMENTS_LOCAL = './assets/input/etablissements.csv.gz';

const UNITES_LEGALES_LOCAL = './assets/input/unites-legales.csv.gz';

export const projeterAnnuaire = async (
  cles: ClesRetenues,
  { etablissements = ETABLISSEMENTS_LOCAL, unitesLegales = UNITES_LEGALES_LOCAL }: CheminsLocaux = {}
): Promise<EtablissementALAdresse[]> => {
  const retenus: Retenu[] = [];
  const sirens = new Set<string>();

  for await (const ligne of lignes(ETABLISSEMENTS_URL, etablissements)) {
    const cle: string | undefined = cleDeLEtablissement(ligne['adresse'] ?? '');

    if (cle == null || !cles.has(cle)) continue;

    retenus.push({
      siret: ligne['siret'] ?? '',
      siren: ligne['siren'] ?? '',
      adresse: ligne['adresse'] ?? '',
      actif: ligne['etat_administratif'] === 'A'
    });
    sirens.add(ligne['siren'] ?? '');
  }

  const parSiren = new Map<string, { denomination: string; natureJuridique: string }>();

  for await (const ligne of lignes(UNITES_LEGALES_URL, unitesLegales)) {
    if (!sirens.has(ligne['siren'] ?? '')) continue;

    parSiren.set(ligne['siren'] ?? '', {
      denomination: ligne['nom_complet'] ?? '',
      natureJuridique: ligne['nature_juridique'] ?? ''
    });
  }

  return retenus.map(
    ({ siret, siren, adresse, actif }: Retenu): EtablissementALAdresse => ({
      siret,
      adresse,
      actif,
      denomination: parSiren.get(siren)?.denomination ?? '',
      natureJuridique: parSiren.get(siren)?.natureJuridique ?? ''
    })
  );
};
