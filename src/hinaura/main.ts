/* eslint-disable no-console,@typescript-eslint/no-restricted-imports,no-undef,max-lines-per-function,max-statements,camelcase,complexity,@typescript-eslint/naming-convention,id-denylist,@typescript-eslint/no-explicit-any,no-param-reassign,@typescript-eslint/no-dynamic-delete,max-depth */

import * as fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;
import {
  objectKeyFormatter,
  processConditionsAccess,
  processModalitesAccompagnement,
  processPublicsAccueillis,
  processServices
} from './helper';

const SOURCE_PATH: string = './assets/input/';
const HINAURA_FILE: string = 'hinaura.json';

fs.readFile(`${SOURCE_PATH}${HINAURA_FILE}`, 'utf8', (readError: ErrnoException | null, dataString: string): void => {
  if (readError != null) {
    console.error(readError);
    return undefined;
  }

  const formatedData: { key: string; value: any }[] = JSON.parse(dataString);

  let index: number = 0;
  formatedData.forEach((item: { key: string; value: any }): void => {
    index += 1;
    let codePostalToString: string = '';
    let dateMajFormat: string = '';
    let publics_accueillis: string = '';
    let conditions_access: string = '';
    let modalites_accompagnement: string = '';
    let services: string = '';
    for (const [key, value] of Object.entries(item)) {
      let newKey: string = objectKeyFormatter(key);
      if (newKey === 'bf_latitude') newKey = 'latitude';
      if (newKey === 'bf_longitude') newKey = 'longitude';
      if (newKey === 'datetime_latest') {
        newKey = 'date_maj';
        dateMajFormat = value.split('/');
        dateMajFormat = `${dateMajFormat[2]?.split(' ')[0]}-${dateMajFormat[1]}-${dateMajFormat[0]}`;
      }
      if (newKey === 'code_postal') codePostalToString = value.toString();
      if (newKey === 'adresse_postale') newKey = 'adresse';
      if (newKey === 'nom_du_lieu_ou_de_la_structure') newKey = 'nom';

      // process publics accueillis
      if (newKey === 'publics_accueillis') publics_accueillis = processPublicsAccueillis(value);
      if (newKey === 'accueil_pour_les_personnes_en_situation_de_handicap') {
        if (publics_accueillis !== '' && processPublicsAccueillis(value) !== '')
          publics_accueillis = `${publics_accueillis},${processPublicsAccueillis(value)}`;
        if (publics_accueillis === '') publics_accueillis = processPublicsAccueillis(value);
      }
      if (newKey === 'accompagnement_de_publics_specifiques') {
        if (publics_accueillis !== '' && processPublicsAccueillis(value) !== '')
          publics_accueillis = `${publics_accueillis},${processPublicsAccueillis(value)}`;
        if (publics_accueillis === '') publics_accueillis = processPublicsAccueillis(value);
      }

      if (newKey === 'tarifs') conditions_access = processConditionsAccess(value);
      if (newKey === "types_d'accompagnement_proposes") modalites_accompagnement = processModalitesAccompagnement(value);

      // process services
      if (newKey === 'a_disposition') services = processServices(value, modalites_accompagnement);
      if (newKey === 'formations_competences_de_base_proposees') {
        if (services !== '' && processServices(value, modalites_accompagnement) !== '')
          services = `${services},${processServices(value, modalites_accompagnement)}`;
        if (services === '') services = processServices(value, modalites_accompagnement);
      }
      if (newKey === 'comprendre_et_utiliser_les_sites_d’acces_aux_droits_proposees') {
        if (services !== '' && processServices(value, modalites_accompagnement) !== '')
          services = `${services},${processServices(value, modalites_accompagnement)}`;
        if (services === '') services = processServices(value, modalites_accompagnement);
      }
      if (newKey === 'sensibilisations_culture_numerique') {
        if (services !== '' && processServices(value, modalites_accompagnement) !== '')
          services = `${services},${processServices(value, modalites_accompagnement)}`;
        if (services === '') services = processServices(value, modalites_accompagnement);
      }

      item['id' as keyof typeof item] = index.toString();
      item['publics_accueillis' as keyof typeof item] = publics_accueillis;
      item['conditions_access' as keyof typeof item] = conditions_access;
      item['modalites_accompagnement' as keyof typeof item] = modalites_accompagnement;
      item['services' as keyof typeof item] = services.replace(',,', ',');
      item['code_postal' as keyof typeof item] = codePostalToString;
      item['date_maj' as keyof typeof item] = dateMajFormat;
      item[newKey as keyof typeof item] = item[key as keyof typeof item];
      delete item[key as keyof typeof item];
    }
  });

  // we print formated data in a json but we also can use directly formatedData here
  const dataToStringify: string = JSON.stringify(formatedData);
  fs.writeFile('./assets/output/hinaura-formated.json', dataToStringify, 'utf8', (err: ErrnoException | null): void => {
    if (err != null) {
      console.log(err);
      return;
    }
  });
  return undefined;
});
