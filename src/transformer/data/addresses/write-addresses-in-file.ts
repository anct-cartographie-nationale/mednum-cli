import type { TransformerOptions } from '../../cli/transformer-options';
import { writeAddresesOutputFiles } from '../../output';
import type { AddressCache } from '../../storage';

export const writeAddressesInFiles =
  (transformerOptions: TransformerOptions) =>
  (addresseCache: AddressCache): void => {
    writeAddresesOutputFiles({
      path: transformerOptions.outputDirectory,
      name: transformerOptions.sourceName,
      territoire: transformerOptions.territory
    })(addresseCache);
  };
