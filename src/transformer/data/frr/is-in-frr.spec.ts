import { describe, it, expect } from 'vitest';
import { FrrMap } from '../../fields';
import { isInFrr } from './is-in-frr';

describe('is in frr', (): void => {
  it('should find that a lieu is not in a FRR because there is no FRR for this code INSEE', (): void => {
    const frrMap: FrrMap = new Map<string, boolean>([
      ['01080', true],
      ['01041', false]
    ]);

    const result: boolean = isInFrr(frrMap)('01019');

    expect(result).toBe(false);
  });

  it('should find that a lieu is not in a FRR because this code INSEE is marked with no FRR', (): void => {
    const frrMap: FrrMap = new Map<string, boolean>([
      ['01080', true],
      ['01041', false]
    ]);

    const result: boolean = isInFrr(frrMap)('01041');

    expect(result).toBe(false);
  });

  it('should find that a lieu is in a FRR because this code INSEE is marked with a FRR', (): void => {
    const frrMap: FrrMap = new Map<string, boolean>([
      ['01080', true],
      ['01041', false]
    ]);

    const result: boolean = isInFrr(frrMap)('01080');

    expect(result).toBe(true);
  });
});
