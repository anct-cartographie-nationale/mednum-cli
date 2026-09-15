import { type InjectionKey, keyFor } from '../injection/index';

/**
 * Rend compte de l'avancement d'un traitement long. C'est un contrat transverse : une
 * capacité métier signale sa progression sans rien savoir de la sortie standard.
 */
export type Journal = {
  info: (message: string) => void;
};

export const JOURNAL: InjectionKey<Journal> = keyFor<Journal>('journal');

/**
 * Journal par défaut : ne rend compte de rien. C'est le comportement attendu lorsqu'aucun
 * point d'entrée n'a fourni de journal, typiquement sous test.
 */
export const silentJournal: Journal = {
  info: (): void => undefined
};

export const consoleJournal: Journal = {
  info: (message: string): void => {
    console.log(message);
  }
};
