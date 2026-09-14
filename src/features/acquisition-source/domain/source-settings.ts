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

/**
 * Les pages suivantes sont demandées sans le jeton d'authentification. Ce comportement est
 * repris tel quel de l'implémentation d'origine, où l'appel récursif ne transmettait que
 * l'encodage et le délimiteur.
 */
export const nextPageSettings = ({ encoding, delimiter }: RemoteSourceSettings): RemoteSourceSettings => ({
  ...(encoding == null ? {} : { encoding }),
  ...(delimiter == null ? {} : { delimiter })
});
