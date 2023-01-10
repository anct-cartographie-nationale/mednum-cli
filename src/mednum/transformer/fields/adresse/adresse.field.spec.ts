/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Adresse } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Recorder, Report } from '../../report';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { processAdresse } from './adresse.field';

const STANDARD_MATCHING: LieuxMediationNumeriqueMatching = {
  code_postal: {
    colonne: 'Code postal'
  },
  commune: {
    colonne: 'Ville *'
  },
  voie: {
    colonne: 'Adresse postale *'
  }
} as LieuxMediationNumeriqueMatching;

const SPLIT_VOIE_MATCHING: LieuxMediationNumeriqueMatching = {
  code_postal: {
    colonne: 'CP'
  },
  commune: {
    colonne: 'Commune'
  },
  voie: {
    joindre: {
      colonnes: ['Numéro', 'Adresse'],
      séparateur: ' '
    }
  }
} as LieuxMediationNumeriqueMatching;

describe('adresse field', (): void => {
  it('should process a valid address', (): void => {
    const source: DataSource = {
      'Code postal': '38000',
      'Ville *': 'Grenoble',
      'Adresse postale *': '5 rue Malakoff'
    };

    const adresse: Adresse = processAdresse(Report().entry(0))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '38000',
      commune: 'Grenoble',
      voie: '5 rue Malakoff'
    });
  });

  it('should fix value with code postal in adresse postale field instead of Code postal field', (): void => {
    const source: DataSource = {
      'Adresse postale *': '5, rue Malakoff,\n38000 Grenoble \n\n-\n\n29, bis rue Colonel Bougault, 38100 Grenoble',
      'Code postal': '',
      'Ville *': 'grenoble'
    };

    const adresse: Adresse = processAdresse(Report().entry(0))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '38100',
      commune: 'Grenoble',
      voie: '5 rue Malakoff'
    });
  });

  it('should fix commune with invalid â character', (): void => {
    const source: DataSource = {
      'Adresse postale *': '10 rue du Serre Blanc',
      'Code postal': '26130',
      'Ville *': 'SAINT PAUL TROIS CH╢TEAUX'
    };

    const adresse: Adresse = processAdresse(Report().entry(0))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '26130',
      commune: 'SAINT PAUL TROIS CHÂTEAUX',
      voie: '10 rue du Serre Blanc'
    });
  });

  it('should fix commune Saint Laurent de Chamousset with no code postal', (): void => {
    const source: DataSource = {
      'Adresse postale *': '122, avenue des 4 cantons',
      'Code postal': '',
      'Ville *': 'Saint Laurent de Chamousset'
    };

    const adresse: Adresse = processAdresse(Report().entry(0))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '69930',
      commune: 'Saint Laurent de Chamousset',
      voie: '122 avenue des 4 cantons'
    });
  });

  it('should fix commune Gannat with no code postal', (): void => {
    const source: DataSource = {
      'Adresse postale *': '12 Allée des tilleuls',
      'Code postal': '',
      'Ville *': 'Gannat'
    };

    const adresse: Adresse = processAdresse(Report().entry(0))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '03800',
      commune: 'Gannat',
      voie: '12 Allée des tilleuls'
    });
  });

  it('should get empty code postal record in report with an update fix', (): void => {
    const report: Report = Report();
    const recorder: Recorder = report.entry(0);

    const source: DataSource = {
      'Adresse postale *': '3 rue de la mairie',
      'Code postal': '',
      'Ville *': 'Bessenay'
    };

    processAdresse(recorder)(source, STANDARD_MATCHING);

    recorder.commit();

    expect(report.records()).toStrictEqual([
      {
        index: 0,
        errors: [
          {
            field: 'code_postal',
            message: "Le code postal  n'est pas valide",
            fixes: [
              {
                before: '',
                apply: 'missing code postal',
                after: '69690'
              }
            ]
          }
        ]
      }
    ]);
  });

  it('should process an address with a split voie', (): void => {
    const source: DataSource = {
      CP: '38000',
      Commune: 'Grenoble',
      Adresse: 'rue Malakoff',
      Numéro: '5'
    };

    const adresse: Adresse = processAdresse(Report().entry(0))(source, SPLIT_VOIE_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '38000',
      commune: 'Grenoble',
      voie: '5 rue Malakoff'
    });
  });

  it('should process an address with a number code postal', (): void => {
    const source: DataSource = {
      CP: 38000 as unknown as string,
      Commune: 'Grenoble',
      Adresse: 'rue Malakoff',
      Numéro: '5'
    };

    const adresse: Adresse = processAdresse(Report().entry(0))(source, SPLIT_VOIE_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '38000',
      commune: 'Grenoble',
      voie: '5 rue Malakoff'
    });
  });
});
