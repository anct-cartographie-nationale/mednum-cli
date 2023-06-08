/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { processAccessibilite } from './accessibilite.field';

describe('accessibilite field', (): void => {
  it('should get accessibilite url from data source using matching information', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      accessibilite: {
        colonne: 'bf_accessibilit_'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      bf_accessibilit_: 'https://acceslibre.beta.gouv.fr/app/73-chambery/a/administration-publique/erp/mairie-chambery/'
    };

    const accessibilite: string | undefined = processAccessibilite(source, matching);

    expect(accessibilite).toBe(
      'https://acceslibre.beta.gouv.fr/app/73-chambery/a/administration-publique/erp/mairie-chambery/'
    );
  });

  it('should not get any accessibilite url', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      accessibilite: {
        colonne: 'bf_accessibilit_'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {};

    const accessibilite: string | undefined = processAccessibilite(source, matching);

    expect(accessibilite).toBeUndefined();
  });

  it('should ignore empty strings', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      accessibilite: {
        colonne: 'bf_accessibilit_'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      bf_accessibilit_: ''
    };
    const accessibilite: string | undefined = processAccessibilite(source, matching);

    expect(accessibilite).toBeUndefined();
  });
});
