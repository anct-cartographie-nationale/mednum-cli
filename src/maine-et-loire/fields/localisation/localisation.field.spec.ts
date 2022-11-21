/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { processLocalisation } from './localisation.field';

describe('localisation field', (): void => {
  it('should process localisation form maine et loire', (): void => {
    const geoPoint = '47.52108262171417,-0.4712484447080984';
    const latitude = geoPoint?.split(',')[0] ?? '';
    const longitude = geoPoint?.split(',')[1] ?? '';
    const localisation: Localisation = processLocalisation(latitude, longitude);

    expect(localisation).toStrictEqual<Localisation>(
      Localisation({
        latitude: 47.52108262171417,
        longitude: -0.4712484447080984
      })
    );
  });
});
