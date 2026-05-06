import { describe, it, expect } from 'vitest';
import { getAddressData, fetchBanResponse, FeatureCollection } from './localisation-from-geo';
import { DataSource, LieuxMediationNumeriqueMatching } from '../../input';
import { AddressRecord } from '../../storage';

const STANDARD_MATCHING: LieuxMediationNumeriqueMatching = {
  nom: { colonne: 'nom' },
  code_postal: { colonne: 'Code postal' },
  commune: { colonne: 'Ville *' },
  adresse: { colonne: 'Adresse postale *' },
  complement_adresse: { colonne: 'Complement adresse' },
  code_insee: { colonne: 'Code INSEE' },
  latitude: { colonne: 'latitude' },
  longitude: { colonne: 'longitude' }
} as LieuxMediationNumeriqueMatching;

const AddressesBan: AddressRecord[] = [
  {
    dateDeTraitement: new Date('2025-10-10T14:50:47.738Z'),
    addresseOriginale: '- 18 boulevard rené bazin 85300 Challans',
    responseBan: {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-1.882688, 46.843771] },
      properties: {
        label: '18 Boulevard rené bazin 85300 Challans',
        score: 0.963110909090909,
        housenumber: '18',
        id: '85047_8850_00018',
        name: '18 Boulevard rené bazin',
        postcode: '85300',
        citycode: '85047',
        x: 328145.77,
        y: 6649679.61,
        city: 'Challans',
        context: '85, Vendée, Pays de la Loire',
        type: 'housenumber',
        importance: 0.59422,
        street: 'Boulevard rené bazin'
      }
    }
  },
  {
    dateDeTraitement: new Date('2025-10-10T14:50:47.738Z'),
    addresseOriginale: '- 15 rue des Lilas 75008 Paris'
  }
];

const DATASEARCH = {
  type: 'Feature' as const,
  geometry: { type: 'Point' as const, coordinates: [2.33115, 48.868989] as [number, number] },
  properties: {
    label: '10 Rue de la Paix 75002 Paris',
    score: 0.964191818181818,
    housenumber: '10',
    id: '75102_6998_00010',
    name: '10 Rue de la Paix',
    postcode: '75002',
    citycode: '75102',
    x: 650936.23,
    y: 6863425.69,
    city: 'Paris',
    context: '75, Paris, Île-de-France',
    type: 'housenumber' as const,
    importance: 0.60611,
    street: 'Rue de la Paix'
  }
};

const data: DataSource = {
  'Code postal': '75002',
  'Ville *': 'Paris',
  'Adresse postale *': '- 10 rue de la paix'
};

