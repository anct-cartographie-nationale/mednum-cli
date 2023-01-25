/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { processLabelsAutres } from './labels-autres.field';
import { LieuxMediationNumeriqueMatching } from '../../input';

describe('labels autres field', (): void => {
  it('should not get labels autres for empty value', (): void => {
    const labelsAutres: string[] = processLabelsAutres({}, {} as LieuxMediationNumeriqueMatching);

    expect(labelsAutres).toStrictEqual([]);
  });

  it('should get SudLabs default labels autres', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      labels_autres: [
        {
          cible: 'SudLabs'
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const labelsAutres: string[] = processLabelsAutres({}, matching);

    expect(labelsAutres).toStrictEqual(['SudLabs']);
  });

  it('should get matching SudLabs and Nièvre médiation numérique labels autres', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      labels_autres: [
        {
          colonnes: ['label'],
          termes: ['Nièvre médiation'],
          cible: 'Nièvre médiation'
        },
        {
          colonnes: ['label'],
          termes: ['SudLabs'],
          cible: 'SudLabs'
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const labelsAutres: string[] = processLabelsAutres(
      {
        label: 'Nièvre médiation et SudLabs'
      },
      matching
    );

    expect(labelsAutres).toStrictEqual(['Nièvre médiation', 'SudLabs']);
  });

  it('should not get any matching label autre', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      labels_autres: [
        {
          colonnes: ['label'],
          termes: ['Nièvre médiation'],
          cible: 'Nièvre médiation'
        },
        {
          colonnes: ['label'],
          termes: ['SudLabs'],
          cible: 'SudLabs'
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const labelsAutres: string[] = processLabelsAutres(
      {
        label: 'pas de labels'
      },
      matching
    );

    expect(labelsAutres).toStrictEqual([]);
  });
});
