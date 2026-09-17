import { describe, it, expect } from 'vitest';
import type { LieuxMediationNumeriqueMatching, DataSource } from '../../matching';
import { processPivot } from './pivot.field';
import type { Pivot } from '@gouvfr-anct/lieux-de-mediation-numerique';

const matchingSiret = (colonne: string): LieuxMediationNumeriqueMatching =>
  ({ pivot: { colonne } }) as LieuxMediationNumeriqueMatching;

describe('pivot field', (): void => {
  it('should get pivot from data source using matching information', (): void => {
    const source: DataSource = { SIRET: '43493312300029' };

    const pivot: Pivot | undefined = processPivot(source, matchingSiret('SIRET'));

    expect(pivot).toBe('43493312300029');
  });

  it('should get pivot from data source using matching information for number pivot', (): void => {
    const source: DataSource = { Siret: 17230001400013 as unknown as string };

    const pivot: Pivot | undefined = processPivot(source, matchingSiret('Siret'));

    expect(pivot).toBe('17230001400013');
  });

  it('should get no pivot when there is no match', (): void => {
    expect(processPivot({}, matchingSiret('SIRET'))).toBeUndefined();
  });

  it.each([
    { name: 'spaces', value: '842 887 408 00' },
    { name: 'point', value: '776.398.968.00' },
    { name: 'dash', value: '213-801-111-00' }
  ])('should get no pivot when SIRET is too short excluding $name', ({ value }): void => {
    expect(processPivot({ SIRET: value }, matchingSiret('SIRET'))).toBeUndefined();
  });

  it('should get no pivot when the SIRET fails its check digit', (): void => {
    expect(processPivot({ SIRET: '12345678910111' }, matchingSiret('SIRET'))).toBeUndefined();
  });

  it('should get no pivot for the sentinel that used to stand for a missing one', (): void => {
    expect(processPivot({ SIRET: '00000000000000' }, matchingSiret('SIRET'))).toBeUndefined();
  });
});
