/* eslint-disable no-console,@typescript-eslint/no-restricted-imports,no-undef,max-lines-per-function,max-statements,camelcase,complexity,@typescript-eslint/naming-convention,id-denylist,@typescript-eslint/no-explicit-any,no-param-reassign,@typescript-eslint/no-dynamic-delete,max-depth,max-lines */

export type HinauraLieuMediationNumerique = {
  datetime_create: string;
  datetime_latest: string;
  'Nom du lieu ou de la structure *': string;
  'Adresse postale *': string;
  'Code postal': string;
  'Ville *': string;
  bf_latitude: number;
  bf_longitude: number;
  "Email (éviter les emails nominatifs - en cas d'email nominitatif seule la personne concernée est autorisé à l'ajouter)": string;
  Téléphone: string;
  'Site Web': string;
  'Informations diverses (précisions sur votre structure, vos services, vos partenaires...)': string;
  "Type d'opérateur": string;
  'Type de lieu': string;
  'Accueille un ou des Conseillers Numériques France Services': string;
  Lundi: string;
  Mardi: string;
  Mercredi: string;
  Jeudi: string;
  Vendredi: string;
  Samedi: string;
  Dimanche: string;
  'Publics accueillis': string;
  'Accueil pour les personnes en situation de handicap': string;
  'Accompagnement de publics spécifiques': string;
  Tarifs: string;
  'À disposition': string;
  "Types d'accompagnement proposés": string;
  'Accompagnements proposés aux démarches en ligne': string;
  'Formations compétences de base proposées': string;
  'Comprendre et Utiliser les sites d’accès aux droits proposées': string;
  'Sensibilisations culture numérique': string;
  'Politique de confidentialité relative aux données personnelles *': string;
};

export const objectKeyFormatter = (str: string): string =>
  objectKeyRemovePonctuation(str).replace('*', '').trim().replace(/ /gu, '_').toLocaleLowerCase();

const objectKeyRemovePonctuation = (str: string): string => str.normalize('NFD').replace(/[\u0300-\u036f]/gu, '');
