import { describe, it, expect } from 'vitest';
import { GEOCODING_UNAVAILABLE, getAddressData, isWorthCaching } from './location-enriched';
import type { AddressRecord, LieuxMediationNumeriqueMatching, NormalizedAddress } from './index';

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

const adresse = (voie: string, code_postal: string, commune: string): NormalizedAddress => ({
  voie,
  code_postal,
  commune
});

const CHALLANS: NormalizedAddress = adresse('18 boulevard rené bazin', '85300', 'Challans');
const LILAS: NormalizedAddress = adresse('15 rue des Lilas', '75008', 'Paris');
const PAIX: NormalizedAddress = adresse('10 rue de la paix', '75002', 'Paris');

const AddressesBan: AddressRecord[] = [
  {
    dateDeTraitement: new Date('2025-10-10T14:50:47.738Z'),
    addresseOriginale: '18 boulevard rené bazin 85300 Challans',
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
  { dateDeTraitement: new Date('2025-10-10T14:50:47.738Z'), addresseOriginale: '15 rue des Lilas 75008 Paris' }
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

const reponse = (features: (typeof DATASEARCH)[]) => ({
  data: { type: 'FeatureCollection' as const, features, query: 'peu importe' }
});

describe('getAddressData', (): void => {
  it('retente une adresse dont le cache ne porte aucune réponse, au lieu de la tenir pour connue', async () => {
    const result = await getAddressData(LILAS, STANDARD_MATCHING, reponse([DATASEARCH]))(AddressesBan);

    expect(result.statut).toBe('from_api');
    expect(result.data).toMatchObject({ 'Adresse postale *': '10 Rue de la Paix', latitude: 48.868989 });
  });

  it('ne retente pas une adresse dont la dernière tentative infructueuse date de moins d’une semaine', async () => {
    const hier: AddressRecord[] = [
      { dateDeTraitement: new Date(Date.now() - 24 * 60 * 60 * 1000), addresseOriginale: '15 rue des Lilas 75008 Paris' }
    ];

    const result = await getAddressData(LILAS, STANDARD_MATCHING, reponse([DATASEARCH]))(hier);

    expect(result.statut).toBe('from_storage');
    expect(result.data).toBeUndefined();
  });

  it('retente une adresse dont la dernière tentative infructueuse remonte à plus d’une semaine', async () => {
    const leMoisDernier: AddressRecord[] = [
      { dateDeTraitement: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), addresseOriginale: '15 rue des Lilas 75008 Paris' }
    ];

    expect((await getAddressData(LILAS, STANDARD_MATCHING, reponse([DATASEARCH]))(leMoisDernier)).statut).toBe('from_api');
  });

  it('retente une adresse dont la tentative infructueuse porte une date illisible', async () => {
    const dateCassee: AddressRecord[] = [
      { dateDeTraitement: 'pas une date', addresseOriginale: '15 rue des Lilas 75008 Paris' }
    ];

    expect((await getAddressData(LILAS, STANDARD_MATCHING, reponse([DATASEARCH]))(dateCassee)).statut).toBe('from_api');
  });

  it('n’inscrit rien au cache quand le géocodeur est indisponible, pour ne pas figer un échec qui n’en est pas un', async () => {
    const result = await getAddressData(LILAS, STANDARD_MATCHING, GEOCODING_UNAVAILABLE)([]);

    expect(result.statut).toBe('geocoding_unavailable');
    expect(result.data).toBeUndefined();
  });

  it('sert quand même le cache lorsque le géocodeur est indisponible', async () => {
    const result = await getAddressData(CHALLANS, STANDARD_MATCHING, GEOCODING_UNAVAILABLE)(AddressesBan);

    expect(result.statut).toBe('from_storage');
    expect(result.data).toMatchObject({ latitude: 46.843771 });
  });

  it('préfère le succès à l’échec quand le cache porte les deux pour une même adresse', async () => {
    const echecPuisSucces: AddressRecord[] = [
      { dateDeTraitement: new Date('2025-10-10T14:50:47.738Z'), addresseOriginale: '18 boulevard rené bazin 85300 Challans' },
      ...AddressesBan
    ];

    const result = await getAddressData(CHALLANS, STANDARD_MATCHING)(echecPuisSucces);

    expect(result.statut).toBe('from_storage');
    expect(result.data).toMatchObject({ 'Adresse postale *': '18 Boulevard rené bazin', latitude: 46.843771 });
  });

  it('rend les colonnes géocodées quand le cache porte une réponse', async () => {
    const result = await getAddressData(CHALLANS, STANDARD_MATCHING)(AddressesBan);

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

  it('ne rend que les colonnes géocodées, les autres champs de la source étant déjà connus de l’appelant', async () => {
    const result = await getAddressData(CHALLANS, STANDARD_MATCHING)(AddressesBan);

    expect(result.data).not.toHaveProperty('nom');
  });

  it.each([
    ['la voie manque', adresse('', '75001', 'Paris'), ' 75001 Paris'],
    ['la commune manque', adresse('La Réunion', '97400', ''), 'La Réunion 97400 '],
    ['le code postal manque', adresse('La Réunion', '', 'Saint-Denis'), 'La Réunion  Saint-Denis']
  ])('n’interroge pas la BAN quand %s', async (_, incomplete, etiquette) => {
    const result = await getAddressData(incomplete, STANDARD_MATCHING, reponse([DATASEARCH]))([]);

    expect(result).toEqual({ statut: 'no_from_storage', addresseOriginale: etiquette });
  });

  it('écarte une réponse sans aucune correspondance', async () => {
    const result = await getAddressData(PAIX, STANDARD_MATCHING, reponse([]))(AddressesBan);

    expect(result).toEqual({ statut: 'no_from_storage', addresseOriginale: '10 rue de la paix 75002 Paris' });
  });

  it('écarte une réponse dont le score reste sous le seuil de 0,9', async () => {
    const faible = { ...DATASEARCH, properties: { ...DATASEARCH.properties, score: 0.5 } };

    const result = await getAddressData(PAIX, STANDARD_MATCHING, reponse([faible]))(AddressesBan);

    expect(result).toEqual({ statut: 'no_from_storage', addresseOriginale: '10 rue de la paix 75002 Paris' });
  });

  it('retient une réponse fraîche au dessus du seuil', async () => {
    const result = await getAddressData(PAIX, STANDARD_MATCHING, reponse([DATASEARCH]))(AddressesBan);

    expect(result).toMatchObject({
      data: { latitude: 48.868989, longitude: 2.33115, 'Adresse postale *': '10 Rue de la Paix' },
      addresseOriginale: '10 rue de la paix 75002 Paris',
      statut: 'from_api'
    });
  });
});

describe('isWorthCaching', (): void => {
  it.each([
    ['from_api', true],
    ['no_from_storage', true],
    ['from_storage', false],
    ['geocoding_unavailable', false]
  ] as const)('retient %s pour le cache : %s', (statut, attendu) => {
    expect(isWorthCaching({ statut })).toBe(attendu);
  });
});
