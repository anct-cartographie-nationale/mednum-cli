import type { RegleDeNettoyage } from '@gouvfr-anct/lieux-de-mediation-numerique';

const LIBELLES_DE_SERVICE_PRIS_POUR_DES_NOMS: RegExp =
  /^(Réussir mes échanges avec France Travail|Découvrir et m'approprier les services de francetravail\.fr|Mobiliser mes services numériques France Travail|Ordinateur|Wifi)$/u;

const NOM_QUI_DESIGNE_UN_SERVICE: RegleDeNettoyage = {
  nom: 'libellé de service pris pour un nom de lieu',
  selecteur: LIBELLES_DE_SERVICE_PRIS_POUR_DES_NOMS,
  corriger: (): string => ''
};

export const REGLES_NOM_LOCALES: readonly RegleDeNettoyage[] = [NOM_QUI_DESIGNE_UN_SERVICE];
