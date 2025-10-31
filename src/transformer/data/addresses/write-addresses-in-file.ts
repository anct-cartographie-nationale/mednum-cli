import { TransformerOptions } from '../../cli/transformer-options';
import { writeAddresesOutputFiles } from '../../output';
import { AddressCache } from '../../storage';

export const writeAddressesInFiles =
  (transformerOptions: TransformerOptions) =>
  (addresseReport: AddressCache): void => {
    writeAddresesOutputFiles({
      path: transformerOptions.outputDirectory,
      name: transformerOptions.sourceName,
      territoire: transformerOptions.territory
    })(addresseReport);
  };
