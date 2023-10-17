/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { processPrive } from './prive.field';

describe('prive field', (): void => {
  it('should get prive field from data source using matching information', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      prive: {
        colonne: 'prive'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      prive: true
    };

    const prive: boolean | undefined = processPrive(source, matching);

    expect(prive).toBe(true);
  });

  it('should not get any prive field', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      prive: {
        colonne: 'prive'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {};

    const prive: boolean | undefined = processPrive(source, matching);

    expect(prive).toBe(false);
  });
});
