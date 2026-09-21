import { describe, it, expect } from 'vitest';
import { GEOCODING_UNAVAILABLE, getAddressData, isWorthCaching, UNRESOLVED_REASONS } from '.';
import {
  type AddressRecord,
  indexerParEtiquette,
  type LieuxMediationNumeriqueMatching,
  type NormalizedAddress,
  type SourceEvidence
} from '..';

const indexer = indexerParEtiquette;

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

/** La source ne porte aucune coordonnée : rien ne peut corroborer, seul le score décide. */
const SANS_APPORT: SourceEvidence = { origine: 'peu importe' };

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
    const result = await getAddressData(LILAS, STANDARD_MATCHING, SANS_APPORT, reponse([DATASEARCH]))(indexer(AddressesBan));

    expect(result.statut).toBe('from_api');
    expect(result.data).toMatchObject({ 'Adresse postale *': '10 Rue de la Paix', latitude: 48.868989 });
  });

  it('ne retente pas une adresse dont la dernière tentative infructueuse date de moins d’une semaine', async () => {
    const hier: AddressRecord[] = [
      { dateDeTraitement: new Date(Date.now() - 24 * 60 * 60 * 1000), addresseOriginale: '15 rue des Lilas 75008 Paris' }
    ];

    const result = await getAddressData(LILAS, STANDARD_MATCHING, SANS_APPORT, reponse([DATASEARCH]))(indexer(hier));

    expect(result.statut).toBe('from_storage');
    expect(result.data).toBeUndefined();
  });

  it('retente une adresse dont la dernière tentative infructueuse remonte à plus d’une semaine', async () => {
    const leMoisDernier: AddressRecord[] = [
      { dateDeTraitement: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), addresseOriginale: '15 rue des Lilas 75008 Paris' }
    ];

    expect(
      (await getAddressData(LILAS, STANDARD_MATCHING, SANS_APPORT, reponse([DATASEARCH]))(indexer(leMoisDernier))).statut
    ).toBe('from_api');
  });

  it('retente une adresse dont la tentative infructueuse porte une date illisible', async () => {
    const dateCassee: AddressRecord[] = [
      { dateDeTraitement: 'pas une date', addresseOriginale: '15 rue des Lilas 75008 Paris' }
    ];

    expect(
      (await getAddressData(LILAS, STANDARD_MATCHING, SANS_APPORT, reponse([DATASEARCH]))(indexer(dateCassee))).statut
    ).toBe('from_api');
  });

  it('n’inscrit rien au cache quand le géocodeur est indisponible, pour ne pas figer un échec qui n’en est pas un', async () => {
    const result = await getAddressData(LILAS, STANDARD_MATCHING, SANS_APPORT, GEOCODING_UNAVAILABLE)(new Map());

    expect(result.statut).toBe('geocoding_unavailable');
    expect(result.data).toBeUndefined();
  });

  it('sert quand même le cache lorsque le géocodeur est indisponible', async () => {
    const result = await getAddressData(CHALLANS, STANDARD_MATCHING, SANS_APPORT, GEOCODING_UNAVAILABLE)(indexer(AddressesBan));

    expect(result.statut).toBe('from_storage');
    expect(result.data).toMatchObject({ latitude: 46.843771 });
  });

  it('préfère le succès à l’échec quand le cache porte les deux pour une même adresse', async () => {
    const echecPuisSucces: AddressRecord[] = [
      { dateDeTraitement: new Date('2025-10-10T14:50:47.738Z'), addresseOriginale: '18 boulevard rené bazin 85300 Challans' },
      ...AddressesBan
    ];

    const result = await getAddressData(CHALLANS, STANDARD_MATCHING, SANS_APPORT)(indexer(echecPuisSucces));

    expect(result.statut).toBe('from_storage');
    expect(result.data).toMatchObject({ 'Adresse postale *': '18 Boulevard rené bazin', latitude: 46.843771 });
  });

  it('rend les colonnes géocodées quand le cache porte une réponse', async () => {
    const result = await getAddressData(CHALLANS, STANDARD_MATCHING, SANS_APPORT)(indexer(AddressesBan));

    expect(result).toEqual({
      data: {
        latitude: 46.843771,
        longitude: -1.882688,
        'Adresse postale *': '18 Boulevard rené bazin',
        'Code postal': '85300',
        'Ville *': 'Challans',
        'Code INSEE': '85047'
      },
      adresse: {
        voie: '18 Boulevard rené bazin',
        code_postal: '85300',
        code_insee: '85047',
        commune: 'Challans'
      },
      statut: 'from_storage'
    });
  });

  it('ne rend que les colonnes géocodées, les autres champs de la source étant déjà connus de l’appelant', async () => {
    const result = await getAddressData(CHALLANS, STANDARD_MATCHING, SANS_APPORT)(indexer(AddressesBan));

    expect(result.data).not.toHaveProperty('nom');
  });

  it.each([
    ['la voie manque', adresse('', '75001', 'Paris'), ' 75001 Paris'],
    ['la commune manque', adresse('La Réunion', '97400', ''), 'La Réunion 97400 '],
    ['le code postal manque', adresse('La Réunion', '', 'Saint-Denis'), 'La Réunion  Saint-Denis']
  ])('n’interroge pas la BAN quand %s', async (_, incomplete, etiquette) => {
    const result = await getAddressData(incomplete, STANDARD_MATCHING, SANS_APPORT, reponse([DATASEARCH]))(new Map());

    expect(result).toEqual({
      statut: 'no_from_storage',
      addresseOriginale: etiquette,
      motif: UNRESOLVED_REASONS.incomplete
    });
  });

  it('écarte une réponse sans aucune correspondance', async () => {
    const result = await getAddressData(PAIX, STANDARD_MATCHING, SANS_APPORT, reponse([]))(indexer(AddressesBan));

    expect(result).toMatchObject({ statut: 'no_from_storage', addresseOriginale: '10 rue de la paix 75002 Paris' });
  });

  it('écarte une réponse dont le score reste sous le seuil de 0,9', async () => {
    const faible = { ...DATASEARCH, properties: { ...DATASEARCH.properties, score: 0.5 } };

    const result = await getAddressData(PAIX, STANDARD_MATCHING, SANS_APPORT, reponse([faible]))(indexer(AddressesBan));

    expect(result).toMatchObject({ statut: 'no_from_storage', addresseOriginale: '10 rue de la paix 75002 Paris' });
  });

  it('retient une réponse fraîche au dessus du seuil', async () => {
    const result = await getAddressData(PAIX, STANDARD_MATCHING, SANS_APPORT, reponse([DATASEARCH]))(indexer(AddressesBan));

    expect(result).toMatchObject({
      data: { latitude: 48.868989, longitude: 2.33115, 'Adresse postale *': '10 Rue de la Paix' },
      addresseOriginale: '10 rue de la paix 75002 Paris',
      statut: 'from_api'
    });
  });
});

