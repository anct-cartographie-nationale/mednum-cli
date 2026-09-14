import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '../../../libraries/cartographie-nationale-api',
  (): Record<string, unknown> => ({
    fetchMergeGroups: (): Promise<never> => Promise.reject(new Error('502 Bad Gateway')),
    patchMergeGroups: (): Promise<void> => Promise.resolve(),
    markAllAsDeduplicated: (): Promise<void> => Promise.resolve()
  })
);
import type { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { Groups, MergedLieuxByGroupMap } from '../domain';
import { saveWithApi, shouldMarkAsDeduplicated } from './save-with-api';

describe('save merged lieux with API', (): void => {
  it('should not be an internal merge, when single merge group contains different sources', (): void => {
    const mergeGroupsMap: Map<string, string[]> = new Map<string, string[]>([
      [
        '4ee6737afbdef63ac81397e16c10ac24518e028dca130889c44ba28db446270d',
        ['Hinaura@05a12890-03e5-5abd-949c-cbaaf5b9afe5', 'Res-in@96cfc8b3-94e0-48a1-bb90-bd324e9535b2']
      ]
    ]);

    const markAsDeduplicated: boolean = shouldMarkAsDeduplicated(mergeGroupsMap);

    expect(markAsDeduplicated).toBe(true);
  });

  it('should be an internal merge, when single merge group contains Hinaura as same sources', (): void => {
    const mergeGroupsMap: Map<string, string[]> = new Map<string, string[]>([
      [
        '4ee6737afbdef63ac81397e16c10ac24518e028dca130889c44ba28db446270d',
        ['Hinaura_05a12890-03e5-5abd-949c-cbaaf5b9afe5', 'Hinaura_96cfc8b3-94e0-48a1-bb90-bd324e9535b2']
      ]
    ]);

    const markAsDeduplicated: boolean = shouldMarkAsDeduplicated(mergeGroupsMap);

    expect(markAsDeduplicated).toBe(false);
  });

  it('should be an internal merge, when single merge group contains Res-in as same sources', (): void => {
    const mergeGroupsMap: Map<string, string[]> = new Map<string, string[]>([
      [
        '4ee6737afbdef63ac81397e16c10ac24518e028dca130889c44ba28db446270d',
        ['Res-in_05a12890-03e5-5abd-949c-cbaaf5b9afe5', 'Res-in_96cfc8b3-94e0-48a1-bb90-bd324e9535b2']
      ]
    ]);

    const markAsDeduplicated: boolean = shouldMarkAsDeduplicated(mergeGroupsMap);

    expect(markAsDeduplicated).toBe(false);
  });
});

describe("échec d'enregistrement par API", (): void => {
  /**
   * L'erreur doit remonter jusqu'au point d'entrée, qui pose un code de sortie non nul.
   * L'implémentation d'origine l'interceptait et se contentait de la journaliser, si bien
   * qu'une déduplication non enregistrée passait pour un succès.
   */
  it("remonte l'erreur au lieu de la journaliser", async (): Promise<void> => {
    const groups: Groups = {
      mergeGroupsMap: new Map([['groupe-1', ['dora_1', 'France-Services_2']]]),
      itemGroupMap: new Map([['dora_1', 'groupe-1']])
    };
    const merged: MergedLieuxByGroupMap = new Map([['groupe-1', {} as SchemaLieuMediationNumerique]]);

    await expect(saveWithApi({ url: 'https://exemple.fr', key: 'une-cle' })(groups, merged)).rejects.toThrow('502 Bad Gateway');
  });

  it("ne tente rien quand il n'y a rien à enregistrer", async (): Promise<void> => {
    const groups: Groups = { mergeGroupsMap: new Map(), itemGroupMap: new Map() };

    await expect(saveWithApi({ url: 'https://exemple.fr', key: 'une-cle' })(groups, new Map())).resolves.toBeUndefined();
  });
});
