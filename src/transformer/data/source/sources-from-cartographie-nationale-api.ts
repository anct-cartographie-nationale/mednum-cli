import axios from 'axios';
import { SourceMap, sourceMapFromTransfer } from './transfer/source.transfer';

export const sourcesFromCartographieNationaleApi = async (): Promise<SourceMap> =>
  sourceMapFromTransfer((await axios.get('https://cartographie.societenumerique.gouv.fr/api/v0/sources')).data);
