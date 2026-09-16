/**
 * Échec de l'interrogation d'un service de géocodage. Le domaine n'a pas à connaître le
 * transport : l'implémentation du port de géocodage traduit ses erreurs réseau en cette
 * erreur, qui fait écarter le lieu sans interrompre la transformation.
 */
export class GeocodingError extends Error {
  public constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'GeocodingError';
  }
}
