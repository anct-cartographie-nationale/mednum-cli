import { processModalitesAccompagnement } from './modalites-accompagnement.field';
import { ModaliteAccompagnement } from '@gouvfr-anct/lieux-de-mediation-numerique';

describe('modalites accompagnement field', (): void => {
  it('should get modalites accompagnement for empty value', (): void => {
    const modalitesAccompagnement: string = processModalitesAccompagnement('');

    expect(modalitesAccompagnement).toBe('');
  });

  it('should get "Seul,Avec de l\'aide" when value is "accompagnement individuel"', (): void => {
    const modalitesAccompagnement: string = processModalitesAccompagnement('accompagnement individuel');

    expect(modalitesAccompagnement).toBe([ModaliteAccompagnement.Seul, ModaliteAccompagnement.AvecDeLAide].join(','));
  });

  it('should get "Seul,Avec de l\'aide" when value is "accès libre avec un accompagnement"', (): void => {
    const modalitesAccompagnement: string = processModalitesAccompagnement('accès libre avec un accompagnement');

    expect(modalitesAccompagnement).toBe([ModaliteAccompagnement.Seul, ModaliteAccompagnement.AvecDeLAide].join(','));
  });

  it('should get "Dans un atelier" when value is "accompagnement en groupe"', (): void => {
    const modalitesAccompagnement: string = processModalitesAccompagnement('accompagnement en groupe');

    expect(modalitesAccompagnement).toBe(ModaliteAccompagnement.DansUnAtelier);
  });

  it('should get "A ma place" when value is "faire à la place de"', (): void => {
    const modalitesAccompagnement: string = processModalitesAccompagnement('faire à la place de');

    expect(modalitesAccompagnement).toBe(ModaliteAccompagnement.AMaPlace);
  });

  it('should get "Dans un atelier,A ma place" when value is "faire à la place de,accompagnement en groupe"', (): void => {
    const modalitesAccompagnement: string = processModalitesAccompagnement('faire à la place de,accompagnement en groupe');

    expect(modalitesAccompagnement).toBe([ModaliteAccompagnement.AMaPlace, ModaliteAccompagnement.DansUnAtelier].join(','));
  });
});
