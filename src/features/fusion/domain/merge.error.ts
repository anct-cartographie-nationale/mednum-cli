export const MERGE_ERROR_MESSAGES = {
  NO_FILE_FOUND: 'Aucun fichier trouvé pour le modèle fourni.',
  UNSUPPORTED_FORMAT: (format: string): string =>
    `Le format de fichier ${format} n'est pas pris en charge. Veuillez utiliser des fichiers CSV ou JSON.`,
  MIXED_FORMATS:
    "Formats de fichiers mixtes détectés. Veuillez vous assurer que tous les fichiers d'entrée sont soit au format CSV, soit au format JSON."
} as const;

export class MergeError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'MergeError';
  }
}
