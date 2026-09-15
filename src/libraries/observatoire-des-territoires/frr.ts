import axios from 'axios';
import { parseCsvRecords } from '../csv/index';

// Communes classées France Ruralités Revitalisation (FRR), zonage qui remplace les ZRR depuis le 1er juillet 2024.
// Donnée DGCL exposée par l'Observatoire des territoires (ANCT) au niveau communes 2025, France entière (DROM inclus).
// Le CSV renvoie les colonnes codgeo;libgeo;codefrr ; codefrr vaut -9999 pour les communes non classées.
const FRR_DATASET_URL =
  'https://www.observatoire-des-territoires.gouv.fr/outils/cartographie-interactive/api/v1/functions/GC_API_download.php?type=stat&nivgeo=com2025&dataset=frr&indic=codefrr&format=csv';

export type FrrRow = {
  codgeo: string;
  codefrr: string;
};

export const fetchFrrRows = async (): Promise<FrrRow[]> =>
  parseCsvRecords<FrrRow>((await axios.get<string>(FRR_DATASET_URL, { responseType: 'text' })).data, ';');
