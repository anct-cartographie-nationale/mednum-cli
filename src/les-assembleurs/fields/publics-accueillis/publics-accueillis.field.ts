import { PublicAccueilli } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LesAssembleursLieuMediationNumerique } from '../../helpers';

const PUBLICS_ACCUEILLIS_MAP: Map<PublicAccueilli, { keywords: string[] }> = new Map([
  [PublicAccueilli.Adultes, { keywords: ['adultes', 'tout public', 'tous publics', 'Toute personne', 'Tous'] }],
  [PublicAccueilli.FamillesEnfants, { keywords: ['parentalité', 'tout public', 'tous publics', 'Toute personne', 'Tous'] }],
  [
    PublicAccueilli.Jeunes,
    { keywords: ['jeunesse', 'jeunes', 'jeune', 'tout public', 'tous publics', 'Toute personne', 'Tous'] }
  ],
  [
    PublicAccueilli.Seniors,
    { keywords: ['sénior', 'senior', 'séniors', 'seniors', 'tout public', 'tous publics', 'Toute personne', 'Tous'] }
  ],
  [PublicAccueilli.Surdite, { keywords: ['tout public', 'oui', 'tous publics', 'Tous'] }],
  [PublicAccueilli.HandicapsMentaux, { keywords: ['tout public', 'oui', 'tous publics', 'Tous'] }],
  [PublicAccueilli.Illettrisme, { keywords: ['illettrisme', 'tout public', 'tous publics', 'Tous'] }],
  [PublicAccueilli.LanguesEtrangeres, { keywords: ['tout public', 'tous publics', 'Tous'] }],
  [PublicAccueilli.UniquementFemmes, { keywords: ['tout public', 'tous publics', 'Toute personne', 'Tous'] }],
  [PublicAccueilli.HandicapsPsychiques, { keywords: ['tout public', 'oui', 'tous publics', 'Tous'] }],
  [PublicAccueilli.DeficienceVisuelle, { keywords: ['tout public', 'oui', 'tous publics', 'Tous'] }]
]);

const publicsAccueillisToProcessIncludesOnOfTheKeywords = (
  publicsAccueillisToProcess: string,
  publicAccueillis: PublicAccueilli
): boolean =>
  (PUBLICS_ACCUEILLIS_MAP.get(publicAccueillis) ?? { keywords: [] }).keywords.reduce(
    (alreadyIncluded: boolean, keyword: string): boolean =>
      alreadyIncluded || publicsAccueillisToProcess.toLocaleLowerCase().includes(keyword),
    false
  );

const canAppendPublicAccueillis = (publicAccueillis: PublicAccueilli, publicsAccueillisToProcess?: string): boolean =>
  publicsAccueillisToProcess != null &&
  publicsAccueillisToProcessIncludesOnOfTheKeywords(publicsAccueillisToProcess, publicAccueillis);

const processPublicsAccueillis = (publicsAccueillisToProcess?: string): PublicAccueilli[] =>
  Array.from(PUBLICS_ACCUEILLIS_MAP.keys()).reduce(
    (publicsAccueillis: PublicAccueilli[], publicAccueillis: PublicAccueilli): PublicAccueilli[] =>
      canAppendPublicAccueillis(publicAccueillis, publicsAccueillisToProcess)
        ? [...publicsAccueillis, publicAccueillis]
        : publicsAccueillis,
    []
  );

export const formatPublicAccueilliField = (
  lesAssenbleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique
): PublicAccueilli[] =>
  Array.from(
    new Set([
      ...processPublicsAccueillis(lesAssenbleursLieuMediationNumerique['Détail publics']),
      ...processPublicsAccueillis(lesAssenbleursLieuMediationNumerique['Accessibilité PMR'])
    ])
  );
