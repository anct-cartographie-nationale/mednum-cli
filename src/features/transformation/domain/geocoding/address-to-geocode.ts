import { type AdresseToValidate, nettoyerVoiePourRecherche } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { BanAddressRow } from '../../../../libraries/ban';

/**
 * L'adresse telle que le dépôt la reconstitue — commune et code postal complétés par le
 * référentiel des communes — mais sans la validation qu'impose `Adresse`. C'est cette forme,
 * et non les colonnes brutes, qui sert de question à la Base Adresse Nationale et de clé au
 * cache : la question posée est ainsi exactement l'adresse qui sera publiée.
 */
export type NormalizedAddress = AdresseToValidate;

/**
 * La voie telle qu'on la soumet au géocodeur. C'est aussi la clé du cache : ce que l'on retient
 * doit être indexé par la question posée, non par une variante jamais demandée.
 */
const searchableVoie = (voie: string): string => nettoyerVoiePourRecherche(voie);

export const addressLabel = ({ voie, code_postal, commune }: NormalizedAddress): string =>
  `${searchableVoie(voie)} ${code_postal} ${commune}`;

export const isMissingFields = ({ voie, code_postal, commune }: NormalizedAddress): boolean =>
  commune === '' || code_postal === '' || voie === '';

export const banRowFor = (adresse: NormalizedAddress): BanAddressRow => ({
  voie: searchableVoie(adresse.voie),
  codePostal: adresse.code_postal,
  commune: adresse.commune
});
