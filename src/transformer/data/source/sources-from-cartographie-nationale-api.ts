import axios from 'axios';
import { TransformerOptions } from '../../cli/transformer-options';
import { SourceMap, sourceMapFromTransfer } from './transfer/source.transfer';

export const sourcesFromCartographieNationaleApi = async (transformerOptions: TransformerOptions): Promise<SourceMap> =>
  sourceMapFromTransfer((await axios.get(`${transformerOptions.cartographieNationaleApiUrl}/sources`)).data);
