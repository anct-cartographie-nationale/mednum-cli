import { ModaliteAccompagnement } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LesAssembleursLieuMediationNumerique } from '../../helpers';

const MODALITE_ACCOMPAGNEMENT_MAP: Map<ModaliteAccompagnement, { keywords: string[] }> = new Map([
  [
    ModaliteAccompagnement.DansUnAtelier,
    { keywords: ['en groupe', 'accompagnement collectif', 'oui en collectif', 'collectif', 'groupes'] }
  ],
  [ModaliteAccompagnement.AMaPlace, { keywords: ['faire à la place de'] }],
  [
    ModaliteAccompagnement.AvecDeLAide,
    { keywords: ['accompagnement individuel', 'accompagnement collectif', 'suivi personnalisé', 'personnalisé', '-----'] }
  ],
  [
    ModaliteAccompagnement.Seul,
    { keywords: ['individuel', 'individuellement', 'accompagnement individuel', 'suivi personnalisé', 'personnalisé', '-----'] }
  ]
]);

const modalitesAccompagnementToProcessIncludesOnOfTheKeywords = (
  modalitesToProcess: string,
  modalite: ModaliteAccompagnement
): boolean =>
  (MODALITE_ACCOMPAGNEMENT_MAP.get(modalite) ?? { keywords: [] }).keywords.reduce(
    (alreadyIncluded: boolean, keyword: string): boolean =>
      alreadyIncluded || modalitesToProcess.toLocaleLowerCase().includes(keyword),
    false
  );

const canAppendModaliteAccompagement = (modalite: ModaliteAccompagnement, modalitesToProcess?: string): boolean =>
  modalitesToProcess != null && modalitesAccompagnementToProcessIncludesOnOfTheKeywords(modalitesToProcess, modalite);

const processModalitesAccompagnement = (modalitesToProcess?: string): ModaliteAccompagnement[] =>
  Array.from(MODALITE_ACCOMPAGNEMENT_MAP.keys()).reduce(
    (modalites: ModaliteAccompagnement[], modalite: ModaliteAccompagnement): ModaliteAccompagnement[] =>
      canAppendModaliteAccompagement(modalite, modalitesToProcess) ? [...modalites, modalite] : modalites,
    []
  );

export const formatModalitesAccompagnementField = (
  lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique
): ModaliteAccompagnement[] =>
  Array.from(
    new Set([
      ...processModalitesAccompagnement(lesAssembleursLieuMediationNumerique['Accompagnement démarches']),
      ...processModalitesAccompagnement(lesAssembleursLieuMediationNumerique['Accompagnement médiation numérique'])
    ])
  );
