import { ModaliteAccompagnement, ModalitesAccompagnement } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching } from '../../input';
import { processModalitesAccompagnement } from './modalites-accompagnement.field';

const MODALITES_ACCOMPAGNEMENT_FIELD: "Types d'accompagnement proposés" = "Types d'accompagnement proposés" as const;

const MATCHING: LieuxMediationNumeriqueMatching = {
  modaliteAccompagnement: [
    {
      colonnes: ["Types d'accompagnement proposés"],
      termes: ['accompagnement en groupe'],
      cible: ModaliteAccompagnement.DansUnAtelier
    },
    {
      colonnes: ["Types d'accompagnement proposés"],
      termes: ['faire à la place de'],
      cible: ModaliteAccompagnement.AMaPlace
    },
    {
      colonnes: ["Types d'accompagnement proposés"],
      termes: ['accompagnement individuel'],
      cible: ModaliteAccompagnement.AvecDeLAide
    },
    {
      colonnes: ["Types d'accompagnement proposés"],
      termes: ['accès libre avec un accompagnement'],
      cible: ModaliteAccompagnement.Seul
    }
  ]
} as LieuxMediationNumeriqueMatching;

describe('modalites accompagnement field', (): void => {
  it('should get modalites accompagnement for empty value', (): void => {
    const modalitesAccompagnement: ModalitesAccompagnement = processModalitesAccompagnement(
      {
        [MODALITES_ACCOMPAGNEMENT_FIELD]: ''
      },
      MATCHING
    );

    expect(modalitesAccompagnement).toStrictEqual([]);
  });

  it('should get "Avec de l\'aide" when value is "accompagnement individuel"', (): void => {
    const modalitesAccompagnement: ModalitesAccompagnement = processModalitesAccompagnement(
      {
        [MODALITES_ACCOMPAGNEMENT_FIELD]: 'accompagnement individuel'
      },
      MATCHING
    );

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.AvecDeLAide]);
  });

  it('should get "Seul" when value is "accès libre avec un accompagnement"', (): void => {
    const modalitesAccompagnement: ModalitesAccompagnement = processModalitesAccompagnement(
      {
        [MODALITES_ACCOMPAGNEMENT_FIELD]: 'accès libre avec un accompagnement'
      },
      MATCHING
    );

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.Seul]);
  });

  it('should get "Dans un atelier" when value is "accompagnement en groupe"', (): void => {
    const modalitesAccompagnement: ModalitesAccompagnement = processModalitesAccompagnement(
      {
        [MODALITES_ACCOMPAGNEMENT_FIELD]: 'accompagnement en groupe'
      },
      MATCHING
    );

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.DansUnAtelier]);
  });

  it('should get "A ma place" when value is "faire à la place de"', (): void => {
    const modalitesAccompagnement: ModalitesAccompagnement = processModalitesAccompagnement(
      {
        [MODALITES_ACCOMPAGNEMENT_FIELD]: 'faire à la place de'
      },
      MATCHING
    );

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.AMaPlace]);
  });

  it('should get "Dans un atelier,A ma place" when value is "faire à la place de,accompagnement en groupe"', (): void => {
    const modalitesAccompagnement: ModalitesAccompagnement = processModalitesAccompagnement(
      {
        [MODALITES_ACCOMPAGNEMENT_FIELD]: 'faire à la place de, accompagnement en groupe'
      },
      MATCHING
    );

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.DansUnAtelier, ModaliteAccompagnement.AMaPlace]);
  });
});
