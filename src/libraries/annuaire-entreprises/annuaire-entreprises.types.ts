export type EtablissementALAdresse = {
  siret: string;
  denomination: string;
  natureJuridique: string;
  adresse: string;
  actif: boolean;
};

export type AdresseNormalisee = {
  codePostal: string;
  commune: string;
  numero: string;
  voie: string;
};

export type ClesRetenues = ReadonlySet<string>;

export const cleDAdresse = ({ codePostal, commune, numero, voie }: AdresseNormalisee): string =>
  `${codePostal}|${commune}|${numero}|${voie}`;
