import { fetchSources } from '../../../libraries/cartographie-nationale-api/index.js';
import type { Api } from '../../../libraries/http/index.js';
import { type SourceMap, sourceMapFromTransfer } from './source.transfer.js';

export const sourcesFromCartographieNationaleApi = (api: Api) => async (): Promise<SourceMap> =>
  sourceMapFromTransfer(await fetchSources(api));
