import axios from 'axios';
import { authHeader, headers } from '../../../common';
import type { TransformerOptions } from '../../cli/transformer-options';

export const updateSourceWithCartographieNationaleApi =
  (transformerOptions: TransformerOptions) =>
  async (hash: string): Promise<void> => {
    if (transformerOptions.cartographieNationaleApiKey == null) return;
    await axios.put(
      `${transformerOptions.cartographieNationaleApiUrl}/sources/${transformerOptions.sourceName}`,
      { hash },
      headers(authHeader(transformerOptions.cartographieNationaleApiKey))
    );
  };
