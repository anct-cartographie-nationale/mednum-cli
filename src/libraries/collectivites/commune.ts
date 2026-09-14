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
