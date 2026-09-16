import type { LieuMediationNumerique, Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { describe, expect, it } from 'vitest';
import { isLocated } from './to-lieux-mediation-numerique';

const lieu = (localisation?: Localisation): LieuMediationNumerique =>
  ({ nom: 'Un lieu', ...(localisation == null ? {} : { localisation }) }) as LieuMediationNumerique;

describe('isLocated', (): void => {
  it('retient un lieu que le géocodage a su situer', (): void => {
    expect(isLocated(lieu({ latitude: 48.868989, longitude: 2.33115 } as Localisation))).toBe(true);
  });

  it('écarte un lieu sans coordonnées, qu’aucune carte ne saurait porter', (): void => {
    expect(isLocated(lieu())).toBe(false);
  });
});
