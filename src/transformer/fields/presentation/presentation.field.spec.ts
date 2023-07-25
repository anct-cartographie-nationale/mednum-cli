/* eslint-disable @typescript-eslint/naming-convention, camelcase */

/* eslint-disable-next-line @typescript-eslint/no-shadow */
import { Presentation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { processPresentation } from './presentation.field';

describe('presentation fields', (): void => {
  it('should get presentation resume from data source using matching information', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      presentation_resume: {
        colonne: 'shortDescription'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      shortDescription: 'Courte description'
    };

    const presentation: Presentation = processPresentation(source, matching);

    expect(presentation).toStrictEqual({
      resume: 'Courte description'
    });
  });

  it('should get presentation detail from data source using matching information', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      presentation_detail: {
        colonne: 'description'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      description: 'Ceci est une description avec plus de détails'
    };

    const presentation: Presentation = processPresentation(source, matching);

    expect(presentation).toStrictEqual({
      detail: 'Ceci est une description avec plus de détails'
    });
  });

  it('should replace all newline in presentation fields', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      presentation_detail: {
        colonne: 'presentation_detail'
      },
      presentation_resume: {
        colonne: 'presentation_resume'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      presentation_detail: 'Courte description,\nOu il y a une,\nou plusieurs newlines',
      presentation_resume:
        'Ceci est une description\n avec plus de détails,\n\n ou il peut y avoir une ou plusieurs newlines\n\n\n'
    };

    const presentation: Presentation = processPresentation(source, matching);

    expect(presentation).toStrictEqual({
      detail: 'Courte description,Ou il y a une,ou plusieurs newlines',
      resume: 'Ceci est une description avec plus de détails, ou il peut y avoir une ou plusieurs newlines'
    });
  });
});
