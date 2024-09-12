/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Itinerance, Itinerances } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching } from '../../input';
import { processItinerances } from './itinerance.field';

const ITINERANCE_FIELD: 'Itinerance' = 'Itinerance' as const;

const MATCHING: LieuxMediationNumeriqueMatching = {
  itinerance: [
    {
      colonnes: [ITINERANCE_FIELD],
      termes: ['sur place'],
      cible: Itinerance.Fixe
    },
    {
      colonnes: [ITINERANCE_FIELD],
      termes: ['déplacement'],
      cible: Itinerance.Itinerant
    }
  ]
} as LieuxMediationNumeriqueMatching;

const DEFAULT_MATCHING: LieuxMediationNumeriqueMatching = {
  itinerance: [
    {
      cible: Itinerance.Itinerant
    }
  ]
} as LieuxMediationNumeriqueMatching;

describe('itinerance field', (): void => {
  it('should not get any itinerance data for empty value', (): void => {
    const itinerances: Itinerances = processItinerances(
      {
        [ITINERANCE_FIELD]: ''
      },
      MATCHING
    );

    expect(itinerances).toStrictEqual([]);
  });

  it('should get "Fixe" when value is "sur place"', (): void => {
    const itinerances: Itinerances = processItinerances(
      {
        [ITINERANCE_FIELD]: 'sur place'
      },
      MATCHING
    );

    expect(itinerances).toStrictEqual([Itinerance.Fixe]);
  });

  it('should get "Itinerant" when value is "déplacement"', (): void => {
    const itinerances: Itinerances = processItinerances(
      {
        [ITINERANCE_FIELD]: 'déplacement'
      },
      MATCHING
    );

    expect(itinerances).toStrictEqual([Itinerance.Itinerant]);
  });

  it('should get "Itinerant,Fixe" when value is "déplacement, sur place"', (): void => {
    const itinerances: Itinerances = processItinerances(
      {
        [ITINERANCE_FIELD]: 'déplacement, sur place'
      },
      MATCHING
    );

    expect(itinerances).toStrictEqual([Itinerance.Fixe, Itinerance.Itinerant]);
  });

  it('should apply "Itinerant" as default value', (): void => {
    const itinerances: Itinerances = processItinerances(
      {
        [ITINERANCE_FIELD]: ''
      },
      DEFAULT_MATCHING
    );

    expect(itinerances).toStrictEqual([Itinerance.Itinerant]);
  });
});
