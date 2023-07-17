import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { ratio } from 'fuzzball';

export const keepOneEntryPerSource = (data: LieuMediationNumerique[]): LieuMediationNumerique[] => {
  const uniqueEntries: LieuMediationNumerique[] = data.filter(
    (entry: LieuMediationNumerique, index: number, array: LieuMediationNumerique[]): boolean =>
      array.findIndex((item: LieuMediationNumerique): boolean => {
        const isSameSource: boolean = item.source === entry.source;
        const isSimilarNom: boolean = ratio(item.nom, entry.nom) > 90;
        const isSimilarAdresse: boolean = ratio(item.adresse as unknown as string, entry.adresse as unknown as string) > 90;
        const isSameLocation: boolean =
          item.localisation?.latitude === entry.localisation?.latitude &&
          item.localisation?.longitude === entry.localisation?.longitude;

        return isSameSource && isSimilarNom && isSimilarAdresse && isSameLocation;
      }) === index
  );

  return uniqueEntries;
};
