import { describe, it, expect } from 'vitest';
import { fetchBanResponseBatch } from './localisation-from-geo';
import { GEOCODING_UNAVAILABLE, type NormalizedAddress } from '../domain';

const PAIX: NormalizedAddress = { voie: '10 rue de la paix', code_postal: '75002', commune: 'Paris' };

const ENTETES =
  'voie,codePostal,commune,longitude,latitude,result_score,result_housenumber,result_street,result_postcode,result_citycode,result_city,result_label';

describe('fetchBanResponseBatch', () => {
  it('écarte un résultat dont ni le numéro ni la voie ne sont renseignés', async () => {
    const csvResponse = [
      ENTETES,
      '10 rue de la paix,75002,Paris,2.33115,48.868989,0.95,,,75002,75102,Paris,Paris 2ème Arrondissement'
    ].join('\n');

    const result = await fetchBanResponseBatch([PAIX], [], () => Promise.resolve(csvResponse));

    expect(result[0]).toBeNull();
  });

  it('n’interroge pas la BAN pour une adresse incomplète', async () => {
    const incomplete: NormalizedAddress = { voie: 'Mairie', code_postal: '75002', commune: '' };
    let appelee = false;

    const result = await fetchBanResponseBatch([incomplete], [], () => {
      appelee = true;
      return Promise.resolve(ENTETES);
    });

    expect(appelee).toBe(false);
    expect(result).toEqual([null]);
  });

  it('signale le géocodeur indisponible quand le transport échoue, sans le confondre avec une absence de résultat', async () => {
    const result = await fetchBanResponseBatch([PAIX], [], () => Promise.reject(new Error('Network error')));

    expect(result).toEqual([GEOCODING_UNAVAILABLE]);
  });

  it('signale le géocodeur indisponible quand la réponse CSV est illisible', async () => {
    const result = await fetchBanResponseBatch([PAIX], [], () => Promise.resolve('not valid csv {{{{'));

    expect(result).toEqual([GEOCODING_UNAVAILABLE]);
  });

  it('signale le géocodeur indisponible quand la BAN ne rend aucune ligne pour un lot non vide', async () => {
    const result = await fetchBanResponseBatch([PAIX], [], () => Promise.resolve(ENTETES));

    expect(result).toEqual([GEOCODING_UNAVAILABLE]);
  });
});