describe('corroboration par les coordonnées de la source', (): void => {
  const faible = { ...DATASEARCH, properties: { ...DATASEARCH.properties, score: 0.62 } };
  // DATASEARCH pointe 48.868989 / 2.33115 ; ce point en est distant d'environ 130 mètres.
  const A_PROXIMITE: SourceEvidence = {
    origine: '10 rue de la paix 75002 Paris',
    localisation: { latitude: 48.8678, longitude: 2.33115 }
  };
  const AU_LOIN: SourceEvidence = {
    origine: '10 rue de la paix 75002 Paris',
    localisation: { latitude: 45.764, longitude: 4.8357 }
  };

  it('retient un rapprochement faible quand la source le corrobore par ses propres coordonnées', async () => {
    const result = await getAddressData(PAIX, STANDARD_MATCHING, A_PROXIMITE, reponse([faible]))(new Map());

    expect(result.statut).toBe('from_api');
    expect(result.data).toMatchObject({ latitude: 48.868989, longitude: 2.33115 });
  });

  it('verse l’adresse d’origine au complément quand seule la proximité a permis de retenir la réponse', async () => {
    const result = await getAddressData(PAIX, STANDARD_MATCHING, A_PROXIMITE, reponse([faible]))(new Map());

    expect(result.data?.['Complement adresse']).toBe('10 rue de la paix 75002 Paris');
  });

  it('concatène l’adresse d’origine au complément déjà renseigné, séparés par un tiret', async () => {
    const avecComplement: SourceEvidence = { ...A_PROXIMITE, complement: 'Bâtiment C' };

    const result = await getAddressData(PAIX, STANDARD_MATCHING, avecComplement, reponse([faible]))(new Map());

    expect(result.data?.['Complement adresse']).toBe('Bâtiment C - 10 rue de la paix 75002 Paris');
  });

  it('ne touche pas au complément quand le score se suffit à lui-même', async () => {
    const result = await getAddressData(PAIX, STANDARD_MATCHING, A_PROXIMITE, reponse([DATASEARCH]))(new Map());

    expect(result.statut).toBe('from_api');
    expect(result.data).not.toHaveProperty('Complement adresse');
  });

  it('écarte un rapprochement faible dont le point est loin de celui de la source', async () => {
    const result = await getAddressData(PAIX, STANDARD_MATCHING, AU_LOIN, reponse([faible]))(new Map());

    expect(result.statut).toBe('no_from_storage');
    expect(result.data).toBeUndefined();
  });

  it('écarte un rapprochement faible quand la source ne porte aucune coordonnée à opposer', async () => {
    const result = await getAddressData(PAIX, STANDARD_MATCHING, SANS_APPORT, reponse([faible]))(new Map());

    expect(result.statut).toBe('no_from_storage');
  });

  it.each([
    ['aucune réponse du référentiel', SANS_APPORT, [], UNRESOLVED_REASONS.neverAnswered],
    ['rapprochement faible sans coordonnées à opposer', SANS_APPORT, [faible], UNRESOLVED_REASONS.tooWeakWithoutCoordinates],
    ['rapprochement faible et point trop éloigné', AU_LOIN, [faible], UNRESOLVED_REASONS.tooWeakAndTooFar]
  ])('dit au rapport pourquoi elle écarte : %s', async (_, apport, features, motif) => {
    const result = await getAddressData(PAIX, STANDARD_MATCHING, apport, reponse(features))(new Map());

    expect(result.motif).toBe(motif);
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

describe('adresse retenue', (): void => {
  const AVEC_COMPLEMENT: SourceEvidence = { origine: '10 rue de la paix 75002 Paris', complement: 'Bâtiment C' };
  const faible = { ...DATASEARCH, properties: { ...DATASEARCH.properties, score: 0.62 } };
  const A_PROXIMITE: SourceEvidence = {
    origine: '10 rue de la paix 75002 Paris',
    complement: 'Bâtiment C',
    localisation: { latitude: 48.8678, longitude: 2.33115 }
  };

  it('rend l’adresse de la Base Adresse Nationale, sans la retoucher', async () => {
    const result = await getAddressData(PAIX, STANDARD_MATCHING, SANS_APPORT, reponse([DATASEARCH]))(new Map());

    expect(result.adresse).toEqual({
      voie: '10 Rue de la Paix',
      code_postal: '75002',
      code_insee: '75102',
      commune: 'Paris'
    });
  });

  it('rend la même adresse qu’elle vienne du cache ou de l’API', async () => {
    const duCache = await getAddressData(CHALLANS, STANDARD_MATCHING, SANS_APPORT)(indexer(AddressesBan));
    const deLApi = await getAddressData(CHALLANS, STANDARD_MATCHING, SANS_APPORT, reponse([]))(new Map());

    expect(duCache.adresse).toEqual({
      voie: '18 Boulevard rené bazin',
      code_postal: '85300',
      code_insee: '85047',
      commune: 'Challans'
    });
    expect(deLApi.adresse).toBeUndefined();
  });

  it('n’en rend aucune quand le référentiel n’a rien répondu', async () => {
    const result = await getAddressData(PAIX, STANDARD_MATCHING, SANS_APPORT, reponse([]))(new Map());

    expect(result.adresse).toBeUndefined();
  });

  it('conserve le complément de la source quand le score se suffit à lui-même', async () => {
    const result = await getAddressData(PAIX, STANDARD_MATCHING, AVEC_COMPLEMENT, reponse([DATASEARCH]))(new Map());

    expect(result.adresse?.complement_adresse).toBe('Bâtiment C');
  });

  it('verse l’adresse d’origine au complément quand seule la proximité a permis de retenir la réponse', async () => {
    const result = await getAddressData(PAIX, STANDARD_MATCHING, A_PROXIMITE, reponse([faible]))(new Map());

    expect(result.adresse?.complement_adresse).toBe('Bâtiment C - 10 rue de la paix 75002 Paris');
  });

  it('n’emprunte jamais le complément au référentiel', async () => {
    const result = await getAddressData(PAIX, STANDARD_MATCHING, SANS_APPORT, reponse([DATASEARCH]))(new Map());

    expect(result.adresse).not.toHaveProperty('complement_adresse');
  });
});
