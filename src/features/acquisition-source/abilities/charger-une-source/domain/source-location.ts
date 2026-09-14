export type SourceLocation = {
  source: string;
  key?: string;
};

/**
 * Une source s'écrit `emplacement` ou `emplacement@cle`, la clé désignant la propriété du
 * contenu qui porte les enregistrements.
 */
export const sourceLocationOf = (source: string): SourceLocation => {
  const [location, key] = source.split('@');
  return { source: location ?? '', ...(key == null ? {} : { key }) };
};

/**
 * Emplacement de la page suivante. Quand la source n'a pas de clé, la chaîne `undefined` est
 * concaténée à l'URL : comportement repris tel quel de l'implémentation d'origine.
 */
export const nextSourceLocation = (next: string, key?: string): SourceLocation => sourceLocationOf(`${next}@${key}`);

export const isRemote = ({ source }: SourceLocation): boolean => source.startsWith('http');
