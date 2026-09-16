import { describe, expect, it } from 'vitest';
import { distanceInMeters } from './distance';

describe('distanceInMeters', (): void => {
  it('rend zéro entre un point et lui-même', (): void => {
    expect(distanceInMeters({ latitude: 48.8566, longitude: 2.3522 }, { latitude: 48.8566, longitude: 2.3522 })).toBe(0);
  });

  it('mesure la centaine de mètres qui sépare deux adresses voisines', (): void => {
    const distance: number = distanceInMeters(
      { latitude: 48.8566, longitude: 2.3522 },
      { latitude: 48.8575, longitude: 2.3522 }
    );

    expect(distance).toBeGreaterThan(95);
    expect(distance).toBeLessThan(105);
  });

  it('mesure les 392 km entre Paris et Lyon à moins d’un pour cent', (): void => {
    const distance: number = distanceInMeters(
      { latitude: 48.8566, longitude: 2.3522 },
      { latitude: 45.764, longitude: 4.8357 }
    );

    expect(distance).toBeGreaterThan(388_000);
    expect(distance).toBeLessThan(396_000);
  });
});