describe('localisation-from-geo', () => {
  it('should return from_storage without data when address exists in cache without BAN response', async () => {
    const dataSource: DataSource = {
      latitude: 6649679.61,
      longitude: 328145.77,
      'Adresse postale *': '- 15 rue des Lilas',
      'Code postal': '75008',
      'Ville *': 'Paris',
      'Code INSEE': '75108'
    };

    const result = await getAddressData(dataSource, STANDARD_MATCHING)(AddressesBan);

    expect(result).toEqual({
      statut: 'from_storage',
      addresseOriginale: '- 15 rue des Lilas 75008 Paris'
    });
  });

  it('should return from_storage with enriched data when address exists in cache with BAN response', async () => {
    const dataSource: DataSource = {
      latitude: 6649679.61,
      longitude: 328145.77,
      'Adresse postale *': '- 18 boulevard rené bazin',
      'Code postal': '85300',
      'Ville *': 'Challans',
      'Code INSEE': '85047'
    };

    const result = await getAddressData(dataSource, STANDARD_MATCHING)(AddressesBan);

    expect(result).toEqual({
      data: {
        latitude: 46.843771,
        longitude: -1.882688,
        'Adresse postale *': '18 Boulevard rené bazin',
        'Code postal': '85300',
        'Ville *': 'Challans',
        'Code INSEE': '85047'
      },
      statut: 'from_storage'
    });
  });

  it('should return no_from_storage when adresse is null', async () => {
    const dataSource: DataSource = {
      'Adresse postale *': null,
      'Code postal': '75001',
      'Ville *': 'Paris',
      'Code INSEE': '75056'
    };

    const result = await getAddressData(dataSource, STANDARD_MATCHING)(AddressesBan);

    expect(result).toEqual({ statut: 'no_from_storage', addresseOriginale: 'null 75001 Paris' });
  });

  it('should return no_from_storage when commune is null', async () => {
    const dataSource: DataSource = {
      'Adresse postale *': 'La Réunion',
      'Code postal': '97400',
      'Ville *': null,
      'Code INSEE': null
    };

    const result = await getAddressData(dataSource, STANDARD_MATCHING)(AddressesBan);

    expect(result).toEqual({ statut: 'no_from_storage', addresseOriginale: 'La Réunion 97400 null' });
  });

  it('should return no_from_storage when code_postal is null', async () => {
    const dataSource: DataSource = {
      'Adresse postale *': 'La Réunion',
      'Code postal': null,
      'Ville *': 'Saint-Denis',
      'Code INSEE': null
    };

    const result = await getAddressData(dataSource, STANDARD_MATCHING)(AddressesBan);

    expect(result).toEqual({ statut: 'no_from_storage', addresseOriginale: 'La Réunion null Saint-Denis' });
  });

  it('should return no_from_storage when API response has no features', async () => {
    const axiosResponse = {
      data: { type: 'FeatureCollection' as const, features: [], query: '10 rue de la paix 75002 Paris' }
    };

    const result = await getAddressData(data, STANDARD_MATCHING, axiosResponse)(AddressesBan);

    expect(result).toEqual({ statut: 'no_from_storage', addresseOriginale: '- 10 rue de la paix 75002 Paris' });
  });

  it('should return no_from_storage when API response score is below 0.9', async () => {
    const axiosResponse = {
      data: {
        type: 'FeatureCollection' as const,
        features: [{ ...DATASEARCH, properties: { ...DATASEARCH.properties, score: 0.5 } }],
        query: '10 rue de la paix 75002 Paris'
      }
    };

    const result = await getAddressData(data, STANDARD_MATCHING, axiosResponse)(AddressesBan);

    expect(result).toEqual({ statut: 'no_from_storage', addresseOriginale: '- 10 rue de la paix 75002 Paris' });
  });

  it('should return from_api with enriched data when API response is valid', async () => {
    const axiosResponse = {
      data: { type: 'FeatureCollection' as const, features: [DATASEARCH], query: '10 rue de la paix 75002 Paris' }
    };

    const result = await getAddressData(data, STANDARD_MATCHING, axiosResponse)(AddressesBan);

    expect(result).toEqual({
      data: {
        latitude: 48.868989,
        longitude: 2.33115,
        'Adresse postale *': '10 Rue de la Paix',
        'Code postal': '75002',
        'Ville *': 'Paris',
        'Code INSEE': '75102'
      },
      responses: { type: 'FeatureCollection' as const, features: [DATASEARCH], query: '10 rue de la paix 75002 Paris' },
      addresseOriginale: '- 10 rue de la paix 75002 Paris',
      statut: 'from_api'
    });
  });
});

const AXIOS_RESPONSE: { data: FeatureCollection } = {
  data: { type: 'FeatureCollection' as const, features: [DATASEARCH], query: '10 rue de la paix 75002 Paris' }
};

describe('fetchBanResponse', () => {
  it('should return null when address is already in cache', async () => {
    const dataSource: DataSource = {
      'Adresse postale *': '- 18 boulevard rené bazin',
      'Code postal': '85300',
      'Ville *': 'Challans',
      'Code INSEE': '85047'
    };
    const httpGet = () => Promise.resolve(AXIOS_RESPONSE);

    const result = await fetchBanResponse(dataSource, STANDARD_MATCHING, AddressesBan, httpGet);

    expect(result).toBeNull();
  });

  it('should return null when commune is null', async () => {
    const dataSource: DataSource = {
      'Adresse postale *': '10 rue de la paix',
      'Code postal': '75002',
      'Ville *': null
    };
    const httpGet = () => Promise.resolve(AXIOS_RESPONSE);

    const result = await fetchBanResponse(dataSource, STANDARD_MATCHING, AddressesBan, httpGet);

    expect(result).toBeNull();
  });

  it('should return null when code_postal is null', async () => {
    const dataSource: DataSource = {
      'Adresse postale *': '10 rue de la paix',
      'Code postal': null,
      'Ville *': 'Paris'
    };
    const httpGet = () => Promise.resolve(AXIOS_RESPONSE);

    const result = await fetchBanResponse(dataSource, STANDARD_MATCHING, AddressesBan, httpGet);

    expect(result).toBeNull();
  });

  it('should return null when voie is empty', async () => {
    const dataSource: DataSource = {
      'Adresse postale *': null,
      'Code postal': '75002',
      'Ville *': 'Paris'
    };
    const httpGet = () => Promise.resolve(AXIOS_RESPONSE);

    const result = await fetchBanResponse(dataSource, STANDARD_MATCHING, AddressesBan, httpGet);

    expect(result).toBeNull();
  });

  it('should call httpGet and return response when address is valid and not in cache', async () => {
    const httpGet = () => Promise.resolve(AXIOS_RESPONSE);

    const result = await fetchBanResponse(data, STANDARD_MATCHING, AddressesBan, httpGet);

    expect(result).toEqual(AXIOS_RESPONSE);
  });
});
