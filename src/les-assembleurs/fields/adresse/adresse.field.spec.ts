/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Adresse } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LesAssembleursLieuMediationNumerique } from '../../helpers';
import { processAdresse } from './adresse.field';
import { Report } from '../../../mednum/transformer/report';

describe('adresse field', (): void => {
  it('should process a valid address', (): void => {
    const lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique = {
      'Code postal': 2800,
      Commune: 'La Fère',
      Adresse: '17 rue Henri Martin'
    } as LesAssembleursLieuMediationNumerique;

    const adresse: Adresse = processAdresse(Report().entry(0))(lesAssembleursLieuMediationNumerique);

    expect(adresse).toStrictEqual({
      code_postal: '02800',
      commune: 'La Fère',
      voie: '17 rue Henri Martin'
    });
  });

  it('should process unexpected details in commune', (): void => {
    const lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique = {
      'Code postal': 2510,
      Commune: 'Etreux (Le Gard)',
      Adresse: '17 rue Henri Martin'
    } as LesAssembleursLieuMediationNumerique;

    const adresse: Adresse = processAdresse(Report().entry(0))(lesAssembleursLieuMediationNumerique);

    expect(adresse).toStrictEqual({
      code_postal: '02510',
      commune: 'Etreux',
      voie: '17 rue Henri Martin'
    });
  });
});
