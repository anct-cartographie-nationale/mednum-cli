export type EtablissementALAdresse = {
  siret: string;
  denomination: string;
  natureJuridique: string;
  adresse: string;
  actif: boolean;
};

export type AdresseNormalisee = {
  codePostal: string;
  numero: string;
  voie: string;
};

export type ClesRetenues = ReadonlySet<string>;

export const cleDAdresse = ({ codePostal, numero, voie }: AdresseNormalisee): string => `${codePostal}|${numero}|${voie}`;
