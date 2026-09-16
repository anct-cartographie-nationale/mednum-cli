import type { Feature } from '../../../../libraries/ban';
import { type BanResponse, scoreOf } from './ban-response';
import { isCorroborated, type SourceEvidence, withOrigin } from './source-evidence';

/**
 * Un géocodage n'est retenu qu'au delà de ce score : en deçà, la BAN a rapproché l'adresse
 * d'un voisinage plutôt que d'un point précis.
 */
const MINIMUM_BATCH_SCORE = 0.9;

/**
 * Pourquoi une adresse n'a pas pu être située. Ces motifs ne relèvent pas des mêmes corrections :
 * une adresse incomplète se complète chez le producteur, un rapprochement trop éloigné trahit une
 * contradiction entre ses coordonnées et son adresse, et une indisponibilité ne lui doit rien.
 */
export const UNRESOLVED_REASONS = {
  incomplete: "l'adresse de la source est incomplète",
  neverAnswered: 'le référentiel ne connaît pas cette adresse',
  recentlyFailed: 'une tentative récente est restée infructueuse',
  tooWeakWithoutCoordinates: 'rapprochement trop incertain, et la source ne porte aucune coordonnée pour le corroborer',
  tooWeakAndTooFar: 'rapprochement trop incertain, et le point proposé est trop éloigné de celui de la source',
  geocoderUnavailable: 'le géocodeur était indisponible'
} as const;

export type UnresolvedReason = (typeof UNRESOLVED_REASONS)[keyof typeof UNRESOLVED_REASONS];

const isAboveBatchScore = (feature: Feature): boolean => scoreOf(feature) > MINIMUM_BATCH_SCORE;

/**
 * Le rapprochement est retenu s'il se suffit à lui-même — le score dépasse le minimum — ou si la
 * source le corrobore par ses propres coordonnées. Ces deux voies n'ont pas la même conséquence :
 * la seconde verse l'adresse d'origine au complément, pour qu'un lecteur retrouve ce que le
 * producteur avait écrit là où le référentiel n'a pas su le suivre à la lettre.
 */
export const acceptedFeature = (evidence: SourceEvidence, response?: BanResponse | null): Feature | undefined => {
  const feature: Feature | undefined = response?.data.features[0];
  if (feature == null) return undefined;

  return isAboveBatchScore(feature) || isCorroborated(feature, evidence.localisation) ? feature : undefined;
};

/** Ce qui a manqué pour retenir la réponse : son absence, sa faiblesse, ou son éloignement. */
export const rejectionReason = (evidence: SourceEvidence, response?: BanResponse | null): UnresolvedReason => {
  if (response?.data.features[0] == null) return UNRESOLVED_REASONS.neverAnswered;

  return evidence.localisation == null ? UNRESOLVED_REASONS.tooWeakWithoutCoordinates : UNRESOLVED_REASONS.tooWeakAndTooFar;
};

/** Le complément n'accueille l'adresse d'origine que lorsque la proximité seule a emporté la décision. */
export const complementFor = (evidence: SourceEvidence, feature: Feature): string | undefined =>
  isAboveBatchScore(feature) ? undefined : withOrigin(evidence);
