import { describe, it, expect } from 'vitest';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { processPriseRdv } from './prise-rdv.field';

describe('prise rdv field', (): void => {
  it('should get prise rdv url from data source using matching information', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      prise_rdv: {
        colonne: 'PriseRdv'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      PriseRdv: 'https://www.rdv-aide-numerique.fr/org/2981'
    };

    const priseRdv: string | undefined = processPriseRdv(source, matching);

    expect(priseRdv).toBe('https://www.rdv-aide-numerique.fr/org/2981');
  });

  it('should not get any prise rdv url', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      prise_rdv: {
        colonne: 'PriseRdv'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {};

    const priseRdv: string | undefined = processPriseRdv(source, matching);

    expect(priseRdv).toBeUndefined();
  });

  it('should ignore empty strings', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      prise_rdv: {
        colonne: 'PriseRdv'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      PriseRdv: ''
    };
    const priseRdv: string | undefined = processPriseRdv(source, matching);

    expect(priseRdv).toBeUndefined();
  });

  it('should fix invalid urls', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      prise_rdv: {
        colonne: 'PriseRdv'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      PriseRdv:
        'https://www.rdv-solidarites.fr/prendre_rdv?departement=03&city_code=03048&street_ban_id=&latitude=46.620992&longitude=2.811847&address=Cérilly%2C+03350&button='
    };
    const priseRdv: string | undefined = processPriseRdv(source, matching);

    expect(priseRdv).toBe(
      'https://www.rdv-solidarites.fr/prendre_rdv?departement=03&city_code=03048&street_ban_id=&latitude=46.620992&longitude=2.811847&address=Cerilly%2C+03350&button='
    );
  });
});
