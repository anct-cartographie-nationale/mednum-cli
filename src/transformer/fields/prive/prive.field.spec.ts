/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { ModaliteAcces } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching } from '../../input';
import { isPrive } from './prive.field';

const MODALITES_ACCES_FIELD: 'Mobilisation du service' = 'Mobilisation du service' as const;

const MATCHING: LieuxMediationNumeriqueMatching = {
  modalites_acces: [
    {
      colonnes: [MODALITES_ACCES_FIELD],
      termes: ["Ce lieu n'accueil pas de public"],
      cible: ModaliteAcces.PasDePublic
    }
  ]
} as LieuxMediationNumeriqueMatching;

describe('prive field', (): void => {
  it('should get prive field from data source using matching information', (): void => {
    const prive: boolean | undefined = isPrive(
      {
        [MODALITES_ACCES_FIELD]: "Ce lieu n'accueil pas de public"
      },
      MATCHING
    );

    expect(prive).toBe(true);
  });

  it('should not get any prive field', (): void => {
    const prive: boolean | undefined = isPrive({}, MATCHING);

    expect(prive).toBe(false);
  });
});
