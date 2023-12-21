/* eslint-disable @typescript-eslint/naming-convention */

import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { processId } from './id.field';

describe('id field', (): void => {
  it('should get id from data source using matching information', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      id: {
        colonne: 'ID'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      ID: 'a91cae7af848a1c65'
    };

    const id: string = processId(source, matching, 0);

    expect(id).toBe('a91cae7af848a1c65');
  });

  it('should get index as id when no id in matching information', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {} as LieuxMediationNumeriqueMatching;

    const source: DataSource = {};

    const id: string = processId(source, matching, 0);

    expect(id).toBe('0');
  });

  it('should get index as id when no id in source even if matching field is ok', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      id: {
        colonne: 'ID'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      ID: ''
    };

    const id: string = processId(source, matching, 0);

    expect(id).toBe('0');
  });
});
