/* eslint-disable @typescript-eslint/naming-convention */

import { LieuxMediationNumeriqueMatching, Source } from '../../input';
import { processNom } from './nom.field';

describe('nom field', (): void => {
  it('should get nom from data source using matching information', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: {
        colonne: 'Nom du lieu ou de la structure *'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: Source = {
      'Nom du lieu ou de la structure *': 'Anonymal'
    };

    const nom: string = processNom(source, matching);

    expect(nom).toBe('Anonymal');
  });
});
