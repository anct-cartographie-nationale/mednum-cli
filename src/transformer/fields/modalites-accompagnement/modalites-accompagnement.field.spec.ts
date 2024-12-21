import { describe, it, expect } from 'vitest';
import { ModaliteAccompagnement, ModalitesAccompagnement } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching } from '../../input';
import { processModalitesAccompagnement } from './modalites-accompagnement.field';

const MODALITES_ACCOMPAGNEMENT_FIELD: "Types d'accompagnement proposés" = "Types d'accompagnement proposés" as const;

const MATCHING: LieuxMediationNumeriqueMatching = {
  modalites_accompagnement: [
    {
      colonnes: ["Types d'accompagnement proposés"],
      termes: ['accompagnement en groupe'],
      cible: ModaliteAccompagnement.DansUnAtelier
    },
    {
      colonnes: ["Types d'accompagnement proposés"],
      termes: ['en ligne'],
      cible: ModaliteAccompagnement.ADistance
    },
    {
      colonnes: ["Types d'accompagnement proposés"],
      termes: ['avec un accompagnement'],
      cible: ModaliteAccompagnement.AccompagnementIndividuel
    },
    {
      colonnes: ["Types d'accompagnement proposés"],
      termes: ['accès libre'],
      cible: ModaliteAccompagnement.EnAutonomie
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

  it('should get "Accompagnement individuel" when value is "avec un accompagnement"', (): void => {
    const modalitesAccompagnement: ModalitesAccompagnement = processModalitesAccompagnement(
      {
        [MODALITES_ACCOMPAGNEMENT_FIELD]: 'avec un accompagnement'
      },
      MATCHING
    );

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.AccompagnementIndividuel]);
  });

  it('should get "Seul" when value is "accès libre"', (): void => {
    const modalitesAccompagnement: ModalitesAccompagnement = processModalitesAccompagnement(
      {
        [MODALITES_ACCOMPAGNEMENT_FIELD]: 'accès libre'
      },
      MATCHING
    );

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.EnAutonomie]);
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

  it('should get "A ma place" when value is "en ligne"', (): void => {
    const modalitesAccompagnement: ModalitesAccompagnement = processModalitesAccompagnement(
      {
        [MODALITES_ACCOMPAGNEMENT_FIELD]: 'en ligne'
      },
      MATCHING
    );

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.ADistance]);
  });

  it('should get "Dans un atelier,A ma place" when value is "en ligne,accompagnement en groupe"', (): void => {
    const modalitesAccompagnement: ModalitesAccompagnement = processModalitesAccompagnement(
      {
        [MODALITES_ACCOMPAGNEMENT_FIELD]: 'en ligne, accompagnement en groupe'
      },
      MATCHING
    );

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.DansUnAtelier, ModaliteAccompagnement.ADistance]);
  });
});
