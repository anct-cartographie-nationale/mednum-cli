/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { FormationLabel, FormationsLabels } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching } from '../../input';
import { processFormationsLabels } from './formations-labels.field';

describe('labels nationaux field', (): void => {
  it('should get labels nationaux for empty value', (): void => {
    const formationsLabels: FormationsLabels = processFormationsLabels({}, {} as LieuxMediationNumeriqueMatching);

    expect(formationsLabels).toStrictEqual([]);
  });

  it('should get France Services default labels nationaux', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      formations_labels: [{ cible: FormationLabel.EtapesNumeriques }]
    } as LieuxMediationNumeriqueMatching;

    const formationsLabels: FormationsLabels = processFormationsLabels({}, matching);

    expect(formationsLabels).toStrictEqual([FormationLabel.EtapesNumeriques]);
  });

  it('should get matching CNFS and France Services labels nationaux', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      formations_labels: [
        {
          colonnes: ['label'],
          termes: ['EN'],
          cible: FormationLabel.EtapesNumeriques
        },
        {
          colonnes: ['label'],
          termes: ['Mes papiers'],
          cible: FormationLabel.MesPapiers
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const formationsLabels: FormationsLabels = processFormationsLabels({ label: 'EN et Mes papiers' }, matching);

    expect(formationsLabels).toStrictEqual([FormationLabel.EtapesNumeriques, FormationLabel.MesPapiers]);
  });

  it('should not get any matching formation label', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      formations_labels: [
        {
          colonnes: ['label'],
          termes: ['EN'],
          cible: FormationLabel.EtapesNumeriques
        },
        {
          colonnes: ['label'],
          termes: ['Mes papiers'],
          cible: FormationLabel.MesPapiers
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const formationsLabels: FormationsLabels = processFormationsLabels({ label: 'pas de labels' }, matching);

    expect(formationsLabels).toStrictEqual([]);
  });
});
