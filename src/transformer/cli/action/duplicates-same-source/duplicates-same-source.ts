/* eslint-disable camelcase, no-param-reassign, @typescript-eslint/no-unused-expressions */

import {
  LieuMediationNumerique,
  Pivot,
  ModalitesAccompagnement,
  ConditionsAcces,
  PublicsAccueillis,
  Services
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { ratio } from 'fuzzball';

const mergeValues = <T>(existingString: T | undefined, newString: T | undefined): T =>
  Array.from(new Set([existingString, newString])).join(';') as T;

const mergeFieldsValues = (duplicateEntry: LieuMediationNumerique, entry: LieuMediationNumerique): void => {
  duplicateEntry.services = mergeValues<Services>(duplicateEntry.services, entry.services);
  duplicateEntry.conditions_acces != null || entry.conditions_acces != null
    ? (duplicateEntry.conditions_acces = mergeValues<ConditionsAcces>(duplicateEntry.conditions_acces, entry.conditions_acces))
    : {};
  duplicateEntry.modalites_accompagnement != null || entry.modalites_accompagnement != null
    ? (duplicateEntry.modalites_accompagnement = mergeValues<ModalitesAccompagnement>(
        duplicateEntry.modalites_accompagnement,
        entry.modalites_accompagnement
      ))
    : {};
  duplicateEntry.publics_accueillis != null || entry.publics_accueillis != null
    ? (duplicateEntry.publics_accueillis = mergeValues<PublicsAccueillis>(
        duplicateEntry.publics_accueillis,
        entry.publics_accueillis
      ))
    : {};
};

export const mergeDoublonsInSameSource = (data: LieuMediationNumerique[]): LieuMediationNumerique[] => {
  const uniqueEntries: LieuMediationNumerique[] = [];

  data.forEach((entry: LieuMediationNumerique): void => {
    const duplicateEntry: LieuMediationNumerique | undefined = uniqueEntries.find(
      (item: LieuMediationNumerique): boolean =>
        item.source === entry.source &&
        (ratio(item.nom, entry.nom) > 90 ||
          ratio(item.adresse.voie, entry.adresse.voie) > 90 ||
          (item.localisation?.latitude === entry.localisation?.latitude &&
            item.localisation?.longitude === entry.localisation?.longitude))
    );

    if (duplicateEntry != null) mergeFieldsValues(duplicateEntry, entry);

    if (entry.pivot !== '00000000000000' && duplicateEntry?.pivot === '00000000000000') {
      duplicateEntry.pivot = entry.pivot as Pivot;
    } else {
      uniqueEntries.push({ ...entry });
    }
  });

  return uniqueEntries;
};
