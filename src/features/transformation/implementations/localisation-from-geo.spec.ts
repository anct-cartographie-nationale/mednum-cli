import { describe, it, expect } from 'vitest';
import { fetchBanResponseBatch } from './localisation-from-geo';
import { GEOCODING_UNAVAILABLE, type DataSource, type LieuxMediationNumeriqueMatching } from '../domain';

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

  it('signale le géocodeur indisponible quand le transport échoue, sans le confondre avec une absence de résultat', async () => {
    const responsesBanAll = () => Promise.reject(new Error('Network error'));

    const result = await fetchBanResponseBatch([data], STANDARD_MATCHING, [], responsesBanAll);

    expect(result).toEqual([GEOCODING_UNAVAILABLE]);
  });

  it('signale le géocodeur indisponible quand la réponse CSV est illisible', async () => {
    const responsesBanAll = () => Promise.resolve('not valid csv {{{{');

    const result = await fetchBanResponseBatch([data], STANDARD_MATCHING, [], responsesBanAll);

    expect(result).toEqual([GEOCODING_UNAVAILABLE]);
  });

  it('signale le géocodeur indisponible quand la BAN ne rend aucune ligne pour un lot non vide', async () => {
    const entetesSeules =
      'voie,codePostal,commune,longitude,latitude,result_score,result_housenumber,result_street,result_postcode,result_citycode,result_city,result_label';
    const responsesBanAll = () => Promise.resolve(entetesSeules);

    const result = await fetchBanResponseBatch([data], STANDARD_MATCHING, [], responsesBanAll);

    expect(result).toEqual([GEOCODING_UNAVAILABLE]);
  });
});
