import { describe, it, expect } from 'vitest';
import { ModaliteAcces, ModalitesAcces } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching } from '../../input';
import { processModalitesAcces } from './modalites-acces.field';

const MODALITES_ACCES_FIELD: 'Mobilisation du service' = 'Mobilisation du service' as const;

const MATCHING: LieuxMediationNumeriqueMatching = {
  modalites_acces: [
    {
      colonnes: [MODALITES_ACCES_FIELD],
      termes: ['se rendre sur place'],
      cible: ModaliteAcces.SePresenter
    },
    {
      colonnes: [MODALITES_ACCES_FIELD],
      termes: ['contacter par mail'],
      cible: ModaliteAcces.ContacterParMail
    },
    {
      colonnes: [MODALITES_ACCES_FIELD],
      termes: ['contacter par téléphone'],
      cible: ModaliteAcces.Telephoner
    },
    {
      colonnes: [MODALITES_ACCES_FIELD],
      termes: ['Prendre un rendez-vous en ligne'],
      cible: ModaliteAcces.PrendreRdvEnLigne
    },
    {
      colonnes: [MODALITES_ACCES_FIELD],
      termes: ["Ce lieu n'accueil pas de public"],
      cible: ModaliteAcces.PasDePublic
    }
  ]
} as LieuxMediationNumeriqueMatching;

describe('modalites acces field', (): void => {
  it('should get modalites acces for empty value', (): void => {
    const modalitesAcces: ModalitesAcces = processModalitesAcces(
      {
        [MODALITES_ACCES_FIELD]: ''
      },
      MATCHING
    );

    expect(modalitesAcces).toStrictEqual([]);
  });

  it('should get "Se présenter" when value is "se rendre sur place"', (): void => {
    const modalitesAcces: ModalitesAcces = processModalitesAcces(
      {
        [MODALITES_ACCES_FIELD]: 'se rendre sur place'
      },
      MATCHING
    );

    expect(modalitesAcces).toStrictEqual([ModaliteAcces.SePresenter]);
  });

  it('should get "Contacter par mail" when value is "contacter par mail"', (): void => {
    const modalitesAcces: ModalitesAcces = processModalitesAcces(
      {
        [MODALITES_ACCES_FIELD]: 'contacter par mail'
      },
      MATCHING
    );

    expect(modalitesAcces).toStrictEqual([ModaliteAcces.ContacterParMail]);
  });

  it('should get "Telephoner" when value is "contacter par téléphone"', (): void => {
    const modalitesAcces: ModalitesAcces = processModalitesAcces(
      {
        [MODALITES_ACCES_FIELD]: 'contacter par téléphone'
      },
      MATCHING
    );

    expect(modalitesAcces).toStrictEqual([ModaliteAcces.Telephoner]);
  });

  it('should get "Prendre Rdv en ligne" when value is "Prendre un rendez-vous en ligne"', (): void => {
    const modalitesAcces: ModalitesAcces = processModalitesAcces(
      {
        [MODALITES_ACCES_FIELD]: 'Prendre un rendez-vous en ligne'
      },
      MATCHING
    );

    expect(modalitesAcces).toStrictEqual([ModaliteAcces.PrendreRdvEnLigne]);
  });

  it('should get "Contacter par mail, Telephoner" when value is "contacter par mail, contacter par téléphone"', (): void => {
    const modalitesAcces: ModalitesAcces = processModalitesAcces(
      {
        [MODALITES_ACCES_FIELD]: 'contacter par mail, contacter par téléphone'
      },
      MATCHING
    );

    expect(modalitesAcces).toStrictEqual([ModaliteAcces.ContacterParMail, ModaliteAcces.Telephoner]);
  });
});
