import { putSourceHash } from '../../../libraries/cartographie-nationale-api/index.js';
import type { Api } from '../../../libraries/http/index.js';

export const updateSourceWithCartographieNationaleApi =
  (api: Api, sourceName: string) =>
  async (hash: string): Promise<void> => {
    if (api.key == null) return;
    await putSourceHash(api, sourceName, hash);
  };
