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

describe('lot dégradé', (): void => {
  const adresse = (rang: number): NormalizedAddress => ({
    voie: `${rang} rue de la paix`,
    code_postal: '75002',
    commune: 'Paris'
  });

  const ligneTrouvee = (rang: number): string =>
    `${rang} rue de la paix,75002,Paris,2.33115,48.868989,0.95,${rang},Rue de la Paix,75002,75102,Paris,${rang} Rue de la Paix`;

  const ligneMuette = (rang: number): string => `${rang} rue de la paix,75002,Paris,,,0,,,,,,`;

  const reponse = (muettes: number, trouvees: number): string =>
    [
      ENTETES,
      ...Array.from({ length: muettes }, (_: unknown, i: number): string => ligneMuette(i)),
      ...Array.from({ length: trouvees }, (_: unknown, i: number): string => ligneTrouvee(muettes + i))
    ].join('\n');

  const adresses = (nombre: number): NormalizedAddress[] =>
    Array.from({ length: nombre }, (_: unknown, i: number): NormalizedAddress => adresse(i));

  it('déclare le géocodeur indisponible plutôt que d’inscrire au cache des échecs qui n’en sont pas', async (): Promise<void> => {
    const result = await fetchBanResponseBatch(adresses(40), [], () => Promise.resolve(reponse(28, 12)));

    expect(result.slice(0, 28)).toStrictEqual(Array.from({ length: 28 }, () => GEOCODING_UNAVAILABLE));
  });

  it('retient tout de même les lignes qu’un lot dégradé a su résoudre', async (): Promise<void> => {
    const result = await fetchBanResponseBatch(adresses(40), [], () => Promise.resolve(reponse(28, 12)));

    expect(result.slice(28).every((reponse: unknown): boolean => reponse != null && reponse !== GEOCODING_UNAVAILABLE)).toBe(
      true
    );
  });

  it('laisse un lot sain inscrire ses rares échecs au cache', async (): Promise<void> => {
    const result = await fetchBanResponseBatch(adresses(40), [], () => Promise.resolve(reponse(2, 38)));

    expect(result.slice(0, 2)).toStrictEqual([null, null]);
  });

  it('ne juge pas un lot trop court pour que la proportion veuille dire quelque chose', async (): Promise<void> => {
    const result = await fetchBanResponseBatch(adresses(4), [], () => Promise.resolve(reponse(3, 1)));

    expect(result.slice(0, 3)).toStrictEqual([null, null, null]);
  });
});
