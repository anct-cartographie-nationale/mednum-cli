import { ModaliteAccompagnement, ModalitesAccompagnement } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { processModalitesAccompagnement } from '..';

describe('modalites accompagnement field', (): void => {
  it('should get modalites accompagnement for empty value', (): void => {
    const modalitesAccompagnement: ModalitesAccompagnement = processModalitesAccompagnement('');
    expect(modalitesAccompagnement).toStrictEqual([]);
  });

  it('should get modalites accompagnement for empty value', (): void => {
    const modalitesAccompagnement: ModalitesAccompagnement = processModalitesAccompagnement('oui');

    expect(modalitesAccompagnement).toStrictEqual([
      ModaliteAccompagnement.Seul,
      ModaliteAccompagnement.AvecDeLAide,
      ModaliteAccompagnement.AMaPlace,
      ModaliteAccompagnement.DansUnAtelier
    ]);
  });
});
