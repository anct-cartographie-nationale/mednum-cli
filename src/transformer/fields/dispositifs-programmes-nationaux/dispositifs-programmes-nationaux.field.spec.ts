import { describe, it, expect } from 'vitest';
import { DispositifProgrammeNational, DispositifProgrammesNationaux } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching } from '../../input';
import { processDispositifProgrammeNationaux } from './dispositifs-programmes-nationaux.field';

describe('labels nationaux field', (): void => {
  it('should get labels nationaux for empty value', (): void => {
    const labelsNationaux: DispositifProgrammesNationaux = processDispositifProgrammeNationaux(
      {},
      {} as LieuxMediationNumeriqueMatching
    );

    expect(labelsNationaux).toStrictEqual([]);
  });

  it('should get France Services default labels nationaux', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      dispositif_programmes_nationaux: [
        {
          cible: DispositifProgrammeNational.FranceServices
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const labelsNationaux: DispositifProgrammesNationaux = processDispositifProgrammeNationaux({}, matching);

    expect(labelsNationaux).toStrictEqual([DispositifProgrammeNational.FranceServices]);
  });

  it('should get matching CNFS and France Services labels nationaux', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      dispositif_programmes_nationaux: [
        {
          colonnes: ['label'],
          termes: ['FS'],
          cible: DispositifProgrammeNational.FranceServices
        },
        {
          colonnes: ['label'],
          termes: ['Conseiller Numérique'],
          cible: DispositifProgrammeNational.ConseillersNumeriques
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const labelsNationaux: DispositifProgrammesNationaux = processDispositifProgrammeNationaux(
      {
        label: 'FS et Conseiller Numérique'
      },
      matching
    );

    expect(labelsNationaux).toStrictEqual([
      DispositifProgrammeNational.FranceServices,
      DispositifProgrammeNational.ConseillersNumeriques
    ]);
  });

  it('should not get any matching label national', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      dispositif_programmes_nationaux: [
        {
          colonnes: ['label'],
          termes: ['FS'],
          cible: DispositifProgrammeNational.FranceServices
        },
        {
          colonnes: ['label'],
          termes: ['Conseiller Numérique'],
          cible: DispositifProgrammeNational.ConseillersNumeriques
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const labelsNationaux: DispositifProgrammesNationaux = processDispositifProgrammeNationaux(
      {
        label: 'pas de labels'
      },
      matching
    );

    expect(labelsNationaux).toStrictEqual([]);
  });
});
