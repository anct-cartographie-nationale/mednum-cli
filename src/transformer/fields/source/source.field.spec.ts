import { describe, it, expect } from 'vitest';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { processSource } from './source.field';

describe('source field', (): void => {
  it('should get source from data source using matching information', (): void => {
    const defaultSourceName: string = 'Data Inclusion';
    const matching: LieuxMediationNumeriqueMatching = {
      source: {
        colonne: 'source'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      source: 'Hinaura'
    };

    const sourceName: string = processSource(source, matching, defaultSourceName);

    expect(sourceName).toBe('Hinaura');
  });

  it('should get default source when no source in data source', (): void => {
    const defaultSourceName: string = 'Data Inclusion';
    const matching: LieuxMediationNumeriqueMatching = {
      source: {
        colonne: 'source'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {};

    const sourceName: string = processSource(source, matching, defaultSourceName);

    expect(sourceName).toBe('Data Inclusion');
  });
});
