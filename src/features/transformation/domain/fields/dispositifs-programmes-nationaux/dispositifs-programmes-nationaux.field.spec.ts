import { describe, it, expect } from 'vitest';
import { DispositifProgrammeNational, DispositifProgrammesNationaux } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { LieuxMediationNumeriqueMatching } from '../../matching';
import { type Recorder, Report } from '../../report';
import {
  DISPOSITIF_PROGRAMMES_NATIONAUX_FIELD,
  processDispositifProgrammeNationaux,
  reserveALaCoop,
  SOURCE_COOP_NUMERIQUE
} from './dispositifs-programmes-nationaux.field';

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
      DispositifProgrammeNational.ConseillersNumeriques,
      DispositifProgrammeNational.FranceServices
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

describe('label Conseillers numériques réservé à la Coop', (): void => {
  const dispositifs = (...valeurs: DispositifProgrammeNational[]): DispositifProgrammesNationaux =>
    DispositifProgrammesNationaux(valeurs);

  it('conserve le label Conseillers numériques déclaré par la Coop', (): void => {
    const report: Report = Report();

    const conserves: DispositifProgrammesNationaux = reserveALaCoop(
      dispositifs(DispositifProgrammeNational.ConseillersNumeriques, DispositifProgrammeNational.FranceServices),
      SOURCE_COOP_NUMERIQUE,
      report.entry(0),
      'Médiathèque'
    );

    expect(conserves).toStrictEqual([
      DispositifProgrammeNational.ConseillersNumeriques,
      DispositifProgrammeNational.FranceServices
    ]);
    expect(report.records()).toStrictEqual([]);
  });

  it("retire le label Conseillers numériques déclaré par une source qui n'est pas la Coop", (): void => {
    const report: Report = Report();

    const conserves: DispositifProgrammesNationaux = reserveALaCoop(
      dispositifs(DispositifProgrammeNational.ConseillersNumeriques, DispositifProgrammeNational.FranceServices),
      'Vosges',
      report.entry(0),
      'Médiathèque'
    );

    expect(conserves).toStrictEqual([DispositifProgrammeNational.FranceServices]);
  });

  it("porte au rapport le retrait du label déclaré par une source qui n'est pas la Coop", (): void => {
    const report: Report = Report();
    const recorder: Recorder = report.entry(0);

    reserveALaCoop(dispositifs(DispositifProgrammeNational.ConseillersNumeriques), 'Vosges', recorder, 'Médiathèque');
    recorder.commit();

    expect(report.records()).toStrictEqual([
      {
        index: 0,
        errors: [
          {
            field: DISPOSITIF_PROGRAMMES_NATIONAUX_FIELD,
            message:
              'Seule la Coop de la médiation numérique atteste le label « Conseillers numériques » : le label déclaré par la source est retiré',
            entryName: 'Médiathèque',
            fixes: []
          }
        ]
      }
    ]);
  });

  it('ne signale rien quand la source ne déclare pas le label Conseillers numériques', (): void => {
    const report: Report = Report();
    const recorder: Recorder = report.entry(0);

    const conserves: DispositifProgrammesNationaux = reserveALaCoop(
      dispositifs(DispositifProgrammeNational.FranceServices),
      'Vosges',
      recorder,
      'Médiathèque'
    );
    recorder.commit();

    expect(conserves).toStrictEqual([DispositifProgrammeNational.FranceServices]);
    expect(report.records()).toStrictEqual([]);
  });
});
