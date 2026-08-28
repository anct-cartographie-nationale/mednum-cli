import axios from 'axios';
import type { TransformerOptions } from '../../cli/transformer-options';
import { type SourceMap, sourceMapFromTransfer } from './transfer/source.transfer';

export const sourcesFromCartographieNationaleApi = async (transformerOptions: TransformerOptions): Promise<SourceMap> =>
  sourceMapFromTransfer((await axios.get(`${transformerOptions.cartographieNationaleApiUrl}/sources`)).data);
