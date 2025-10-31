import { describe, it, expect, vi, beforeEach, MockedFunction } from 'vitest';
import axios from 'axios';
import { getAddressData } from './localisation-from-geo';
import { DataSource, LieuxMediationNumeriqueMatching } from '../../input';
import { AddressRecord } from '../../storage';

vi.mock('axios');

const STANDARD_MATCHING: LieuxMediationNumeriqueMatching = {
  code_postal: {
    colonne: 'Code postal'
  },
  commune: {
    colonne: 'Ville *'
  },
  adresse: {
    colonne: 'Adresse postale *'
  },
  complement_adresse: {
    colonne: 'Complement adresse'
  },
  code_insee: {
    colonne: 'Code INSEE'
  },
  latitude: {
    colonne: 'latitude'
  },
  longitude: {
    colonne: 'longitude'
  }
} as LieuxMediationNumeriqueMatching;

const AddressesBan: AddressRecord[] = [
  {
    dateDeTraitement: new Date('2025-10-10T14:50:47.738Z'),
    addresseOriginale: '- 18 boulevard rené bazin 85300 Challans',
    responseBan: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-1.882688, 46.843771]
      },
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
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [2.33115, 48.868989]
  },
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
    district: 'Paris 2e Arrondissement',
    context: '75, Paris, Île-de-France',
    type: 'housenumber',
    importance: 0.60611,
    street: 'Rue de la Paix',
    _type: 'address'
  }
};

const data: DataSource = {
  'Code postal': '75002',
  'Ville *': 'Paris',
  'Adresse postale *': '- 10 rue de la paix'
};

const axiosGetDouble = axios.get as MockedFunction<typeof axios.get>;

describe('localisation-from-geo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the original, unbanned address when the address exists in addresses.json and the address API is not called', async () => {
    const dataSource: DataSource = {
      latitude: 6649679.61,
      longitude: 328145.77,
      'Adresse postale *': '- 15 rue des Lilas',
      'Code postal': '75008',
      'Ville *': 'Paris',
      'Code INSEE': '75108'
    };
    const result = await getAddressData(dataSource, STANDARD_MATCHING)(AddressesBan);

    expect(axiosGetDouble).not.toHaveBeenCalled();
    expect(result).toEqual({
      statut: 'from_storage',
      addresseOriginale: '- 15 rue des Lilas 75008 Paris'
    });
  });

  it('should return a location and a standardized address when the address exists in addresses.json and the address API is not called', async () => {
    const dataSource: DataSource = {
      latitude: 6649679.61,
      longitude: 328145.77,
      'Adresse postale *': '- 18 boulevard rené bazin',
      'Code postal': '85300',
      'Ville *': 'Challans',
      'Code INSEE': '85047'
    };
    const result = await getAddressData(dataSource, STANDARD_MATCHING)(AddressesBan);

    expect(axiosGetDouble).not.toHaveBeenCalled();
    expect(result).toEqual({
      data: {
        latitude: -1.882688,
        longitude: 46.843771,
        'Adresse postale *': '18 Boulevard rené bazin',
        'Code postal': '85300',
        'Ville *': 'Challans',
        'Code INSEE': '85047'
      },
      statut: 'from_storage'
    });
  });

  it('should return the original, unbanned address when the address does not exist in addresses.json and the address API is called', async () => {
    const dataSource: DataSource = {
      latitude: 6649679.61,
      longitude: 328145.77,
      'Adresse postale *': '-',
      'Code postal': ' ',
      'Ville *': ' ',
      'Code INSEE': '75108'
    };
    const result = await getAddressData(dataSource, STANDARD_MATCHING)(AddressesBan);

    expect(axiosGetDouble).toHaveBeenCalledTimes(0);
    expect(result).toEqual({
      statut: 'no_from_storage',
      addresseOriginale: '-    '
    });
  });

  it('should return the original, unbanned address when the address does not exist in addresses.json and the address API is called, but it generates an error.', async () => {
    axiosGetDouble.mockRejectedValue(new Error('Network error'));
    const dataSource: DataSource = {
      latitude: 6649679.61,
      longitude: 328145.77,
      'Adresse postale *': 'ex. 15 rue des Lilas',
      'Code postal': '75008',
      'Ville *': 'Paris',
      'Code INSEE': '75108'
    };
    const result = await getAddressData(dataSource, STANDARD_MATCHING)(AddressesBan);

    expect(axiosGetDouble).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      statut: 'no_from_storage',
      addresseOriginale: 'ex. 15 rue des Lilas 75008 Paris'
    });
  });

  it('should return null when the address does not exist in addresses.json and the address API returns no result', async () => {
    axiosGetDouble.mockResolvedValue({ data: { features: [] } });

    const result = await getAddressData(data, STANDARD_MATCHING)(AddressesBan);

    expect(axiosGetDouble).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      statut: 'no_from_storage',
      addresseOriginale: '- 10 rue de la paix 75002 Paris'
    });
  });

  it('should return null when the address does not exist in addresses.json and the first score in the API response is lower than 9', async () => {
    axiosGetDouble.mockResolvedValue({
      data: {
        features: [
          {
            ...DATASEARCH,
            properties: {
              ...DATASEARCH.properties,
              score: 0.5
            }
          }
        ]
      }
    });

    const result = await getAddressData(data, STANDARD_MATCHING)(AddressesBan);

    expect(axiosGetDouble).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      statut: 'no_from_storage',
      addresseOriginale: '- 10 rue de la paix 75002 Paris'
    });
  });

  it('should return a location and a standardized address when the address does not exist in addresses.json and the address API is called', async () => {
    axiosGetDouble.mockResolvedValue({ data: { features: [DATASEARCH] } });

    const result = await getAddressData(data, STANDARD_MATCHING)(AddressesBan);

    expect(axiosGetDouble).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      data: {
        latitude: 48.868989,
        longitude: 2.33115,
        'Adresse postale *': '10 Rue de la Paix',
        'Code postal': '75002',
        'Ville *': 'Paris',
        'Code INSEE': '75102'
      },
      responses: { features: [DATASEARCH] },
      addresseOriginale: '- 10 rue de la paix 75002 Paris',
      statut: 'from_api'
    });
  });
});
