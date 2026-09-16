import type { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { beforeEach, describe, expect, it } from 'vitest';
import { provide } from '../../../../libraries/injection';
import type { DuplicationComparison, Groups, MergedLieuxByGroupMap } from '../../domain';
import { IS_INCLUDED, LOAD_LIEUX, SAVE_DEDUPLICATION } from '../../keys';
import { dedupliquerDesLieux } from './dedupliquer-des-lieux';

type Saved = {
  groups: Groups;
  merged: MergedLieuxByGroupMap;
  lieux: SchemaLieuMediationNumerique[];
  duplications: DuplicationComparison[];
};

const saved: Saved[] = [];
const loadedSources: string[] = [];

const lieu = (id: string, nom: string, commune: string): SchemaLieuMediationNumerique =>
  ({
    id,
    nom,
    commune,
    code_postal: '75001',
    adresse: '12 rue des Lilas',
    services: 'Accompagner les démarches en ligne',
    source: id.split('_')[0],
    date_maj: '2026-01-15'
  }) as unknown as SchemaLieuMediationNumerique;

const provideImplementations = (lieux: SchemaLieuMediationNumerique[], isIncluded = (): boolean => true): void => {
  provide(LOAD_LIEUX, async (source: string): Promise<SchemaLieuMediationNumerique[]> => {
    loadedSources.push(source);
    return lieux;
  });
  provide(IS_INCLUDED, isIncluded);
  provide(
    SAVE_DEDUPLICATION,
    async (
      groups: Groups,
      merged: MergedLieuxByGroupMap,
      lieuxToDeduplicate: SchemaLieuMediationNumerique[] = [],
      duplications: DuplicationComparison[] = []
    ): Promise<void> => {
      saved.push({ groups, merged, lieux: lieuxToDeduplicate, duplications });
    }
  );
};

describe('dedupliquerDesLieux', (): void => {
  beforeEach((): void => {
    saved.length = 0;
    loadedSources.length = 0;
  });

  it('charge la source de base puis la source à dédupliquer', async (): Promise<void> => {
    provideImplementations([lieu('dora_1', 'La Maison du Numérique', 'Paris')]);

    await dedupliquerDesLieux({ source: './source.json', baseSource: './base.json', allowInternal: false });

    expect(loadedSources).toStrictEqual(['./base.json', './source.json']);
  });

  it('enregistre le résultat de la déduplication', async (): Promise<void> => {
    provideImplementations([lieu('dora_1', 'La Maison du Numérique', 'Paris')]);

    await dedupliquerDesLieux({ source: './source.json', baseSource: './base.json', allowInternal: false });

    expect(saved).toHaveLength(1);
    expect(saved[0]?.lieux.map(({ id }: SchemaLieuMediationNumerique): string => id)).toStrictEqual(['dora_1']);
  });

  it('écarte les lieux exclus avant enregistrement', async (): Promise<void> => {
    provideImplementations(
      [lieu('dora_1', 'La Maison du Numérique', 'Paris'), lieu('dora_2', 'Autre lieu', 'Lyon')],
      ((candidate: SchemaLieuMediationNumerique): boolean => candidate.id !== 'dora_2') as () => boolean
    );

    await dedupliquerDesLieux({ source: './source.json', baseSource: './base.json', allowInternal: false });

    expect(saved[0]?.lieux.map(({ id }: SchemaLieuMediationNumerique): string => id)).toStrictEqual(['dora_1']);
  });

  it("n'enregistre aucun groupe quand les lieux sont tous distincts", async (): Promise<void> => {
    provideImplementations([
      lieu('dora_1', 'La Maison du Numérique', 'Paris'),
      lieu('france-services_2', 'Bibliothèque municipale', 'Lyon')
    ]);

    await dedupliquerDesLieux({ source: './source.json', baseSource: './base.json', allowInternal: false });

    expect(saved[0]?.merged.size).toBe(0);
    expect(saved[0]?.groups.itemGroupMap.size).toBe(0);
  });
});
