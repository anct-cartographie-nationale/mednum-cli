import { describe, it, expect } from 'vitest';
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
      presentation_detail: 'Courte description,\noù il y a une,\nou plusieurs newlines',
      presentation_resume:
        'Ceci est une description\n avec plus de détails,\n\n où il peut y avoir une ou plusieurs newlines\n\n\n'
    };

    const presentation: Presentation = processPresentation(source, matching);

    expect(presentation).toStrictEqual({
      detail: 'Courte description,où il y a une,ou plusieurs newlines',
      resume: 'Ceci est une description avec plus de détails, où il peut y avoir une ou plusieurs newlines'
    });
  });

  it('should move long presentation resume to presentation details when it is empty', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      presentation_detail: {
        colonne: 'presentation_detail'
      },
      presentation_resume: {
        colonne: 'presentation_resume'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      presentation_detail: '',
      presentation_resume:
        "Cette très longue description ne devrait pas être utilisée en tant que résumé, mais plutôt en tant que détail, car il y a trop d'informations pour être un considérée comme un simple résumé. En effet en dépassant la limite de 280 caractères, il est préférable de la considérer comme un détail plutôt qu'un résumé"
    };

    const presentation: Presentation = processPresentation(source, matching);

    expect(presentation).toStrictEqual({
      detail:
        "Cette très longue description ne devrait pas être utilisée en tant que résumé, mais plutôt en tant que détail, car il y a trop d'informations pour être un considérée comme un simple résumé. En effet en dépassant la limite de 280 caractères, il est préférable de la considérer comme un détail plutôt qu'un résumé"
    });
  });

  it('should not move long presentation resume to presentation details when there is already a detailed presentation', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      presentation_detail: {
        colonne: 'presentation_detail'
      },
      presentation_resume: {
        colonne: 'presentation_resume'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      presentation_detail: 'Mais ici, la description est déjà détaillée, donc on ne devrait pas la remplacer',
      presentation_resume:
        "Cette très longue description ne devrait pas être utilisée en tant que résumé, mais plutôt en tant que détail, car il y a trop d'informations pour être un considérée comme un simple résumé. En effet en dépassant la limite de 280 caractères, il est préférable de la considérer comme un détail plutôt qu'un résumé"
    };

    const presentation: Presentation = processPresentation(source, matching);

    expect(presentation).toStrictEqual({
      detail: 'Mais ici, la description est déjà détaillée, donc on ne devrait pas la remplacer',
      resume:
        "Cette très longue description ne devrait pas être utilisée en tant que résumé, mais plutôt en tant que détail, car il y a trop d'informations pour être un considérée comme un simple résumé. En effet en dépassant la limite de 280 caractères, il est préférable de la considérer comme un détail plutôt qu'un résumé"
    });
  });
});
