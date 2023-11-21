import { shouldMarkAsDeduplicated } from './save-with-api';

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
        ['Hinaura@05a12890-03e5-5abd-949c-cbaaf5b9afe5', 'Hinaura@96cfc8b3-94e0-48a1-bb90-bd324e9535b2']
      ]
    ]);

    const markAsDeduplicated: boolean = shouldMarkAsDeduplicated(mergeGroupsMap);

    expect(markAsDeduplicated).toBe(false);
  });

  it('should be an internal merge, when single merge group contains Res-in as same sources', (): void => {
    const mergeGroupsMap: Map<string, string[]> = new Map<string, string[]>([
      [
        '4ee6737afbdef63ac81397e16c10ac24518e028dca130889c44ba28db446270d',
        ['Res-in@05a12890-03e5-5abd-949c-cbaaf5b9afe5', 'Res-in@96cfc8b3-94e0-48a1-bb90-bd324e9535b2']
      ]
    ]);

    const markAsDeduplicated: boolean = shouldMarkAsDeduplicated(mergeGroupsMap);

    expect(markAsDeduplicated).toBe(false);
  });
});
