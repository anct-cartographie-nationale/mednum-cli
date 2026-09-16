/**
 * Le contrat d'entrée de la capacité : où se trouve la source, et comment la décoder.
 *
 * `source` peut désigner une URL ou un chemin de fichier, éventuellement suffixé par `@cle`
 * pour ne retenir qu'une propriété du contenu récupéré.
 */
export type SourceSettings = {
  source: string;
  encoding?: string;
  delimiter?: string;
  apiEnvKey?: string;
};

export type RemoteSourceSettings = Omit<SourceSettings, 'source'>;
