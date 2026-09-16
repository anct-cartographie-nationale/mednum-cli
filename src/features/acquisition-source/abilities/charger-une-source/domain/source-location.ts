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
 * Emplacement de la page suivante : la même clé que la source, s'il y en a une.
 */
export const nextSourceLocation = (next: string, key?: string): SourceLocation => ({
  source: next,
  ...(key == null ? {} : { key })
});

export const isRemote = ({ source }: SourceLocation): boolean => source.startsWith('http');
