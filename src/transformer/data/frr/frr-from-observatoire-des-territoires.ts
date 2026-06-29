import axios from 'axios';
import { parse } from 'csv-parse/sync';
import { FrrMap } from '../../fields';
import { frrMapFromTransfer, FrrTransfer } from './transfer';

// Communes classées France Ruralités Revitalisation (FRR), zonage qui remplace les ZRR depuis le 1er juillet 2024.
// Donnée DGCL exposée par l'Observatoire des territoires (ANCT) au niveau communes 2025, France entière (DROM inclus).
// Le CSV renvoie les colonnes codgeo;libgeo;codefrr ; codefrr vaut -9999 pour les communes non classées.
const FRR_DATASET_URL =
  'https://www.observatoire-des-territoires.gouv.fr/outils/cartographie-interactive/api/v1/functions/GC_API_download.php?type=stat&nivgeo=com2025&dataset=frr&indic=codefrr&format=csv';

export const frrFromObservatoireDesTerritoires = async (): Promise<FrrMap> =>
  frrMapFromTransfer(
    parse((await axios.get<string>(FRR_DATASET_URL, { responseType: 'text' })).data, {
      columns: true,
      delimiter: ';'
    }) as FrrTransfer[]
  );
