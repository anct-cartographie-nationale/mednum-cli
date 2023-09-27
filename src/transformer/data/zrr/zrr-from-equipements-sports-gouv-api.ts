import axios from 'axios';
import { ZrrMap } from '../../fields';
import { zrrMapFromTransfer } from './transfer';

export const zrrFromEquipementsSportsGouvApi = async (): Promise<ZrrMap> =>
  zrrMapFromTransfer(
    (
      await axios.get(
        'https://equipements.sports.gouv.fr/api/explore/v2.0/catalog/datasets/insee-zrr/exports/json?select=codgeo&refine=zrr_simp:"C - Classée en ZRR"'
      )
    ).data
  );
