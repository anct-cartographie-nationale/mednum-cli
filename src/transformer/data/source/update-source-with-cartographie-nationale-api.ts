import axios from 'axios';
import { TransformerOptions } from '../../cli/transformer-options';

const API_KEY_HEADER: string = 'x-api-key' as const;

export const updateSourceWithCartographieNationaleApi =
  (transformerOptions: TransformerOptions) =>
  async (hash: string): Promise<void> => {
    if (transformerOptions.cartographieNationaleApiKey == null) return;
    await axios.put(
      `${transformerOptions.cartographieNationaleApiUrl}/sources/${transformerOptions.sourceName}`,
      {
        hash
      },
      {
        headers: {
          [API_KEY_HEADER]: transformerOptions.cartographieNationaleApiKey
        }
      }
    );
  };
