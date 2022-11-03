import { processModalitesAccompagnement } from './modalites-accompagnement.field';
import { ModaliteAccompagnement, ModalitesAccompagnement } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { HinauraLieuMediationNumerique } from '../../helper';

const MODALITES_ACCOMPAGNEMENT_FIELD: "Types d'accompagnement proposés" = "Types d'accompagnement proposés" as const;

describe('modalites accompagnement field', (): void => {
  it('should get modalites accompagnement for empty value', (): void => {
    const modalitesAccompagnement: ModalitesAccompagnement = processModalitesAccompagnement({
      [MODALITES_ACCOMPAGNEMENT_FIELD]: ''
    } as HinauraLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([]);
  });

  it('should get "Seul,Avec de l\'aide" when value is "accompagnement individuel"', (): void => {
    const modalitesAccompagnement: ModalitesAccompagnement = processModalitesAccompagnement({
      [MODALITES_ACCOMPAGNEMENT_FIELD]: 'accompagnement individuel'
    } as HinauraLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.Seul, ModaliteAccompagnement.AvecDeLAide]);
  });

  it('should get "Seul,Avec de l\'aide" when value is "accès libre avec un accompagnement"', (): void => {
    const modalitesAccompagnement: ModalitesAccompagnement = processModalitesAccompagnement({
      [MODALITES_ACCOMPAGNEMENT_FIELD]: 'accès libre avec un accompagnement'
    } as HinauraLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.Seul, ModaliteAccompagnement.AvecDeLAide]);
  });

  it('should get "Dans un atelier" when value is "accompagnement en groupe"', (): void => {
    const modalitesAccompagnement: ModalitesAccompagnement = processModalitesAccompagnement({
      [MODALITES_ACCOMPAGNEMENT_FIELD]: 'accompagnement en groupe'
    } as HinauraLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.DansUnAtelier]);
  });

  it('should get "A ma place" when value is "faire à la place de"', (): void => {
    const modalitesAccompagnement: ModalitesAccompagnement = processModalitesAccompagnement({
      [MODALITES_ACCOMPAGNEMENT_FIELD]: 'faire à la place de'
    } as HinauraLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.AMaPlace]);
  });

  it('should get "Dans un atelier,A ma place" when value is "faire à la place de,accompagnement en groupe"', (): void => {
    const modalitesAccompagnement: ModalitesAccompagnement = processModalitesAccompagnement({
      [MODALITES_ACCOMPAGNEMENT_FIELD]: 'faire à la place de,accompagnement en groupe'
    } as HinauraLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.AMaPlace, ModaliteAccompagnement.DansUnAtelier]);
  });
});
