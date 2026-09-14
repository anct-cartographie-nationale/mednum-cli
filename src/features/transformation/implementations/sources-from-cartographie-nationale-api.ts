import { fetchSources } from '../../../libraries/cartographie-nationale-api';
import type { Api } from '../../../libraries/http';
import { type SourceMap, sourceMapFromTransfer } from './source.transfer';

export const sourcesFromCartographieNationaleApi = (api: Api) => async (): Promise<SourceMap> =>
  sourceMapFromTransfer(await fetchSources(api));
