/* eslint-disable @typescript-eslint/naming-convention */

import { PublicAccueilli } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { HinauraLieuMediationNumerique } from '../../helper';
import { processPublicAccueilli } from './publics-accueillis.field';

describe('hinaura publics accueillis field', (): void => {
  it('should handle empty value', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli({} as HinauraLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([]);
  });

  it('should not find any publics accueillis matching Publics accueillis key', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli({
      'Publics accueillis': ''
    } as HinauraLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([]);
  });

  it('should not find any publics accueillis matching Accueil pour les personnes en situation de handicap key', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli({
      'Accueil pour les personnes en situation de handicap': ''
    } as HinauraLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([]);
  });

  it('should not find any publics accueillis matching Accompagnement de publics spécifiques key', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli({
      'Accompagnement de publics spécifiques': ''
    } as HinauraLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([]);
  });

  it('should find "Adultes" publics accueillis', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli({
      'Publics accueillis': 'adultes'
    } as HinauraLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.Adultes]);
  });

  it('should find "Adultes,Familles/enfants" publics accueillis', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli({
      'Publics accueillis': 'adultes, parentalité'
    } as HinauraLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.Adultes, PublicAccueilli.FamillesEnfants]);
  });

  it('should find "Familles/enfants" publics accueillis', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli({
      'Publics accueillis': 'parentalité'
    } as HinauraLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.FamillesEnfants]);
  });

  it('should find "Seniors (+ 65 ans)" publics accueillis - senior with é', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli({
      'Publics accueillis': 'séniors'
    } as HinauraLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.Seniors]);
  });

  it('should find "Seniors (+ 65 ans)" publics accueillis - senior without é', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli({
      'Publics accueillis': 'seniors'
    } as HinauraLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.Seniors]);
  });

  it('should find all publics accueillis', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli({
      'Publics accueillis': 'tout public'
    } as HinauraLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([
      PublicAccueilli.Adultes,
      PublicAccueilli.FamillesEnfants,
      PublicAccueilli.Jeunes,
      PublicAccueilli.Seniors,
      PublicAccueilli.Surdite,
      PublicAccueilli.HandicapsMentaux,
      PublicAccueilli.Illettrisme,
      PublicAccueilli.LanguesEtrangeres,
      PublicAccueilli.UniquementFemmes,
      PublicAccueilli.HandicapsPsychiques,
      PublicAccueilli.DeficienceVisuelle
    ]);
  });

  it('should find "Déficience visuelle" publics accueillis', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli({
      'Accueil pour les personnes en situation de handicap': 'cécité'
    } as HinauraLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.DeficienceVisuelle]);
  });
});
