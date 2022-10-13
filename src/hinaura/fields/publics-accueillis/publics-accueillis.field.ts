import { PublicAccueilli } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { HinauraLieuMediationNumerique } from '../../helper';

const PUBLICS_ACCUEILLIS_MAP: Map<PublicAccueilli, { keywords: string[] }> = new Map([
  [PublicAccueilli.Adultes, { keywords: ['adultes', 'tout public'] }],
  [PublicAccueilli.FamillesEnfants, { keywords: ['parentalité', 'tout public'] }],
  [PublicAccueilli.Jeunes, { keywords: ['jeunesse', 'tout public'] }],
  [PublicAccueilli.Seniors, { keywords: ['sénior', 'senior', 'tout public'] }],
  [PublicAccueilli.Surdite, { keywords: ['surdité', 'tout public'] }],
  [PublicAccueilli.HandicapsMentaux, { keywords: ['handicap mental', 'tout public'] }],
  [PublicAccueilli.Illettrisme, { keywords: ["personnes en situation d'illettrisme", 'tout public'] }],
  [PublicAccueilli.LanguesEtrangeres, { keywords: ['langue étrangère', 'tout public'] }],
  [PublicAccueilli.UniquementFemmes, { keywords: ['tout public'] }],
  [PublicAccueilli.HandicapsPsychiques, { keywords: ['tout public'] }],
  [PublicAccueilli.DeficienceVisuelle, { keywords: ['cécité', 'déficience visuelle', 'tout public'] }]
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

export const formatPublicAccueilliField = (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique): PublicAccueilli[] =>
  Array.from(
    new Set([
      ...processPublicsAccueillis(hinauraLieuMediationNumerique['Publics accueillis']),
      ...processPublicsAccueillis(hinauraLieuMediationNumerique['Accueil pour les personnes en situation de handicap']),
      ...processPublicsAccueillis(hinauraLieuMediationNumerique['Accompagnement de publics spécifiques'])
    ])
  );
