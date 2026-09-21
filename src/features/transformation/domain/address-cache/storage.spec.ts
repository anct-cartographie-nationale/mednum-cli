import { describe, it, expect } from 'vitest';
import { type AddressRecord, AddressCache, indexerParEtiquette } from './index';
import type { Properties } from '../../../../libraries/ban';

describe('addresses', (): void => {
  it('should create a address cache with empty records', (): void => {
    const cache = AddressCache();
    expect(cache.records()).toStrictEqual([]);
  });

  const FEATURE = {
    type: 'Feature' as const,
    geometry: { type: 'Point' as const, coordinates: [1.234, 45.123] as [number, number] },
    properties: {
      label: '123 Rue Exemple, 75000 Paris',
      score: 0.99,
      citycode: '75056',
      postcode: '75000',
      city: 'Paris',
      context: '75, Île-de-France',
      type: 'housenumber',
      importance: 0.5,
      id: '75123_123'
    } as Properties
  };

  const GEOCODEE: AddressRecord = {
    dateDeTraitement: new Date('2025-10-09T10:00:00Z'),
    addresseOriginale: '123 Rue Exemple, 75000 Paris',
    responseBan: FEATURE
  };

  const SANS_REPONSE: AddressRecord = {
    dateDeTraitement: new Date('2025-10-10T10:00:00Z'),
    addresseOriginale: '123 Rue Exemple, 75000 Paris'
  };

  it('ne garde qu’une entrée pour une adresse enregistrée plusieurs fois', (): void => {
    const cache: AddressCache = AddressCache();

    cache.entry(0).record(GEOCODEE).commit();
    cache.entry(1).record(GEOCODEE).commit();

    expect(cache.records()).toStrictEqual([GEOCODEE]);
  });

  it('ne laisse pas une tentative infructueuse effacer un géocodage connu', (): void => {
    const cache: AddressCache = AddressCache();

    cache.entry(0).record(GEOCODEE).commit();
    cache.entry(1).record(SANS_REPONSE).commit();

    expect(cache.records()).toStrictEqual([GEOCODEE]);
  });

  it('remplace une tentative infructueuse par le géocodage qui lui succède', (): void => {
    const cache: AddressCache = AddressCache();

    cache.entry(0).record(SANS_REPONSE).commit();
    cache.entry(1).record(GEOCODEE).commit();

    expect(cache.records()).toStrictEqual([GEOCODEE]);
  });

  it('garde une entrée par adresse distincte', (): void => {
    const cache: AddressCache = AddressCache();

    cache.entry(0).record(GEOCODEE).commit();
    cache
      .entry(1)
      .record({ ...SANS_REPONSE, addresseOriginale: '9 Avenue Ailleurs, 69000 Lyon' })
      .commit();

    expect(cache.records()).toHaveLength(2);
  });

  it('déduplique les entrées reçues à la construction, le géocodage l’emportant', (): void => {
    const cache: AddressCache = AddressCache([SANS_REPONSE, GEOCODEE, SANS_REPONSE]);

    expect(cache.records()).toStrictEqual([GEOCODEE]);
  });
});

describe('indexerParEtiquette', (): void => {
  const echec = (etiquette: string): AddressRecord => ({
    addresseOriginale: etiquette,
    dateDeTraitement: '2026-09-21T00:00:00.000Z'
  });

  const succes = (etiquette: string): AddressRecord => ({
    addresseOriginale: etiquette,
    dateDeTraitement: '2026-09-21T00:00:00.000Z',
    responseBan: { properties: { score: 0.95 } } as AddressRecord['responseBan']
  });

  it('rend une entrée par étiquette', (): void => {
    expect(indexerParEtiquette([echec('a'), echec('b'), echec('a')]).size).toBe(2);
  });

  it('retrouve une entrée sans parcourir le cache', (): void => {
    expect(indexerParEtiquette([echec('a'), echec('b')]).get('b')).toStrictEqual(echec('b'));
  });

  it('garde le géocodage quand la même étiquette revient en échec après une réussite', (): void => {
    expect(indexerParEtiquette([succes('a'), echec('a')]).get('a')?.responseBan).toBeDefined();
  });

  it('garde le géocodage quand la réussite arrive après l’échec', (): void => {
    expect(indexerParEtiquette([echec('a'), succes('a')]).get('a')?.responseBan).toBeDefined();
  });

  it('rend un index vide pour un cache vide', (): void => {
    expect(indexerParEtiquette([]).size).toBe(0);
  });
});
