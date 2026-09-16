import type { keyFor } from 'piqure';

/**
 * Contrat d'une dépendance : un identifiant typé, sans aucune connaissance de l'implémentation.
 *
 * piqure n'exporte pas son propre type de clé, or ce paquet émet ses déclarations
 * (`declaration: true`) : re-exporter directement ses fonctions échouerait avec TS4023
 * (« has or is using name 'InjectionKey' [...] but cannot be named »). On dérive donc le type
 * depuis la signature de `keyFor`, ce qui le rend nommable tout en restant exactement celui
 * de piqure.
 */
export type InjectionKey<T> = ReturnType<typeof keyFor<T>>;

export type KeyFor = <T>(description: string) => InjectionKey<T>;

export type Provide = <T>(key: InjectionKey<T>, injected: T) => void;

export type ProvideLazy = <T>(key: InjectionKey<T>, provider: () => T) => void;

export type Inject = <T>(key: InjectionKey<T>) => T;
