import axios from 'axios';
import { TransformerOptions } from '../../cli/transformer-options';
import { SourceTransfer } from './transfer/source.transfer';

const API_KEY_HEADER: string = 'x-api-key' as const;

export const updateSourceWithCartographieNationaleApi =
  (transformerOptions: TransformerOptions) =>
  async (source: SourceTransfer): Promise<void> => {
    if (transformerOptions.cartographieNationaleApiKey == null) return;
    await axios.put(`${transformerOptions.cartographieNationaleApiUrl}/sources`, source, {
      headers: {
        [API_KEY_HEADER]: transformerOptions.cartographieNationaleApiKey
      }
    });
  };
