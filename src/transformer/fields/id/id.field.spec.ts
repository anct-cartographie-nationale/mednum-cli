import { describe, it, expect } from 'vitest';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { processId } from './id.field';

describe('id field', (): void => {
  it('should get id from data source using matching information', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      id: {
        colonne: 'ID'
      },
      source: {
        colonne: 'source'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      ID: 'a91cae7af848a1c65',
      source: 'Hinaura'
    };

    const id: string = processId(source, matching, 0, 'Default');

    expect(id).toBe('Hinaura_a91cae7af848a1c65');
  });

  it('should get index as id when no id in matching information', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {} as LieuxMediationNumeriqueMatching;

    const source: DataSource = {};

    const id: string = processId(source, matching, 0, 'Default');

    expect(id).toBe('Default_0');
  });
});
