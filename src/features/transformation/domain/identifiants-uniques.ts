import type { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { Report } from './report';

export const IDENTIFIANT_FIELD = 'id';

const IDENTIFIANT_EN_DOUBLE =
  'Cet identifiant est déjà porté par un autre lieu de la même source : le standard en exige un par lieu, et en fabriquer un discriminant masquerait au producteur un problème qui lui appartient';

const enDouble = (lieux: LieuMediationNumerique[]): ReadonlySet<string> => {
  const vus = new Set<string>();

  return lieux.reduce((doubles: Set<string>, { id }: LieuMediationNumerique): Set<string> => {
    vus.has(id) ? doubles.add(id) : vus.add(id);

    return doubles;
  }, new Set<string>());
};

/**
 * Le standard exige un identifiant par lieu. Quand deux lieux d'une même source en portent le
 * même — une colonne vide de part et d'autre, ou deux contenus dont l'empreinte se confond — ils
 * sont tous deux écartés, motif au rapport : publier le premier venu reviendrait à faire
 * disparaître l'autre en silence.
 */
export const sansIdentifiantEnDouble = (lieux: LieuMediationNumerique[], report: Report): LieuMediationNumerique[] => {
  const doubles: ReadonlySet<string> = enDouble(lieux);

  if (doubles.size === 0) return lieux;

  lieux.forEach((lieu: LieuMediationNumerique, index: number): void => {
    if (doubles.has(lieu.id)) report.entry(index).record(IDENTIFIANT_FIELD, IDENTIFIANT_EN_DOUBLE, lieu.nom).commit();
  });

  return lieux.filter(({ id }: LieuMediationNumerique): boolean => !doubles.has(id));
};
