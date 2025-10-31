import { describe, it, expect } from 'vitest';
import { AddressRecord, AddressCache } from './index';
import { Properties } from '../data';

describe('addresses', (): void => {
  it('should create a address report with empty records', (): void => {
    const report = AddressCache();
    expect(report.records()).toStrictEqual([]);
  });

  it('should return as many logs as addresses requested from the address AP', (): void => {
    const data: AddressRecord = {
      dateDeTraitement: new Date('2025-10-09T10:00:00Z'),
      addresseOriginale: '123 Rue Exemple, 75000 Paris',
      responseBan: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [1.234, 45.123]
        },
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
      }
    };
    const address: AddressCache = AddressCache();
    const storage = address.entry(0).record(data).commit();
    address.entry(1).record(data).commit();
    expect(storage.records()).toStrictEqual([
      {
        dateDeTraitement: new Date('2025-10-09T10:00:00Z'),
        addresseOriginale: '123 Rue Exemple, 75000 Paris',
        responseBan: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [1.234, 45.123]
          },
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
          }
        }
      },
      {
        dateDeTraitement: new Date('2025-10-09T10:00:00Z'),
        addresseOriginale: '123 Rue Exemple, 75000 Paris',
        responseBan: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [1.234, 45.123]
          },
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
          }
        }
      }
    ]);
  });
});
