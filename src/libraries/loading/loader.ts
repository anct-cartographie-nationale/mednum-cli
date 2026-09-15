import { extensionOf } from '../file-system/path.js';

/**
 * Un chargement se décrit par une liste de règles : la première qui accepte la source la
 * charge. Les règles sont assemblées au point d'entrée de la commande, de sorte que la
 * capacité déclare ce qu'elle veut charger sans figer par quels moyens.
 */

export type Loader<T> = (source: string) => Promise<T[]> | T[];

export type LoadingRule<T> = {
  accepts: (source: string) => boolean;
  load: Loader<T>;
};

export const whenRemote = <T>(load: Loader<T>): LoadingRule<T> => ({
  accepts: (source: string): boolean => source.startsWith('http'),
  load
});

export const whenExtension = <T>(extension: string, load: Loader<T>): LoadingRule<T> => ({
  accepts: (source: string): boolean => extensionOf(source) === extension,
  load
});

export const composeLoader =
  <T>(rules: LoadingRule<T>[]) =>
  async (source: string): Promise<T[]> => {
    const rule: LoadingRule<T> | undefined = rules.find(({ accepts }: LoadingRule<T>): boolean => accepts(source));

    if (rule == null) throw new Error(`Format de source non pris en charge : ${source}`);

    return rule.load(source);
  };
