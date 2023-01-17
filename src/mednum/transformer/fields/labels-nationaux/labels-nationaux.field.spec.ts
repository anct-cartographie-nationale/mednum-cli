/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { LabelNational, LabelsNationaux } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { processLabelsNationaux } from './labels-nationaux.field';
import { LieuxMediationNumeriqueMatching } from '../../input';

describe('labels nationaux field', (): void => {
  it('should get labels nationaux for empty value', (): void => {
    const labelsNationaux: LabelsNationaux = processLabelsNationaux({}, {} as LieuxMediationNumeriqueMatching);

    expect(labelsNationaux).toStrictEqual([]);
  });

  it('should get France Services default labels nationaux', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      labels_nationaux: [
        {
          cible: LabelNational.FranceServices
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const labelsNationaux: LabelsNationaux = processLabelsNationaux({}, matching);

    expect(labelsNationaux).toStrictEqual([LabelNational.FranceServices]);
  });

  it('should get matching CNFS and France Services labels nationaux', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      labels_nationaux: [
        {
          colonnes: ['label'],
          termes: ['FS'],
          cible: 'France Services'
        },
        {
          colonnes: ['label'],
          termes: ['Conseiller Numérique'],
          cible: 'CNFS'
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const labelsNationaux: LabelsNationaux = processLabelsNationaux(
      {
        label: 'FS et Conseiller Numérique'
      },
      matching
    );

    expect(labelsNationaux).toStrictEqual([LabelNational.FranceServices, LabelNational.CNFS]);
  });

  it('should not get any matching label national', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      labels_nationaux: [
        {
          colonnes: ['label'],
          termes: ['FS'],
          cible: 'France Services'
        },
        {
          colonnes: ['label'],
          termes: ['Conseiller Numérique'],
          cible: 'CNFS'
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const labelsNationaux: LabelsNationaux = processLabelsNationaux(
      {
        label: 'pas de labels'
      },
      matching
    );

    expect(labelsNationaux).toStrictEqual([]);
  });
});
