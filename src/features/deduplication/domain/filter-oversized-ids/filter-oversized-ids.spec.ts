import type { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { describe, expect, it } from 'vitest';
import { describeOversizedId, filterOversizedIds, MAX_ID_BYTES } from './filter-oversized-ids.js';

const lieu = (id: string): SchemaLieuMediationNumerique => ({ id }) as SchemaLieuMediationNumerique;

describe('filterOversizedIds', (): void => {
  it('conserve les lieux dont l’id tient dans la limite', (): void => {
    const merged = new Map([['groupe-1', lieu('dora_1__france-services_2')]]);

    expect(filterOversizedIds(merged)).toStrictEqual({ merged, oversizedIds: [] });
  });

  it('écarte les lieux dont l’id dépasse la limite', (): void => {
    const tropLong: string = 'a'.repeat(MAX_ID_BYTES + 1);

    const { merged, oversizedIds } = filterOversizedIds(
      new Map([
        ['groupe-1', lieu('dora_1')],
        ['groupe-2', lieu(tropLong)]
      ])
    );

    expect(Array.from(merged.keys())).toStrictEqual(['groupe-1']);
    expect(oversizedIds).toStrictEqual([tropLong]);
  });

  it('compte la taille en octets et non en caractères', (): void => {
    // « é » occupe deux octets en UTF-8 : la limite est atteinte avec deux fois moins de caractères.
    const id: string = 'é'.repeat(MAX_ID_BYTES / 2 + 1);

    expect(filterOversizedIds(new Map([['groupe-1', lieu(id)]])).oversizedIds).toStrictEqual([id]);
  });

  it('décrit un id écarté avec sa taille', (): void => {
    expect(describeOversizedId('dora_1')).toBe('  - dora_1 (6 octets)');
  });
});
