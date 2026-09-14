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

export type { InjectionKey };
