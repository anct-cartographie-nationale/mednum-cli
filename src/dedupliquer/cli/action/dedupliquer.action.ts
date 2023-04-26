import axios, { AxiosResponse } from 'axios';
import { DedupliquerOptions } from '../dedupliquer-options';
import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
const fuzz = require('fuzzball');

export type Duplicate = {
  id: string;
  distanceScore: number;
  nomFuzzyScore: number;
  voieFuzzyScore: number;
};

export type LieuDuplications = {
  id: string;
  duplicates: Duplicate[];
};

export type CommuneDuplications = {
  codePostal: string;
  lieux: LieuDuplications[];
};

const hasDefinedCoordinates = (
  lieu: SchemaLieuMediationNumerique
): lieu is SchemaLieuMediationNumerique & { latitude: number; longitude: number } =>
  lieu.latitude != null && lieu.longitude != null;

const onlyDifferentLieuxInSameComuneOf =
  (curentLieu: SchemaLieuMediationNumerique) =>
  (lieu: SchemaLieuMediationNumerique): boolean =>
    lieu.code_postal === curentLieu.code_postal && lieu.id !== curentLieu.id;

const cartesianDistanceBetween = (lieu: SchemaLieuMediationNumerique, curentLieu: SchemaLieuMediationNumerique): number =>
  hasDefinedCoordinates(lieu) && hasDefinedCoordinates(curentLieu)
    ? Math.sqrt(Math.pow(lieu.latitude - curentLieu.latitude, 2) + Math.pow(lieu.longitude - curentLieu.longitude, 2))
    : NaN;

const distanceScore = (cartesianDistance: number): number => Math.trunc(cartesianDistance < 0.01 ? 100 : 1 / cartesianDistance);

const duplicatesWithScores = (lieux: SchemaLieuMediationNumerique[], curentLieu: SchemaLieuMediationNumerique): Duplicate[] =>
  lieux.filter(onlyDifferentLieuxInSameComuneOf(curentLieu)).map(
    (lieu: SchemaLieuMediationNumerique): Duplicate => ({
      id: lieu.id,
      distanceScore: distanceScore(cartesianDistanceBetween(lieu, curentLieu)),
      nomFuzzyScore: fuzz.ratio(lieu.nom, curentLieu.nom),
      voieFuzzyScore: fuzz.ratio(lieu.adresse, curentLieu.adresse)
    })
  );

const onlyWithDuplicates = (communeDuplications: CommuneDuplications): boolean =>
  communeDuplications.lieux.every((lieuDuplications: LieuDuplications): boolean => lieuDuplications.duplicates.length > 0);

const withSameCodePostal =
  (lieu: SchemaLieuMediationNumerique) =>
  (communeDuplications: CommuneDuplications): boolean =>
    communeDuplications.codePostal === lieu.code_postal;

const toUpdatedCommuneDuplications =
  (
    lieu: SchemaLieuMediationNumerique,
    lieux: SchemaLieuMediationNumerique[],
    duplicationsWithSameCodePostal: CommuneDuplications
  ) =>
  (communeDuplications: CommuneDuplications): CommuneDuplications =>
    communeDuplications.codePostal === lieu.code_postal
      ? {
          codePostal: lieu.code_postal,
          lieux: [...duplicationsWithSameCodePostal.lieux, { id: lieu.id, duplicates: duplicatesWithScores(lieux, lieu) }]
        }
      : communeDuplications;

const appendCommuneDuplications = (
  lieu: SchemaLieuMediationNumerique,
  lieux: SchemaLieuMediationNumerique[],
  duplications: CommuneDuplications[]
): CommuneDuplications[] => [
  ...duplications,
  {
    codePostal: lieu.code_postal,
    lieux: [{ id: lieu.id, duplicates: duplicatesWithScores(lieux, lieu) }]
  }
];

const toCommunesDuplications = (
  duplications: CommuneDuplications[],
  lieu: SchemaLieuMediationNumerique,
  _: number,
  lieux: SchemaLieuMediationNumerique[]
) =>
  ((duplicationsWithSameCodePostal?: CommuneDuplications): CommuneDuplications[] =>
    duplicationsWithSameCodePostal == null
      ? appendCommuneDuplications(lieu, lieux, duplications)
      : duplications.map(toUpdatedCommuneDuplications(lieu, lieux, duplicationsWithSameCodePostal)))(
    duplications.find(withSameCodePostal(lieu))
  );

export const removeDuplicates = (lieux: SchemaLieuMediationNumerique[]): SchemaLieuMediationNumerique[] => {
  console.log(findDuplicates(lieux)[0]?.lieux[1]?.duplicates);
  return lieux;
};

export const findDuplicates = (lieux: SchemaLieuMediationNumerique[]): CommuneDuplications[] =>
  lieux.reduce(toCommunesDuplications, []).filter(onlyWithDuplicates);

export const DedupliquerAction = async (dedupliquerOptions: DedupliquerOptions): Promise<void> => {
  const lieuxFromDataInclusion: AxiosResponse<SchemaLieuMediationNumerique[]> = await axios.get(dedupliquerOptions.source);

  console.log(findDuplicates(lieuxFromDataInclusion.data));
};
