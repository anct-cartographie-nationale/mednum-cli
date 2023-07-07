/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Typologie, Typologies } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching } from '../../input';
import { processTypologies } from './typologies.field';

describe('typologies field', (): void => {
  it('should get none typologies for empty value', (): void => {
    const typologies: Typologies = processTypologies({}, {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching);

    expect(typologies).toStrictEqual([]);
  });

  it('should get BIB typologie for Médiathèque', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' },
      typologie: [{ colonnes: ['checkboxListeTypelieu'], termes: ['5'], cible: Typologie.BIB }]
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ checkboxListeTypelieu: '5' }, matching);

    expect(typologies).toStrictEqual([Typologie.BIB]);
  });
});