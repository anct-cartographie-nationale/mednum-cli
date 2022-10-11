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

export const processPublicsAccueillis = (value: string): string => {
  let publicsAccueillis: string = '';
  if (value.toLowerCase().includes('adultes')) {
    if (publicsAccueillis !== '') publicsAccueillis = `${publicsAccueillis},Adultes`;
    if (publicsAccueillis === '') publicsAccueillis = 'Adultes';
  }
  if (value.toLowerCase().includes('parentalité')) {
    if (publicsAccueillis !== '') publicsAccueillis = `${publicsAccueillis},Familles/enfants`;
    if (publicsAccueillis === '') publicsAccueillis = 'Familles/enfants';
  }
  if (value.toLowerCase().includes('jeunesse')) {
    if (publicsAccueillis !== '') publicsAccueillis = `${publicsAccueillis},Jeunes (16-26 ans)`;
    if (publicsAccueillis === '') publicsAccueillis = 'Jeunes (16-26 ans)';
  }
  if (value.toLowerCase().includes('seniors') || value.toLowerCase().includes('séniors')) {
    if (publicsAccueillis !== '') publicsAccueillis = `${publicsAccueillis},Seniors (+ 65 ans)`;
    if (publicsAccueillis === '') publicsAccueillis = 'Seniors (+ 65 ans)';
  }
  if (value.toLowerCase().includes('tout public'))
    publicsAccueillis =
      "Seniors (+ 65 ans),Familles/enfants,Adultes,Jeunes (16-26 ans),Public langues étrangères,Déficience visuelle,Surdité,Handicaps psychiques,Handicaps mentaux,Uniquement femmes,Personnes en situation d'illettrisme";
  if (value.toLocaleLowerCase().includes('surdité')) {
    if (publicsAccueillis !== '') publicsAccueillis = `${publicsAccueillis},Surdité`;
    if (publicsAccueillis === '') publicsAccueillis = 'Surdité';
  }
  if (value.toLocaleLowerCase().includes('cécité') || value.toLocaleLowerCase().includes('déficience visuelle')) {
    if (publicsAccueillis !== '') publicsAccueillis = `${publicsAccueillis},Déficience visuelle`;
    if (publicsAccueillis === '') publicsAccueillis = 'Déficience visuelle';
  }
  if (value.toLocaleLowerCase().includes('handicap mental')) {
    if (publicsAccueillis !== '') publicsAccueillis = `${publicsAccueillis},Handicaps mentaux`;
    if (publicsAccueillis === '') publicsAccueillis = 'Handicaps mentaux';
  }
  if (value.toLocaleLowerCase().includes("personnes en situation d'illettrisme")) {
    if (publicsAccueillis !== '') publicsAccueillis = `${publicsAccueillis},Personnes en situation d'illettrisme`;
    if (publicsAccueillis === '') publicsAccueillis = "Personnes en situation d'illettrisme";
  }
  if (value.toLocaleLowerCase().includes('langue étrangère')) {
    if (publicsAccueillis !== '') publicsAccueillis = `${publicsAccueillis},Public langues étrangères`;
    if (publicsAccueillis === '') publicsAccueillis = 'Public langues étrangères';
  }
  return publicsAccueillis;
};

export const processConditionsAccess = (value: string): string => {
  let conditionsAccess: string = '';
  if (value.toLocaleLowerCase().includes('gratuit')) {
    if (conditionsAccess !== '') conditionsAccess = `${conditionsAccess},Gratuit`;
    if (conditionsAccess === '') conditionsAccess = 'Gratuit';
  }
  if (value.toLocaleLowerCase().includes('gratuit sous condition')) {
    if (conditionsAccess !== '') conditionsAccess = `${conditionsAccess},Gratuit sous condition`;
    if (conditionsAccess === '') conditionsAccess = 'Gratuit sous condition';
  }
  if (value.toLocaleLowerCase().includes('adhésion')) {
    if (conditionsAccess !== '') conditionsAccess = `${conditionsAccess},Adhésion`;
    if (conditionsAccess === '') conditionsAccess = 'Adhésion';
  }
  if (value.toLocaleLowerCase().includes('payant')) {
    if (conditionsAccess !== '') conditionsAccess = `${conditionsAccess},Payant`;
    if (conditionsAccess === '') conditionsAccess = 'Payant';
  }
  if (value.toLocaleLowerCase().includes('pass numérique')) {
    if (conditionsAccess !== '') conditionsAccess = `${conditionsAccess},Accepte le Pass numérique`;
    if (conditionsAccess === '') conditionsAccess = 'Accepte le Pass numérique';
  }
  return conditionsAccess;
};

export const processModalitesAccompagnement = (value: string): string => {
  let modalitesAccompagnement: string = '';
  if (
    value.toLocaleLowerCase().includes('accompagnement individuel') ||
    value.toLocaleLowerCase().includes('accès libre avec un accompagnement')
  ) {
    if (modalitesAccompagnement !== '') modalitesAccompagnement = `${modalitesAccompagnement},Seul,Avec de l'aide`;
    if (modalitesAccompagnement === '') modalitesAccompagnement = "Seul,Avec de l'aide";
  }
  if (value.toLocaleLowerCase().includes('accompagnement en groupe')) {
    if (modalitesAccompagnement !== '') modalitesAccompagnement = `${modalitesAccompagnement},Dans un atelier`;
    if (modalitesAccompagnement === '') modalitesAccompagnement = 'Dans un atelier';
  }
  if (value.toLocaleLowerCase().includes('faire à la place de')) {
    if (modalitesAccompagnement !== '') modalitesAccompagnement = `${modalitesAccompagnement},A ma place`;
    if (modalitesAccompagnement === '') modalitesAccompagnement = 'A ma place';
  }
  return modalitesAccompagnement;
};
