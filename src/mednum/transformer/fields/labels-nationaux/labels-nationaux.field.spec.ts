/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { LabelNational, LabelsNationaux } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { processLabelsNationaux } from './labels-nationaux.field';
import { LieuxMediationNumeriqueMatching } from '../../input';

describe('labels nationaux field', (): void => {
  it('should get labels nationaux for empty value', (): void => {
    const labelsNationaux: LabelsNationaux = processLabelsNationaux({} as LieuxMediationNumeriqueMatching);

    expect(labelsNationaux).toStrictEqual([]);
  });

  it('should get France Services default labels nationaux', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      labels_nationaux: [
        {
          cible: LabelNational.FranceServices
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const labelsNationaux: LabelsNationaux = processLabelsNationaux(matching);

    expect(labelsNationaux).toStrictEqual([LabelNational.FranceServices]);
  });
});
