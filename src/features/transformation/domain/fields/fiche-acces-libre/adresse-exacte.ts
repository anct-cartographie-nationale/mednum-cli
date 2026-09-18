import { codeCommuneDe } from '../../../../../libraries/collectivites';

const NUMERO_EN_TETE = /^\s*(\d+)\s*(bis|ter|quater|b|t)?\b/i;

const sansAccent = (valeur: string): string => valeur.normalize('NFD').replace(/[̀-ͯ]/gu, '');

const normaliser = (valeur: string): string =>
  sansAccent(valeur ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, ' ')
    .trim();

export const numeroDeVoie = (valeur: string): string => {
  const trouve: RegExpExecArray | null = NUMERO_EN_TETE.exec(valeur ?? '');

  return trouve == null ? '' : `${trouve[1]}${(trouve[2] ?? '').toLowerCase().charAt(0)}`;
};

const sansNumero = (adresse: string): string => (adresse ?? '').replace(NUMERO_EN_TETE, '');

const cleOuRien = (codeInsee: string, numero: string, voie: string): string | undefined =>
  numero === '' || voie === '' ? undefined : `${codeCommuneDe(codeInsee)}|${numero}|${voie}`;

export const adresseExacte = (codeInsee: string, numero: string, voie: string): string | undefined =>
  cleOuRien(codeInsee, numeroDeVoie(numero), normaliser(voie));

export const adresseExacteDuLieu = (codeInsee: string, adresse: string): string | undefined =>
  cleOuRien(codeInsee, numeroDeVoie(adresse), normaliser(sansNumero(adresse)));
