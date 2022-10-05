import { formatModalitesAccompagnementField } from './modalites-accompagnement.field';
import { ModaliteAccompagnement } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LesAssembleursLieuMediationNumerique } from '../../helpers';

const ACCOMPAGNEMENT_MEDIATION_NUMERIQUE_FIELD: 'Accompagnement médiation numérique' =
  'Accompagnement médiation numérique' as const;
const ACCOMPAGNEMENT_DEMARCHES_FIELD: 'Accompagnement démarches' = 'Accompagnement démarches' as const;

describe('modalites accompagnement field', (): void => {
  it('should get modalites accompagnement for empty value', (): void => {
    const modalitesAccompagnement: ModaliteAccompagnement[] = formatModalitesAccompagnementField({
      [ACCOMPAGNEMENT_MEDIATION_NUMERIQUE_FIELD]: ''
    } as LesAssembleursLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([]);
  });

  it('should get "Seul" when value is "individuel"', (): void => {
    const modalitesAccompagnement: ModaliteAccompagnement[] = formatModalitesAccompagnementField({
      [ACCOMPAGNEMENT_MEDIATION_NUMERIQUE_FIELD]: 'individuel'
    } as LesAssembleursLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.Seul]);
  });

  it('should get "Dans un Atelier" when value is "en groupe"', (): void => {
    const modalitesAccompagnement: ModaliteAccompagnement[] = formatModalitesAccompagnementField({
      [ACCOMPAGNEMENT_MEDIATION_NUMERIQUE_FIELD]: 'En groupe'
    } as LesAssembleursLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.DansUnAtelier]);
  });

  it('should get "Dans un Atelier, Seul" when value is "Individuel, En groupe"', (): void => {
    const modalitesAccompagnement: ModaliteAccompagnement[] = formatModalitesAccompagnementField({
      [ACCOMPAGNEMENT_MEDIATION_NUMERIQUE_FIELD]: 'Individuel, En groupe'
    } as LesAssembleursLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.DansUnAtelier, ModaliteAccompagnement.Seul]);
  });

  it('should get "Dans un Atelier, Avec de l\'aide" when value is "accompagnement collectif"', (): void => {
    const modalitesAccompagnement: ModaliteAccompagnement[] = formatModalitesAccompagnementField({
      [ACCOMPAGNEMENT_MEDIATION_NUMERIQUE_FIELD]: 'accompagnement collectif'
    } as LesAssembleursLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.DansUnAtelier, ModaliteAccompagnement.AvecDeLAide]);
  });

  it('should get "Seul, Avec de l\'aide" when value is "accompagnement individuel"', (): void => {
    const modalitesAccompagnement: ModaliteAccompagnement[] = formatModalitesAccompagnementField({
      [ACCOMPAGNEMENT_MEDIATION_NUMERIQUE_FIELD]: 'accompagnement individuel'
    } as LesAssembleursLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.AvecDeLAide, ModaliteAccompagnement.Seul]);
  });

  it('should get "En groupe" when value is "oui en collectif"', (): void => {
    const modalitesAccompagnement: ModaliteAccompagnement[] = formatModalitesAccompagnementField({
      [ACCOMPAGNEMENT_MEDIATION_NUMERIQUE_FIELD]: 'oui en collectif'
    } as LesAssembleursLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.DansUnAtelier]);
  });

  it('should get "Avec de l\'aide" when value is "suivi personnalisé"', (): void => {
    const modalitesAccompagnement: ModaliteAccompagnement[] = formatModalitesAccompagnementField({
      [ACCOMPAGNEMENT_MEDIATION_NUMERIQUE_FIELD]: 'suivi personnalisé'
    } as LesAssembleursLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.AvecDeLAide, ModaliteAccompagnement.Seul]);
  });

  it('should get "Dans un atelier" when value is "Collectif"', (): void => {
    const modalitesAccompagnement: ModaliteAccompagnement[] = formatModalitesAccompagnementField({
      [ACCOMPAGNEMENT_MEDIATION_NUMERIQUE_FIELD]: 'Collectif'
    } as LesAssembleursLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.DansUnAtelier]);
  });

  it('should get "Seul, Avec de l\'aide" when value is "personnalisé"', (): void => {
    const modalitesAccompagnement: ModaliteAccompagnement[] = formatModalitesAccompagnementField({
      [ACCOMPAGNEMENT_MEDIATION_NUMERIQUE_FIELD]: 'personnalisé'
    } as LesAssembleursLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.AvecDeLAide, ModaliteAccompagnement.Seul]);
  });

  it('should get "Dans un atelier" when value is "groupes"', (): void => {
    const modalitesAccompagnement: ModaliteAccompagnement[] = formatModalitesAccompagnementField({
      [ACCOMPAGNEMENT_MEDIATION_NUMERIQUE_FIELD]: 'groupes'
    } as LesAssembleursLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.DansUnAtelier]);
  });

  it('should get "Dans un atelier" when value is "Sur demande en groupe"', (): void => {
    const modalitesAccompagnement: ModaliteAccompagnement[] = formatModalitesAccompagnementField({
      [ACCOMPAGNEMENT_MEDIATION_NUMERIQUE_FIELD]: 'Sur demande en groupe'
    } as LesAssembleursLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.DansUnAtelier]);
  });

  it('should get "Dans un atelier, Seul, Avec de l\'aide" when value is "En groupe ou personnalisé"', (): void => {
    const modalitesAccompagnement: ModaliteAccompagnement[] = formatModalitesAccompagnementField({
      [ACCOMPAGNEMENT_MEDIATION_NUMERIQUE_FIELD]: 'En groupe ou personnalisé'
    } as LesAssembleursLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([
      ModaliteAccompagnement.DansUnAtelier,
      ModaliteAccompagnement.AvecDeLAide,
      ModaliteAccompagnement.Seul
    ]);
  });

  it('should get "Dans un Atelier, Seul" when value is "Individuel, En groupe" for Accompagnement demarches key', (): void => {
    const modalitesAccompagnement: ModaliteAccompagnement[] = formatModalitesAccompagnementField({
      [ACCOMPAGNEMENT_DEMARCHES_FIELD]: 'Individuel, En groupe'
    } as LesAssembleursLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.DansUnAtelier, ModaliteAccompagnement.Seul]);
  });

  it('should get "Seul, Avec de l\'aide" when value is "-----"', (): void => {
    const modalitesAccompagnement: ModaliteAccompagnement[] = formatModalitesAccompagnementField({
      [ACCOMPAGNEMENT_DEMARCHES_FIELD]: '-----'
    } as LesAssembleursLieuMediationNumerique);

    expect(modalitesAccompagnement).toStrictEqual([ModaliteAccompagnement.AvecDeLAide, ModaliteAccompagnement.Seul]);
  });
});
