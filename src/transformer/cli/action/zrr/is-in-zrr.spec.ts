import { ZrrMap } from '../../../fields';
import { isInZrr } from './is-in-zrr';

describe('in in zrr', (): void => {
  it('should find that a lieu is not in a ZRR because there is no ZRR for this code INSEE', (): void => {
    const zrrMap: ZrrMap = new Map<string, boolean>([
      ['01080', true],
      ['01041', false]
    ]);

    const result: boolean = isInZrr(zrrMap)('01019');

    expect(result).toBe(false);
  });

  it('should find that a lieu is not in a ZRR because this code INSEE is marked with no ZRR', (): void => {
    const zrrMap: ZrrMap = new Map<string, boolean>([
      ['01080', true],
      ['01041', false]
    ]);

    const result: boolean = isInZrr(zrrMap)('01041');

    expect(result).toBe(false);
  });

  it('should find that a lieu is in a ZRR because this code INSEE is marked with a ZRR', (): void => {
    const zrrMap: ZrrMap = new Map<string, boolean>([
      ['01080', true],
      ['01041', false]
    ]);

    const result: boolean = isInZrr(zrrMap)('01080');

    expect(result).toBe(true);
  });
});
