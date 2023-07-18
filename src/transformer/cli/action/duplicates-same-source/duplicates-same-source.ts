import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { ratio } from 'fuzzball';

const isSameSource = (structure: LieuMediationNumerique, lieu: LieuMediationNumerique): boolean =>
  structure.source !== '' && lieu.source !== '' && structure.source === lieu.source;

const isSimilarNom = (structure: LieuMediationNumerique, lieu: LieuMediationNumerique): boolean =>
  ratio(structure.nom, lieu.nom) > 90;

const isSimilarAdresse = (structure: LieuMediationNumerique, lieu: LieuMediationNumerique): boolean =>
  ratio(structure.adresse as unknown as string, lieu.adresse as unknown as string) > 90;

const isSameLocation = (structure: LieuMediationNumerique, lieu: LieuMediationNumerique): boolean =>
  structure.localisation?.latitude === lieu.localisation?.latitude &&
  structure.localisation?.longitude === lieu.localisation?.longitude;

export const keepOneEntryPerSource = (data: LieuMediationNumerique[]): LieuMediationNumerique[] =>
  data.filter(
    (lieu: LieuMediationNumerique, index: number, array: LieuMediationNumerique[]): boolean =>
      array.findIndex(
        (structure: LieuMediationNumerique): boolean =>
          isSameSource(structure, lieu) &&
          isSimilarNom(structure, lieu) &&
          isSimilarAdresse(structure, lieu) &&
          isSameLocation(structure, lieu)
      ) === index
  );
