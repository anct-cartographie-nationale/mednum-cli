/* eslint-disable no-console,@typescript-eslint/no-restricted-imports,no-undef,max-lines-per-function,max-statements,camelcase,complexity,@typescript-eslint/naming-convention,id-denylist,@typescript-eslint/no-explicit-any,no-param-reassign,@typescript-eslint/no-dynamic-delete,max-depth,max-lines */

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

export const processServices = (value: string, modalites_accompagnement: string): string => {
  let services: string = '';
  if (value.toLocaleLowerCase().includes('réseau wifi')) {
    if (services !== '') services = `${services},Accéder à une connexion internet`;
    if (services === '') services = 'Accéder à une connexion internet';
  }
  if (value.toLocaleLowerCase().includes('accès libre à du matériel informatique')) {
    if (services !== '') services = `${services},Accéder à du matériel`;
    if (services === '') services = 'Accéder à du matériel';
  }
  if (value.toLocaleLowerCase().includes("découvrir l'ordinateur")) {
    if (services !== '')
      services = `${services},Prendre en main un ordinateur,Utiliser le numérique au quotidien,Approfondir ma culture numérique`;
    if (services === '')
      services = 'Prendre en main un ordinateur,Utiliser le numérique au quotidien,Approfondir ma culture numérique';
  }
  if (value.toLocaleLowerCase().includes('tablette') || value.toLocaleLowerCase().includes('smartphone')) {
    if (services !== '') services = `${services},Prendre en main un smartphone ou une tablette`;
    if (services === '') services = 'Prendre en main un smartphone ou une tablette';
  }
  if (
    value.toLocaleLowerCase().includes('services de la caf') ||
    value.toLocaleLowerCase().includes('services des impôts') ||
    value.toLocaleLowerCase().includes('logement social') ||
    value.toLocaleLowerCase().includes('pôle emploi') ||
    value.toLocaleLowerCase().includes('pole-emploi.fr')
  ) {
    if (modalites_accompagnement.includes('Seul') && modalites_accompagnement.includes("Avec de l'aide")) {
      if (services !== '')
        services = `${services},Devenir autonome dans les démarches administratives,Réaliser des démarches administratives avec un accompagnement`;
      if (services === '')
        services =
          'Devenir autonome dans les démarches administratives,Réaliser des démarches administratives avec un accompagnement';
    }
    if (modalites_accompagnement.includes('Seul')) {
      if (services !== '') services = `${services},Devenir autonome dans les démarches administratives`;
      if (services === '') services = 'Devenir autonome dans les démarches administratives';
    }
    if (modalites_accompagnement.includes("Avec de l'aide")) {
      if (services !== '') services = `${services},Réaliser des démarches administratives avec un accompagnement`;
      if (services === '') services = 'Réaliser des démarches administratives avec un accompagnement';
    }
  }
  if (value.includes('CPAM') || value.includes('ameli.fr')) {
    if (services !== '') services = `${services},Accompagner les démarches de santé`;
    if (services === '') services = 'Accompagner les démarches de santé';
  }
  if (value.toLocaleLowerCase().includes('cultures numériques')) {
    if (services !== '')
      services = `${services},Utiliser le numérique au quotidien,Approfondir ma culture numérique,Promouvoir la citoyenneté numérique`;
    if (services === '')
      services = 'Utiliser le numérique au quotidien,Approfondir ma culture numérique,Promouvoir la citoyenneté numérique';
  }
  return services;
};
