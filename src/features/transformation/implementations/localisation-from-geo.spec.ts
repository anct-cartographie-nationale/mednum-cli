import { describe, it, expect } from 'vitest';
import { fetchBanResponseBatch } from './localisation-from-geo.js';
import type { DataSource, LieuxMediationNumeriqueMatching } from '../domain/index.js';

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

const data: DataSource = {
  'Code postal': '75002',
  'Ville *': 'Paris',
  'Adresse postale *': '- 10 rue de la paix'
};

describe('fetchBanResponseBatch', () => {
  it('should return null when housenumber and street are both empty (locality/municipality type)', async () => {
    const csvResponse = [
      'voie,codePostal,commune,longitude,latitude,result_score,result_housenumber,result_street,result_postcode,result_citycode,result_city,result_label',
      '10 rue de la paix,75002,Paris,2.33115,48.868989,0.95,,,75002,75102,Paris,Paris 2ème Arrondissement'
    ].join('\n');
    const responsesBanAll = () => Promise.resolve(csvResponse);

    const result = await fetchBanResponseBatch([data], STANDARD_MATCHING, [], responsesBanAll);

    expect(result[0]).toBeNull();
  });

  it('should return null for all items when responsesBanAll throws a network error', async () => {
    const responsesBanAll = () => Promise.reject(new Error('Network error'));

    const result = await fetchBanResponseBatch([data], STANDARD_MATCHING, [], responsesBanAll);

    expect(result).toEqual([null]);
  });

  it('should return null for all items when csv response is malformed', async () => {
    const responsesBanAll = () => Promise.resolve('not valid csv {{{{');

    const result = await fetchBanResponseBatch([data], STANDARD_MATCHING, [], responsesBanAll);

    expect(result).toEqual([null]);
  });
});
