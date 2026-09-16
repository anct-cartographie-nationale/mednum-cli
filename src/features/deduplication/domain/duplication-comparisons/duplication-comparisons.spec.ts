import { describe, it, expect } from 'vitest';
import { type SchemaLieuMediationNumerique, Typologie } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { type DuplicationComparison, duplicationComparisons } from './duplication-comparisons';

const CHAMPS_COMMUNS = {
  id: 'A',
  nom: 'Mediatheque',
  adresse: '1 rue des Ecoles',
  code_postal: '45000',
  code_insee: '45234',
  commune: 'Fleury',
  source: 'hinaura',
  date_maj: '2020-09-08'
};

const lieu = (champs: Partial<SchemaLieuMediationNumerique>): SchemaLieuMediationNumerique =>
  ({ ...CHAMPS_COMMUNS, latitude: 47.9, longitude: 1.9, ...champs }) as SchemaLieuMediationNumerique;

const lieuSansCoordonnees = (champs: Partial<SchemaLieuMediationNumerique>): SchemaLieuMediationNumerique =>
  ({ ...CHAMPS_COMMUNS, ...champs }) as SchemaLieuMediationNumerique;

const uniqueComparaison = (comparaisons: DuplicationComparison[]): DuplicationComparison => {
  const [premiere] = comparaisons;

  if (premiere == null) throw new Error('aucune comparaison retenue');

  return premiere;
};

describe('duplication comparisons', (): void => {
  it('should report a pair once whichever way round it was met', (): void => {
    const comparaisons: DuplicationComparison[] = duplicationComparisons(
      [lieu({ id: 'A', source: 'hinaura' }), lieu({ id: 'B', source: 'res-in' })],
      false
    );

    expect(comparaisons).toHaveLength(1);
    expect(comparaisons[0]).toMatchObject({ id1: 'A', id2: 'B' });
  });

  it('should not compare a lieu with itself', (): void => {
    expect(duplicationComparisons([lieu({ id: 'A' })], false)).toStrictEqual([]);
  });

  it('should carry every component of the comparison', (): void => {
    const comparaison: DuplicationComparison = uniqueComparaison(
      duplicationComparisons(
        [
          lieu({ id: 'A', source: 'hinaura', typologie: Typologie.TIERS_LIEUX }),
          lieu({ id: 'B', source: 'res-in', typologie: Typologie.TIERS_LIEUX })
        ],
        false
      )
    );

    expect(comparaison).toStrictEqual<DuplicationComparison>({
      id1: 'A',
      id2: 'B',
      score: 100,
      nomScore: 100,
      nom1: 'Mediatheque',
      nom2: 'Mediatheque',
      adresseScore: 100,
      adresse1: '1 rue des Ecoles 45000 Fleury',
      adresse2: '1 rue des Ecoles 45000 Fleury',
      distanceEnMetres: 0,
      localisation1: '47.9 : 1.9',
      localisation2: '47.9 : 1.9',
      source1: 'hinaura',
      source2: 'res-in',
      typologie1: Typologie.TIERS_LIEUX,
      typologie2: Typologie.TIERS_LIEUX
    });
  });

  it('should measure the distance in metres rather than in degrees', (): void => {
    const comparaison: DuplicationComparison = uniqueComparaison(
      duplicationComparisons(
        [
          lieu({ id: 'A', source: 'hinaura', latitude: 47.9, longitude: 1.9 }),
          lieu({ id: 'B', source: 'res-in', latitude: 47.9009, longitude: 1.9 })
        ],
        false
      )
    );

    expect(comparaison.distanceEnMetres).toBeGreaterThan(95);
    expect(comparaison.distanceEnMetres).toBeLessThan(105);
  });

  it('should omit a component that could not be measured', (): void => {
    const comparaison: DuplicationComparison = uniqueComparaison(
      duplicationComparisons(
        [lieuSansCoordonnees({ id: 'A', source: 'hinaura' }), lieuSansCoordonnees({ id: 'B', source: 'res-in' })],
        false
      )
    );

    expect(comparaison).not.toHaveProperty('distanceEnMetres');
    expect(comparaison.adresseScore).toBe(100);
  });

  it('should refuse a pair that nothing situates', (): void => {
    const sansEmplacement: Partial<SchemaLieuMediationNumerique> = { adresse: 'Non diffusible' };

    expect(
      duplicationComparisons(
        [
          lieuSansCoordonnees({ id: 'A', source: 'hinaura', ...sansEmplacement }),
          lieuSansCoordonnees({ id: 'B', source: 'res-in', ...sansEmplacement })
        ],
        false
      )
    ).toStrictEqual([]);
  });

  it('should refuse a pair from two different communes', (): void => {
    expect(
      duplicationComparisons(
        [lieu({ id: 'A', source: 'hinaura', code_insee: '45234' }), lieu({ id: 'B', source: 'res-in', code_insee: '38185' })],
        false
      )
    ).toStrictEqual([]);
  });

  it('should reconcile a municipal arrondissement with its commune', (): void => {
    expect(
      duplicationComparisons(
        [lieu({ id: 'A', source: 'hinaura', code_insee: '75056' }), lieu({ id: 'B', source: 'res-in', code_insee: '75118' })],
        false
      )
    ).toHaveLength(1);
  });

  it('should refuse a pair whose typologies cannot coexist', (): void => {
    expect(
      duplicationComparisons(
        [
          lieu({ id: 'A', source: 'hinaura', typologie: Typologie.CCAS }),
          lieu({ id: 'B', source: 'res-in', typologie: Typologie.BIB })
        ],
        false
      )
    ).toStrictEqual([]);
  });

  it('should split the typologies declared as a single field', (): void => {
    expect(
      duplicationComparisons(
        [
          lieu({ id: 'A', source: 'hinaura', typologie: `${Typologie.CCAS}|${Typologie.BIB}` }),
          lieu({ id: 'B', source: 'res-in', typologie: Typologie.BIB })
        ],
        false
      )
    ).toHaveLength(1);
  });

  it('should refuse a pair from the same source unless internal merge is allowed', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [lieu({ id: 'A', source: 'hinaura' }), lieu({ id: 'B', source: 'hinaura' })];

    expect(duplicationComparisons(lieux, false)).toStrictEqual([]);
    expect(duplicationComparisons(lieux, true)).toHaveLength(1);
  });

  it('should sort the comparisons by descending score', (): void => {
    const comparaisons: DuplicationComparison[] = duplicationComparisons(
      [
        lieu({ id: 'A', nom: 'Mediatheque', source: 'hinaura' }),
        lieu({ id: 'B', nom: 'Mediatheque', source: 'res-in' }),
        lieu({ id: 'C', nom: 'Bureau de poste', source: 'francil-in' })
      ],
      false
    );

    expect(comparaisons.map(({ score }: DuplicationComparison): number => score)).toStrictEqual(
      [...comparaisons].map(({ score }: DuplicationComparison): number => score).sort((a: number, b: number): number => b - a)
    );
    expect(comparaisons[0]).toMatchObject({ id1: 'A', id2: 'B', score: 100 });
  });

  it('should compare the lieux to deduplicate against the whole corpus', (): void => {
    const corpus: SchemaLieuMediationNumerique[] = [lieu({ id: 'A', source: 'hinaura' }), lieu({ id: 'B', source: 'res-in' })];

    const comparaisons: DuplicationComparison[] = duplicationComparisons(corpus, false, [lieu({ id: 'C', source: 'paca' })]);

    expect(comparaisons.map(({ id1, id2 }: DuplicationComparison): string => `${id1}-${id2}`)).toStrictEqual(['C-A', 'C-B']);
  });
});
