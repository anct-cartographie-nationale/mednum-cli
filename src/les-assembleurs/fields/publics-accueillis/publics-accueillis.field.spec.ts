/* eslint-disable @typescript-eslint/naming-convention */

import { PublicAccueilli } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LesAssembleursLieuMediationNumerique } from '../../helpers';
import { formatPublicAccueilliField } from './publics-accueillis.field';

describe('les assembleurs publics accueillis field', (): void => {
  it('should handle empty value', (): void => {
    const publicsAccueillis: PublicAccueilli[] = formatPublicAccueilliField({} as LesAssembleursLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([]);
  });

  it('should not find any publics accueillis matching "Détail publics" key', (): void => {
    const publicsAccueillis: PublicAccueilli[] = formatPublicAccueilliField({
      'Détail publics': ''
    } as LesAssembleursLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([]);
  });

  it('should not find any publics accueillis matching "Accessibilité PMR" key', (): void => {
    const publicsAccueillis: PublicAccueilli[] = formatPublicAccueilliField({
      'Accessibilité PMR': ''
    } as LesAssembleursLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([]);
  });

  it('should find "Adultes" publics accueillis', (): void => {
    const publicsAccueillis: PublicAccueilli[] = formatPublicAccueilliField({
      'Détail publics': 'adultes'
    } as LesAssembleursLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.Adultes]);
  });

  it('should find "Adultes,Jeunes" publics accueillis', (): void => {
    const publicsAccueillis: PublicAccueilli[] = formatPublicAccueilliField({
      'Détail publics': 'adultes, jeunes'
    } as LesAssembleursLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.Adultes, PublicAccueilli.Jeunes]);
  });

  it('should find "Seniors (+ 65 ans)" publics accueillis - senior with é', (): void => {
    const publicsAccueillis: PublicAccueilli[] = formatPublicAccueilliField({
      'Détail publics': 'séniors'
    } as LesAssembleursLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.Seniors]);
  });

  it('should find "Seniors (+ 65 ans)" publics accueillis - senior without é', (): void => {
    const publicsAccueillis: PublicAccueilli[] = formatPublicAccueilliField({
      'Détail publics': 'seniors'
    } as LesAssembleursLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.Seniors]);
  });

  it('should find all publics accueillis', (): void => {
    const publicsAccueillis: PublicAccueilli[] = formatPublicAccueilliField({
      'Détail publics': 'tout public'
    } as LesAssembleursLieuMediationNumerique);

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

  it('should find all handicap publics accueillis', (): void => {
    const publicsAccueillis: PublicAccueilli[] = formatPublicAccueilliField({
      'Accessibilité PMR': 'oui'
    } as LesAssembleursLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([
      PublicAccueilli.Surdite,
      PublicAccueilli.HandicapsMentaux,
      PublicAccueilli.HandicapsPsychiques,
      PublicAccueilli.DeficienceVisuelle
    ]);
  });

  it('should find "Illettrisme" publics accueillis', (): void => {
    const publicsAccueillis: PublicAccueilli[] = formatPublicAccueilliField({
      'Détail publics': "Situation d'illettrisme"
    } as LesAssembleursLieuMediationNumerique);

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.Illettrisme]);
  });
});
