import { describe, it, expect } from 'vitest';
import { AddresseReport } from './index';
import { Properties } from '../data';

describe('addresse', (): void => {
  it('should create a addresse report with empty records', (): void => {
    const report = AddresseReport();
    expect(report.records()).toStrictEqual([]);
  });

  it('....', (): void => {
    const report = AddresseReport()
      .entry(0)
      .record({
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
      })
      .commit();

    expect(report.records()).toStrictEqual([
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
