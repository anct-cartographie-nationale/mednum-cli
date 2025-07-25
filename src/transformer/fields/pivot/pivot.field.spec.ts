import { describe, it, expect } from 'vitest';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { processPivot } from './pivot.field';
import { Pivot } from '@gouvfr-anct/lieux-de-mediation-numerique';

describe('pivot field', (): void => {
  it('should get pivot from data source using matching information', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      pivot: {
        colonne: 'SIRET'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      SIRET: '12345678910111'
    };

    const pivot: Pivot = processPivot(source, matching);

    expect(pivot).toBe('12345678910111');
  });

  it('should get pivot from data source using matching information for number pivot', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      pivot: {
        colonne: 'Siret'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      Siret: 17230001400013 as unknown as string
    };

    const pivot: Pivot = processPivot(source, matching);

    expect(pivot).toBe('17230001400013');
  });

  it('should get dummy pivot when there is no match', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      pivot: {
        colonne: 'SIRET'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {};

    const pivot: Pivot = processPivot(source, matching);

    expect(pivot).toBe('00000000000000');
  });

  it.each([
    { name: 'spaces', value: '842 887 408 00' },
    { name: 'point', value: '776.398.968.00' },
    { name: 'dash', value: '213-801-111-00' }
  ])('should get dummy pivot when SIRET is to short excluding $name', ({ value }): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      pivot: {
        colonne: 'SIRET'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      SIRET: value
    };

    const pivot: Pivot = processPivot(source, matching);

    expect(pivot).toBe('00000000000000');
  });
});
