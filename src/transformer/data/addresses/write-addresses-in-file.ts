import { TransformerOptions } from '../../cli/transformer-options';
import { writeAddresesOutputFiles } from '../../output';
import { AddressReport } from '../../storage';

export const writeAddressesInFiles =
  (transformerOptions: TransformerOptions) =>
  (addresseReport: AddressReport): void => {
    writeAddresesOutputFiles({
      path: transformerOptions.outputDirectory,
      name: transformerOptions.sourceName,
      territoire: transformerOptions.territory
    })(addresseReport);
  };
