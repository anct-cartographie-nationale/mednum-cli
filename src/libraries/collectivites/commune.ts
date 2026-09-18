/**
 * Vocabulaire partagé des collectivités territoriales françaises. Ces contrats traversent les
 * capacités : l'enrichissement territorial les réalise, la transformation les consomme, sans
 * que l'une connaisse l'autre.
 */
export type Commune = {
  nom: string;
  code: string;
  codeDepartement: string;
  siren: string;
  codeEpci: string;
  codeRegion: string;
  codesPostaux: string[];
};

export type FindCommune = {
  parNom: (name: string) => Commune | undefined;
  parCodePostal: (codePostal: string) => Commune | undefined;
  parNomEtCodePostal: (nom: string, codePostal: string) => Commune | undefined;
  parNomEtCodePostalLePlusProcheDuDepartement: (nom: string, codePostal: string) => Commune | undefined;
};

export const slugify = (text: string): string =>
  text
    .normalize('NFKD')
    .trim()
    .toLowerCase()
    .replace(/œ/gu, 'oe')
    .replace(/[^a-z0-9 '-]/gu, '')
    .replace(/'+/gu, '-')
    .replace(/\s+/gu, '-')
    .replace(/-+/gu, '-');

type ArrondissementsMunicipaux = {
  commune: string;
  premier: number;
  dernier: number;
};

const ARRONDISSEMENTS_MUNICIPAUX: ArrondissementsMunicipaux[] = [
  { commune: '75056', premier: 75101, dernier: 75120 },
  { commune: '69123', premier: 69381, dernier: 69389 },
  { commune: '13055', premier: 13201, dernier: 13216 }
];

export const codeCommuneDe = (codeInsee: string): string =>
  ARRONDISSEMENTS_MUNICIPAUX.find(
    ({ premier, dernier }: ArrondissementsMunicipaux): boolean => Number(codeInsee) >= premier && Number(codeInsee) <= dernier
  )?.commune ?? codeInsee;
