/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, Source } from '../../input';
import { processLocalisation } from './localisation.field';

const STANDARD_MATCHING: LieuxMediationNumeriqueMatching = {
  latitude: {
    colonne: 'bf_latitude'
  },
  longitude: {
    colonne: 'bf_longitude'
  }
} as LieuxMediationNumeriqueMatching;

const JOINED_LATITUDE_AND_LONGITUDE_MATCHING: LieuxMediationNumeriqueMatching = {
  latitude: {
    dissocier: {
      colonne: 'Geo Point',
      séparateur: ',',
      partie: 0
    }
  },
  longitude: {
    dissocier: {
      colonne: 'Geo Point',
      séparateur: ',',
      partie: 1
    }
  }
} as LieuxMediationNumeriqueMatching;

describe('localisation field', (): void => {
  it('should process localisation form source', (): void => {
    const source: Source = {
      bf_latitude: '0',
      bf_longitude: '0'
    };

    const localisation: Localisation = processLocalisation(source, STANDARD_MATCHING);

    expect(localisation).toStrictEqual<Localisation>(
      Localisation({
        latitude: 0,
        longitude: 0
      })
    );
  });

  it('should process localisation form source with associated latitude and longitude', (): void => {
    const source: Source = {
      'Geo Point': '47.29212184845607,0.02176010906045345'
    };

    const localisation: Localisation = processLocalisation(source, JOINED_LATITUDE_AND_LONGITUDE_MATCHING);

    expect(localisation).toStrictEqual<Localisation>(
      Localisation({
        latitude: 47.29212184845607,
        longitude: 0.02176010906045345
      })
    );
  });
});
