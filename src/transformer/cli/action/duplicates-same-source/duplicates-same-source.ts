import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { ratio } from 'fuzzball';

const isSameSource = (structure: LieuMediationNumerique, lieu: LieuMediationNumerique): boolean =>
  structure.source !== '' && lieu.source !== '' && structure.source === lieu.source;

const isSimilarNom = (structure: LieuMediationNumerique, lieu: LieuMediationNumerique): boolean =>
  ratio(structure.nom, lieu.nom) > 90;

const isSimilarAdresse = (structure: LieuMediationNumerique, lieu: LieuMediationNumerique): boolean =>
  ratio(structure.adresse.voie as unknown as string, lieu.adresse.voie as unknown as string) > 90 &&
  structure.adresse.code_postal === lieu.adresse.code_postal;

const isSameLocation = (structure: LieuMediationNumerique, lieu: LieuMediationNumerique): boolean =>
  structure.localisation?.latitude === lieu.localisation?.latitude &&
  structure.localisation?.longitude === lieu.localisation?.longitude;

// todo: here is internal deduplication to fix
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
