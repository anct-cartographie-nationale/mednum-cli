import { keyFor as piqureKeyFor, piqure } from 'piqure';
import type { Inject, InjectionKey, KeyFor, Provide, ProvideLazy } from './injection-key';

const container = piqure(new Map());

/**
 * Déclare le contrat d'une dépendance sans en connaître l'implémentation.
 */
export const keyFor: KeyFor = piqureKeyFor;

/**
 * Fournit l'implémentation concrète d'un contrat. À n'appeler que depuis un point d'entrée,
 * c'est à dire une commande de `src/cli`.
 */
export const provide: Provide = container.provide;

/**
 * Fournit l'implémentation concrète d'un contrat, construite à la première injection.
 */
export const provideLazy: ProvideLazy = container.provideLazy;

/**
 * Récupère l'implémentation fournie pour un contrat.
 */
export const inject: Inject = container.inject;

/**
 * Récupère l'implémentation fournie pour un contrat, ou se rabat sur une valeur par défaut
 * quand aucune ne l'a été. Réservé aux contrats optionnels, dont l'absence est un choix
 * légitime : un journal muet plutôt qu'un plantage.
 */
export const injectOr = <T>(key: InjectionKey<T>, fallback: T): T => {
  try {
    return inject(key);
  } catch {
    return fallback;
  }
};

export type { InjectionKey };
