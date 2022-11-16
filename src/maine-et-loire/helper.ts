/* eslint-disable no-console,@typescript-eslint/no-restricted-imports,no-undef,max-lines-per-function,max-statements,camelcase,complexity,@typescript-eslint/naming-convention,id-denylist,@typescript-eslint/no-explicit-any,no-param-reassign,@typescript-eslint/no-dynamic-delete,max-depth,max-lines */

export type MaineEtLoireLieuMediationNumerique = {
  'Geo Point': string;
  'Geo Shape': string;
  ID: string;
  Date_maj: string;
  JT_Accueil: string;
  Nom: string;
  Catégorie: string;
  Numéro: number;
  Adresse: string;
  CP: number;
  Commune: string;
  Téléphone: string;
  Courriel: string;
  'Site web': string;
  JT_MAT_Wif: string;
  JT_MAT_Imp: string;
  JT_MAT_Sca: string;
  JT_MAT_Bor: string;
  JT_MAT_3D: string;
  JT_MAT_Con: string;
  JT_RH_Sala: string;
  JT_RH_Bene: string;
  JT_RH_Civi: string;
  JT_RH_Exte: string;
  'Accès internet': string;
  'Démarches générales': string;
  'Initiation aux outils numériques': string;
  JT_PBC_Tou: string;
  JT_PBC_Ins: string;
  JT_PBC_Adh: string;
  JT_EPCI: string;
};

export const objectKeyFormatter = (str: string): string =>
  objectKeyRemovePonctuation(str).replace('*', '').trim().replace(/ /gu, '_').toLocaleLowerCase();

const objectKeyRemovePonctuation = (str: string): string => str.normalize('NFD').replace(/[\u0300-\u036f]/gu, '');
