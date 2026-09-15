import type { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { type CsvRecord, parseCsvRecords, withoutEmptyFields } from '../../../libraries/csv/index.js';
import { firstFile, readTextFileSync } from '../../../libraries/file-system/index.js';

/**
 * Un CSV ne porte que du texte, quand le schéma attend des nombres pour la localisation.
 * Laissée en chaîne, la latitude fait rendre un score nul à la comparaison de deux lieux, et
 * plus aucun doublon n'est jamais détecté. Ce sont les deux seuls champs non textuels du
 * schéma : les convertir ici suffit à rendre cette entrée équivalente à l'entrée JSON.
 *
 * Une coordonnée illisible vaut coordonnée absente. On ne devine rien, en particulier pas la
 * virgule décimale : c'est au producteur du fichier de trancher.
 */
const coordinateField = (name: string, value: string | undefined): Record<string, number> => {
  const coordinate: number = Number(value);

  return value == null || value === '' || !Number.isFinite(coordinate) ? {} : { [name]: coordinate };
};

const withCoordinatesAsNumbers = ({ latitude, longitude, ...fields }: CsvRecord): SchemaLieuMediationNumerique =>
  ({
    ...fields,
    ...coordinateField('latitude', latitude),
    ...coordinateField('longitude', longitude)
  }) as SchemaLieuMediationNumerique;

export const loadLieuxFromCsvFile = (source: string): SchemaLieuMediationNumerique[] =>
  parseCsvRecords(readTextFileSync(firstFile(source) ?? source))
    .map(withoutEmptyFields)
    .map(withCoordinatesAsNumbers);
