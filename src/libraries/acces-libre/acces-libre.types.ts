export type AccesLibreErp = {
  nom: string;
  activite: string;
  codeInsee: string;
  numero: string;
  voie: string;
  codePostal: string;
  ficheUrl: string;
};

export const ACCES_LIBRE_COLUMNS = ['name', 'activite', 'code_insee', 'numero', 'voie', 'postal_code', 'web_url'] as const;

export type AccesLibreColumn = (typeof ACCES_LIBRE_COLUMNS)[number];

export type AccesLibreRow = Record<AccesLibreColumn, string>;
