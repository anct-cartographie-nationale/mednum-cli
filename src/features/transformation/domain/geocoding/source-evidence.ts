import { distanceEnMetres, type Localisation, type LocalisationToValidate } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { Feature } from '../../../../libraries/ban';
import { NO_LOCALISATION, processLocalisation } from '../fields/localisation/localisation.field';
import type { DataSource, LieuxMediationNumeriqueMatching } from '../matching';
import { coordinatesOf } from './ban-response';

/**
 * Sous le score minimal, un rapprochement reste recevable si la source porte elle-même des
 * coordonnées et que la Base Adresse Nationale tombe à portée : deux relevés indépendants qui
 * désignent le même endroit valent mieux qu'un score. Le rayon est le neuvième décile des
 * écarts observés sur les réponses dont la voie est certaine — au delà, on enverrait quelqu'un
 * trop loin.
 */
export const CORROBORATION_RADIUS_IN_METERS = 500;

/**
 * Ce que la source apporte de son côté : ses propres coordonnées, qui permettent de corroborer,
 * et son adresse telle qu'écrite, que le complément recueillera si la réponse n'a été retenue
 * que sur la foi de cette proximité.
 */
export type SourceEvidence = {
  localisation?: LocalisationToValidate;
  origine: string;
  complement?: string;
};

export const isCorroborated = (feature: Feature, localisation?: LocalisationToValidate): boolean =>
  localisation != null && distanceEnMetres(localisation, coordinatesOf(feature)) < CORROBORATION_RADIUS_IN_METERS;

export const withOrigin = ({ complement, origine }: SourceEvidence): string =>
  complement == null || complement.trim() === '' ? origine : `${complement} - ${origine}`;

/**
 * L'adresse telle que la source l'a écrite, avant tout nettoyage : c'est elle que le complément
 * recueille quand seule la proximité a permis de retenir la réponse.
 */
export const rawAddressLabel = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
  ([matching.adresse.colonne, matching.code_postal.colonne, matching.commune.colonne].flat() as string[])
    .map((colonne: string): string => source[colonne]?.toString() ?? '')
    .filter((value: string): boolean => value !== '')
    .join(' ');

/** Rassemble ce que la source apporte de son côté, sans jamais lever sur une adresse invalide. */
export const sourceEvidence = async (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching
): Promise<SourceEvidence> => {
  const localisation: Localisation = await processLocalisation(
    source,
    matching,
    async (): Promise<Localisation> => NO_LOCALISATION
  );
  const complement: string | undefined = source[matching.complement_adresse?.colonne ?? '']?.toString();

  return {
    ...(localisation == null ? {} : { localisation }),
    ...(complement == null ? {} : { complement }),
    origine: rawAddressLabel(source, matching)
  };
};
