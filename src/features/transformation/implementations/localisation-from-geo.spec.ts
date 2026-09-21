import { describe, it, expect } from 'vitest';
import { fetchBanResponseBatch } from './localisation-from-geo';
import { type AddressIndex, type AddressRecord, GEOCODING_UNAVAILABLE, type NormalizedAddress } from '../domain';

const SANS_CACHE: AddressIndex = new Map();

const PAIX: NormalizedAddress = { voie: '10 rue de la paix', code_postal: '75002', commune: 'Paris' };

const ENTETES =
  'voie,codePostal,commune,longitude,latitude,result_score,result_housenumber,result_street,result_postcode,result_citycode,result_city,result_label';

describe('fetchBanResponseBatch', () => {
  it('écarte un résultat dont ni le numéro ni la voie ne sont renseignés', async () => {
    const csvResponse = [
      ENTETES,
      '10 rue de la paix,75002,Paris,2.33115,48.868989,0.95,,,75002,75102,Paris,Paris 2ème Arrondissement'
    ].join('\n');

    const result = await fetchBanResponseBatch([PAIX], SANS_CACHE, () => Promise.resolve(csvResponse));

    expect(result[0]).toBeNull();
  });

  it('n’interroge pas la BAN pour une adresse incomplète', async () => {
    const incomplete: NormalizedAddress = { voie: 'Mairie', code_postal: '75002', commune: '' };
    let appelee = false;

    const result = await fetchBanResponseBatch([incomplete], SANS_CACHE, () => {
      appelee = true;
      return Promise.resolve(ENTETES);
    });

    expect(appelee).toBe(false);
    expect(result).toEqual([null]);
  });

  it('signale le géocodeur indisponible quand le transport échoue, sans le confondre avec une absence de résultat', async () => {
    const result = await fetchBanResponseBatch([PAIX], SANS_CACHE, () => Promise.reject(new Error('Network error')));

    expect(result).toEqual([GEOCODING_UNAVAILABLE]);
  });

  it('signale le géocodeur indisponible quand la réponse CSV est illisible', async () => {
    const result = await fetchBanResponseBatch([PAIX], SANS_CACHE, () => Promise.resolve('not valid csv {{{{'));

    expect(result).toEqual([GEOCODING_UNAVAILABLE]);
  });

  it('signale le géocodeur indisponible quand la BAN ne rend aucune ligne pour un lot non vide', async () => {
    const result = await fetchBanResponseBatch([PAIX], SANS_CACHE, () => Promise.resolve(ENTETES));

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
    const result = await fetchBanResponseBatch(adresses(40), SANS_CACHE, () => Promise.resolve(reponse(28, 12)));

    expect(result.slice(0, 28)).toStrictEqual(Array.from({ length: 28 }, () => GEOCODING_UNAVAILABLE));
  });

  it('retient tout de même les lignes qu’un lot dégradé a su résoudre', async (): Promise<void> => {
    const result = await fetchBanResponseBatch(adresses(40), SANS_CACHE, () => Promise.resolve(reponse(28, 12)));

    expect(result.slice(28).every((reponse: unknown): boolean => reponse != null && reponse !== GEOCODING_UNAVAILABLE)).toBe(
      true
    );
  });

  it('laisse un lot sain inscrire ses rares échecs au cache', async (): Promise<void> => {
    const result = await fetchBanResponseBatch(adresses(40), SANS_CACHE, () => Promise.resolve(reponse(2, 38)));

    expect(result.slice(0, 2)).toStrictEqual([null, null]);
  });

  it('ne juge pas un lot trop court pour que la proportion veuille dire quelque chose', async (): Promise<void> => {
    const result = await fetchBanResponseBatch(adresses(4), SANS_CACHE, () => Promise.resolve(reponse(3, 1)));

    expect(result.slice(0, 3)).toStrictEqual([null, null, null]);
  });
});

describe('échantillon sur lequel se juge un lot', (): void => {
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

  const tenteesIlYALongtemps = (nombre: number): AddressIndex =>
    new Map(
      Array.from({ length: nombre }, (_: unknown, i: number): [string, AddressRecord] => [
        `${i} rue de la paix 75002 Paris`,
        { addresseOriginale: `${i} rue de la paix 75002 Paris`, dateDeTraitement: '2020-01-01T00:00:00.000Z' }
      ])
    );

  it('ne déclare pas dégradé un lot d’adresses déjà réputées introuvables, si difficile soit-il', async (): Promise<void> => {
    const result = await fetchBanResponseBatch(adresses(40), tenteesIlYALongtemps(40), () => Promise.resolve(reponse(28, 12)));

    expect(result.slice(0, 28)).toStrictEqual(Array.from({ length: 28 }, () => null));
  });

  it('déclare dégradé un lot dont les adresses jamais tentées reviennent majoritairement muettes', async (): Promise<void> => {
    const result = await fetchBanResponseBatch(adresses(40), new Map(), () => Promise.resolve(reponse(28, 12)));

    expect(result.slice(0, 28)).toStrictEqual(Array.from({ length: 28 }, () => GEOCODING_UNAVAILABLE));
  });

  it('ne juge pas un lot où trop peu d’adresses sont des premières tentatives', async (): Promise<void> => {
    const result = await fetchBanResponseBatch(adresses(40), tenteesIlYALongtemps(25), () => Promise.resolve(reponse(28, 12)));

    expect(result.slice(0, 25)).toStrictEqual(Array.from({ length: 25 }, () => null));
  });
});
