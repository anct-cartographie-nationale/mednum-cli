/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { processLocalisation } from './localisation.field';
import { HinauraLieuMediationNumerique } from '../../helper';

describe('localisation field', (): void => {
  it('should process localisation form source', (): void => {
    const localisation: Localisation = processLocalisation({
      bf_latitude: 0,
      bf_longitude: 0
    } as HinauraLieuMediationNumerique);

    expect(localisation).toStrictEqual<Localisation>(
      Localisation({
        latitude: 0,
        longitude: 0
      })
    );
  });
});
