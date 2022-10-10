/* eslint-disable */

import * as fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;
import { objectKeyFormatter } from './helper';

const SOURCE_PATH: string = './assets/input/';
const HINAURA_FILE: string = 'hinaura.json';

fs.readFile(`${SOURCE_PATH}${HINAURA_FILE}`, 'utf8', (err: ErrnoException | null, dataString: string) => {
  if (err) {
    return console.log(err);
  }

  const formatedData: { key: string; value: any }[] = JSON.parse(dataString);

  let index = 0;
  formatedData.forEach((item) => {
    index++;
    let codePostalToString = '';
    let dateMajFormat = '';
    let publics_accueillis = '';
    let conditions_access = '';
    let modalites_accompagnement = '';
    let services = '';
    for (const [key, value] of Object.entries(item)) {
      let newKey = objectKeyFormatter(key);
      if (newKey === 'bf_latitude') newKey = 'latitude';
      if (newKey === 'bf_longitude') newKey = 'longitude';
      if (newKey === 'datetime_latest') {
        newKey = 'date_maj';
        dateMajFormat = value.split('/');
        dateMajFormat = dateMajFormat[2]?.split(' ')[0] + '-' + dateMajFormat[1] + '-' + dateMajFormat[0];
      }
      if (newKey === 'code_postal') codePostalToString = value.toString();
      if (newKey === 'adresse_postale') newKey = 'adresse';
      if (newKey === 'nom_du_lieu_ou_de_la_structure') newKey = 'nom';
      if (newKey === 'publics_accueillis') {
        if (value.toLowerCase().includes('adultes'))
          if (publics_accueillis !== '') publics_accueillis = publics_accueillis + ',Adultes';
          else publics_accueillis = 'Adultes';
        if (value.toLowerCase().includes('parentalité'))
          if (publics_accueillis !== '') publics_accueillis = publics_accueillis + ',Familles/enfants';
          else publics_accueillis = 'Familles/enfants';
        if (value.toLowerCase().includes('jeunesse'))
          if (publics_accueillis !== '') publics_accueillis = publics_accueillis + ',Jeunes (16-26 ans)';
          else publics_accueillis = 'Jeunes (16-26 ans)';
        if (value.toLowerCase().includes('seniors') || value.toLowerCase().includes('séniors'))
          if (publics_accueillis !== '') publics_accueillis = publics_accueillis + ',Seniors (+ 65 ans)';
          else publics_accueillis = 'Seniors (+ 65 ans)';
        if (value.toLowerCase().includes('tout public'))
          publics_accueillis =
            "Seniors (+ 65 ans),Familles/enfants,Adultes,Jeunes (16-26 ans),Public langues étrangères,Déficience visuelle,Surdité,Handicaps psychiques,Handicaps mentaux,Uniquement femmes,Personnes en situation d'illettrisme";
      }
      if (newKey === 'accueil_pour_les_personnes_en_situation_de_handicap') {
        if (value.toLocaleLowerCase().includes('surdité'))
          if (publics_accueillis !== '') publics_accueillis = publics_accueillis + ',Surdité';
          else publics_accueillis = 'Surdité';
        if (value.toLocaleLowerCase().includes('cécité') || value.toLocaleLowerCase().includes('déficience visuelle'))
          if (publics_accueillis !== '') publics_accueillis = publics_accueillis + ',Déficience visuelle';
          else publics_accueillis = 'Déficience visuelle';
        if (value.toLocaleLowerCase().includes('handicap mental'))
          if (publics_accueillis !== '') publics_accueillis = publics_accueillis + ',Handicaps mentaux';
          else publics_accueillis = 'Handicaps mentaux';
      }
      if (newKey === 'accompagnement_de_publics_specifiques') {
        if (value.toLocaleLowerCase().includes("personnes en situation d'illettrisme"))
          if (publics_accueillis !== '') publics_accueillis = publics_accueillis + ",Personnes en situation d'illettrisme";
          else publics_accueillis = "Personnes en situation d'illettrisme";
        if (value.toLocaleLowerCase().includes('langue étrangère'))
          if (publics_accueillis !== '') publics_accueillis = publics_accueillis + ',Public langues étrangères';
          else publics_accueillis = 'Public langues étrangères';
      }
      if (newKey === 'tarifs') {
        if (value.toLocaleLowerCase().includes('gratuit'))
          if (conditions_access !== '') conditions_access = conditions_access + ',Gratuit';
          else conditions_access = 'Gratuit';
        if (value.toLocaleLowerCase().includes('gratuit sous condition'))
          if (conditions_access !== '') conditions_access = conditions_access + ',Gratuit sous condition';
          else conditions_access = 'Gratuit sous condition';
        if (value.toLocaleLowerCase().includes('adhésion'))
          if (conditions_access !== '') conditions_access = conditions_access + ',Adhésion';
          else conditions_access = 'Adhésion';
        if (value.toLocaleLowerCase().includes('payant'))
          if (conditions_access !== '') conditions_access = conditions_access + ',Payant';
          else conditions_access = 'Payant';
        if (value.toLocaleLowerCase().includes('pass numérique'))
          if (conditions_access !== '') conditions_access = conditions_access + ',Accepte le Pass numérique';
          else conditions_access = 'Accepte le Pass numérique';
      }
      if (newKey === "types_d'accompagnement_proposes") {
        if (
          value.toLocaleLowerCase().includes('accompagnement individuel') ||
          value.toLocaleLowerCase().includes('accès libre avec un accompagnement')
        )
          if (modalites_accompagnement !== '') modalites_accompagnement = modalites_accompagnement + ",Seul,Avec de l'aide";
          else modalites_accompagnement = "Seul,Avec de l'aide";
        if (value.toLocaleLowerCase().includes('accompagnement en groupe'))
          if (modalites_accompagnement !== '') modalites_accompagnement = modalites_accompagnement + ',Dans un atelier';
          else modalites_accompagnement = 'Dans un atelier';
        if (value.toLocaleLowerCase().includes('faire à la place de'))
          if (modalites_accompagnement !== '') modalites_accompagnement = modalites_accompagnement + ',A ma place';
          else modalites_accompagnement = 'A ma place';
      }
      if (newKey === 'a_disposition') {
        if (value.toLocaleLowerCase().includes('réseau wifi'))
          if (services !== '') services = services + ',Accéder à une connexion internet';
          else services = 'Accéder à une connexion internet';
        if (value.toLocaleLowerCase().includes('accès libre à du matériel informatique'))
          if (services !== '') services = services + ',Accéder à du matériel';
          else services = 'Accéder à du matériel';
      }
      if (newKey === 'formations_competences_de_base_proposees') {
        if (value.toLocaleLowerCase().includes("découvrir l'ordinateur"))
          if (services !== '')
            services =
              services + ',Prendre en main un ordinateur,Utiliser le numérique au quotidien,Approfondir ma culture numérique';
          else services = 'Prendre en main un ordinateur,Utiliser le numérique au quotidien,Approfondir ma culture numérique';
        if (value.toLocaleLowerCase().includes('tablette') || value.toLocaleLowerCase().includes('smartphone'))
          if (services !== '') services = services + ',Prendre en main un smartphone ou une tablette';
          else services = 'Prendre en main un smartphone ou une tablette';
      }
      if (newKey === 'comprendre_et_utiliser_les_sites_d’acces_aux_droits_proposees') {
        if (
          value.toLocaleLowerCase().includes('services de la caf') ||
          value.toLocaleLowerCase().includes('services des impôts') ||
          value.toLocaleLowerCase().includes('logement social') ||
          value.toLocaleLowerCase().includes('pôle emploi') ||
          value.toLocaleLowerCase().includes('pole-emploi.fr')
        ) {
          if (modalites_accompagnement.includes('Seul') && modalites_accompagnement.includes("Avec de l'aide"))
            if (services !== '')
              services =
                services +
                ',Devenir autonome dans les démarches administratives,Réaliser des démarches administratives avec un accompagnement';
            else
              services =
                'Devenir autonome dans les démarches administratives,Réaliser des démarches administratives avec un accompagnement';
          if (modalites_accompagnement.includes('Seul'))
            if (services !== '') services = services + ',Devenir autonome dans les démarches administratives';
            else services = 'Devenir autonome dans les démarches administratives';
          if (modalites_accompagnement.includes("Avec de l'aide"))
            if (services !== '') services = services + ',Réaliser des démarches administratives avec un accompagnement';
            else services = 'Réaliser des démarches administratives avec un accompagnement';
        }
        if (value.includes('CPAM') || value.includes('ameli.fr'))
          if (services !== '') services = services + ',Accompagner les démarches de santé';
          else services = 'Accompagner les démarches de santé';
      }
      if (newKey === 'sensibilisations_culture_numerique') {
        if (value.toLocaleLowerCase().includes('cultures numériques'))
          if (services !== '')
            services =
              services +
              ',Utiliser le numérique au quotidien,Approfondir ma culture numérique,Promouvoir la citoyenneté numérique';
          else
            services =
              'Utiliser le numérique au quotidien,Approfondir ma culture numérique,Promouvoir la citoyenneté numérique';
      }
      item['id' as keyof typeof item] = index.toString();
      item['publics_accueillis' as keyof typeof item] = publics_accueillis;
      item['conditions_access' as keyof typeof item] = conditions_access;
      item['modalites_accompagnement' as keyof typeof item] = modalites_accompagnement;
      item['services' as keyof typeof item] = services;
      item['code_postal' as keyof typeof item] = codePostalToString;
      item['date_maj' as keyof typeof item] = dateMajFormat;
      item[newKey as keyof typeof item] = item[key as keyof typeof item];
      delete item[key as keyof typeof item];
    }
  });

  // we print formated data in a json but we also can use directly formatedData here
  const dataToStringify = JSON.stringify(formatedData);
  fs.writeFile('./assets/output/hinaura-formated.json', dataToStringify, 'utf8', (err: ErrnoException | null) => {
    if (err) {
      return console.log(err);
    }
  });
});
