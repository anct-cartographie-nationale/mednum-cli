/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Adresse } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Recorder, Report } from '../../../tools';
import { HinauraLieuMediationNumerique } from '../../helper';
import { processAdresse } from './adresse.field';

describe('adresse field', (): void => {
  it('should process a valid address', (): void => {
    const hinauraLieuMediationNumerique: HinauraLieuMediationNumerique = {
      'Code postal': '38000',
      'Ville *': 'Grenoble',
      'Adresse postale *': '5 rue Malakoff'
    } as HinauraLieuMediationNumerique;

    const adresse: Adresse = processAdresse(Report().entry(0))(hinauraLieuMediationNumerique);

    expect(adresse).toStrictEqual({
      code_postal: '38000',
      commune: 'Grenoble',
      voie: '5 rue Malakoff'
    });
  });

  it('should fix value with code postal in adresse postale field instead of Code postal field', (): void => {
    const hinauraLieuMediationNumerique: HinauraLieuMediationNumerique = {
      'Adresse postale *': '5, rue Malakoff,\n38000 Grenoble \n\n-\n\n29, bis rue Colonel Bougault, 38100 Grenoble',
      'Code postal': '',
      'Ville *': 'grenoble'
    } as HinauraLieuMediationNumerique;

    const adresse: Adresse = processAdresse(Report().entry(0))(hinauraLieuMediationNumerique);

    expect(adresse).toStrictEqual({
      code_postal: '38100',
      commune: 'Grenoble',
      voie: '5 rue Malakoff'
    });
  });

  it('should fix commune with invalid â character', (): void => {
    const hinauraLieuMediationNumerique: HinauraLieuMediationNumerique = {
      'Adresse postale *': '10 rue du Serre Blanc',
      'Code postal': '26130',
      'Ville *': 'SAINT PAUL TROIS CH╢TEAUX'
    } as HinauraLieuMediationNumerique;

    const adresse: Adresse = processAdresse(Report().entry(0))(hinauraLieuMediationNumerique);

    expect(adresse).toStrictEqual({
      code_postal: '26130',
      commune: 'SAINT PAUL TROIS CHÂTEAUX',
      voie: '10 rue du Serre Blanc'
    });
  });

  it('should fix commune Saint Laurent de Chamousset with no code postal', (): void => {
    const hinauraLieuMediationNumerique: HinauraLieuMediationNumerique = {
      'Adresse postale *': '122, avenue des 4 cantons',
      'Code postal': '',
      'Ville *': 'Saint Laurent de Chamousset'
    } as HinauraLieuMediationNumerique;

    const adresse: Adresse = processAdresse(Report().entry(0))(hinauraLieuMediationNumerique);

    expect(adresse).toStrictEqual({
      code_postal: '69930',
      commune: 'Saint Laurent de Chamousset',
      voie: '122 avenue des 4 cantons'
    });
  });

  it('should fix commune Gannat with no code postal', (): void => {
    const hinauraLieuMediationNumerique: HinauraLieuMediationNumerique = {
      'Adresse postale *': '12 Allée des tilleuls',
      'Code postal': '',
      'Ville *': 'Gannat'
    } as HinauraLieuMediationNumerique;

    const adresse: Adresse = processAdresse(Report().entry(0))(hinauraLieuMediationNumerique);

    expect(adresse).toStrictEqual({
      code_postal: '03800',
      commune: 'Gannat',
      voie: '12 Allée des tilleuls'
    });
  });

  it('should get empty code postal record in report with an update fix', (): void => {
    const report: Report = Report();
    const recorder: Recorder = report.entry(0);

    processAdresse(recorder)({
      'Adresse postale *': '3 rue de la mairie',
      'Code postal': '',
      'Ville *': 'Bessenay'
    } as HinauraLieuMediationNumerique);

    recorder.commit();

    expect(report.records()).toStrictEqual([
      {
        index: 0,
        errors: [
          {
            field: 'codePostal',
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
});
