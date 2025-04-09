import { describe, it, expect } from 'vitest';
import { Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { NO_LOCALISATION, processLocalisation } from './localisation.field';

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

const JOINED_LATITUDE_AND_LONGITUDE_MATCHING_DIFFERENT_SEPARATOR: LieuxMediationNumeriqueMatching = {
  latitude: {
    dissocier: {
      colonne: 'Geo Point',
      séparateur: ' ',
      partie: 1
    }
  },
  longitude: {
    dissocier: {
      colonne: 'Geo Point',
      séparateur: ' ',
      partie: 0
    }
  }
} as LieuxMediationNumeriqueMatching;

const GEOCODE_MATCHING: LieuxMediationNumeriqueMatching = {
  latitude: {
    colonne: 'bf_latitude'
  },
  longitude: {
    colonne: 'bf_longitude'
  },
  commune: {
    colonne: 'commune'
  },
  code_postal: {
    colonne: 'code_postal'
  },
  adresse: {
    colonne: 'adresse'
  }
} as LieuxMediationNumeriqueMatching;

const GEOCODE_ADDRESS_SUCCESS: () => Promise<Localisation> = async (): Promise<Localisation> =>
  Promise.resolve(
    Localisation({
      latitude: 48.850699,
      longitude: 2.308628
    })
  );

const GEOCODE_ADDRESS_ERROR: () => Promise<Localisation> = async (): Promise<Localisation> => Promise.resolve(NO_LOCALISATION);

describe('localisation field', (): void => {
  it('should process localisation form source', async (): Promise<void> => {
    const source: DataSource = {
      bf_latitude: '47.29212184845607',
      bf_longitude: '0.02176010906045345'
    };

    const localisation: Localisation = await processLocalisation(source, STANDARD_MATCHING, GEOCODE_ADDRESS_SUCCESS);

    expect(localisation).toStrictEqual<Localisation>(
      Localisation({
        latitude: 47.29212184845607,
        longitude: 0.02176010906045345
      })
    );
  });

  it('should process localisation with coma form source', async (): Promise<void> => {
    const source: DataSource = {
      bf_latitude: '47,29212184845607',
      bf_longitude: '0,02176010906045345'
    };

    const localisation: Localisation = await processLocalisation(source, STANDARD_MATCHING, GEOCODE_ADDRESS_SUCCESS);

    expect(localisation).toStrictEqual<Localisation>(
      Localisation({
        latitude: 47.29212184845607,
        longitude: 0.02176010906045345
      })
    );
  });

  it('should process localisation form source with associated latitude and longitude', async (): Promise<void> => {
    const source: DataSource = {
      'Geo Point': '47.29212184845607,0.02176010906045345'
    };

    const localisation: Localisation = await processLocalisation(
      source,
      JOINED_LATITUDE_AND_LONGITUDE_MATCHING,
      GEOCODE_ADDRESS_SUCCESS
    );

    expect(localisation).toStrictEqual<Localisation>(
      Localisation({
        latitude: 47.29212184845607,
        longitude: 0.02176010906045345
      })
    );
  });

  it('should process localisation form source with associated latitude and longitude and others charactere in it', async (): Promise<void> => {
    const source: DataSource = {
      'Geo Point': 'POINT (-0.49316 43.89695)'
    };

    const localisation: Localisation = await processLocalisation(
      source,
      JOINED_LATITUDE_AND_LONGITUDE_MATCHING_DIFFERENT_SEPARATOR,
      GEOCODE_ADDRESS_SUCCESS
    );

    expect(localisation).toStrictEqual<Localisation>(
      Localisation({
        latitude: 43.89695,
        longitude: -0.49316
      })
    );
  });

  it('should convert coordindates geographique projection legal to validate coordinates', async (): Promise<void> => {
    const source: DataSource = {
      bf_latitude: '6789183.34',
      bf_longitude: '352113.49'
    };
    const localisation: Localisation = await processLocalisation(source, STANDARD_MATCHING, GEOCODE_ADDRESS_SUCCESS);

    expect(localisation).toStrictEqual<Localisation>(
      Localisation({
        latitude: 48.1102680182028,
        longitude: -1.6770949916427347
      })
    );
  });

  it('should return NO_LOCALISATION if geocode return undefined', async (): Promise<void> => {
    const source: DataSource = {
      bf_latitude: '',
      bf_longitude: '',
      commune: 'Paris',
      code_postal: '01568',
      adresse: 'no adresse'
    };

    const localisation: Localisation = await processLocalisation(source, GEOCODE_MATCHING, GEOCODE_ADDRESS_ERROR);

    expect(localisation).toStrictEqual<Localisation>(NO_LOCALISATION);
  });

  it('should return NO_LOCALISATION when coordinates have 0 as value', async (): Promise<void> => {
    const source: DataSource = {
      bf_latitude: '0',
      bf_longitude: '0'
    };
    const localisation: Localisation = await processLocalisation(source, STANDARD_MATCHING, GEOCODE_ADDRESS_ERROR);

    expect(localisation).toStrictEqual<Localisation>(NO_LOCALISATION);
  });
});
