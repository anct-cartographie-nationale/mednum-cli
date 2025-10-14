import { describe, it, expect, vi, beforeEach, MockedFunction } from 'vitest';
import axios from 'axios';
import { coordinatesByGeocode } from './localisation-from-geo';
import { NO_LOCALISATION } from '../../fields';
import { DataSource, LieuxMediationNumeriqueMatching } from '../../input';
import { AddresseRecord } from '../../history';

vi.mock('axios');

const data: DataSource = {
  'Code postal': '75002',
  'Ville *': 'Paris',
  'Adresse postale *': '10 rue de la paix'
};

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

const AddressesBan: AddresseRecord[] = [
  {
    dateDeTraitement: new Date('2025-10-10T14:50:47.738Z'),
    addresseOriginale: '18 boulevard rené bazin 85300 Challans',
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

const axiosGetDouble = axios.get as MockedFunction<typeof axios.get>;

describe('localisationByGeocode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retourne une localisation corrigé si les coordonée nont pas était banifié et ne faisant pas partie de ceux déjà corrigé', async () => {
    axiosGetDouble.mockResolvedValue({ data: { features: [DATASEARCH] } });

    const result = await coordinatesByGeocode(data, STANDARD_MATCHING)(AddressesBan);

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
      statut: 'corrigé'
    });
  });

  it('retourne une localisation corrigé si les coordonée nont pas était banifié en cas de non résultat ', async () => {
    axiosGetDouble.mockResolvedValue({ data: { features: [] } });

    const result = await coordinatesByGeocode(data, STANDARD_MATCHING)(AddressesBan);

    expect(result).toEqual({ statut: NO_LOCALISATION });
  });

  it('dans le cas où le score est inférieur à 9 ne pas renvoyer  ', async () => {
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

    const result = await coordinatesByGeocode(data, STANDARD_MATCHING)(AddressesBan);

    expect(axiosGetDouble).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      statut: NO_LOCALISATION
    });
  });

  it('dans le cas déjà corrigé alors renvoyer la data corrigé du fichier', async () => {
    const data2: DataSource = {
      latitude: 6649679.61,
      longitude: 328145.77,
      'Adresse postale *': '18 boulevard rené bazin',
      'Code postal': '85300',
      'Ville *': 'Challans',
      'Code INSEE': '85047'
    };
    const result = await coordinatesByGeocode(data2, STANDARD_MATCHING)(AddressesBan);

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
      statut: 'déjà traité'
    });
  });
});
