/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Adresse } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Report } from '../../../tools';
import { MaineEtLoireLieuMediationNumerique } from '../../helper';
import { processAdresse } from './adresse.field';

describe('adresse field', (): void => {
  it('should process a valid address', (): void => {
    const maineEtLoireLieuMediationNumerique: MaineEtLoireLieuMediationNumerique = {
      CP: 38000,
      Commune: 'Grenoble',
      Adresse: 'rue Malakoff'
    } as MaineEtLoireLieuMediationNumerique;

    const adresse: Adresse = processAdresse(Report().entry(0))(maineEtLoireLieuMediationNumerique);

    expect(adresse).toStrictEqual({
      code_postal: '38000',
      commune: 'Grenoble',
      voie: 'rue Malakoff'
    });
  });

  it('should fix commune with invalid â character', (): void => {
    const maineEtLoireLieuMediationNumerique: MaineEtLoireLieuMediationNumerique = {
      CP: 26130,
      Commune: 'SAINT PAUL TROIS CH╢TEAUX',
      Adresse: '10 rue du Serre Blanc'
    } as MaineEtLoireLieuMediationNumerique;

    const adresse: Adresse = processAdresse(Report().entry(0))(maineEtLoireLieuMediationNumerique);

    expect(adresse).toStrictEqual({
      code_postal: '26130',
      commune: 'SAINT PAUL TROIS CHÂTEAUX',
      voie: '10 rue du Serre Blanc'
    });
  });
});
