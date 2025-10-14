import { TransformerOptions } from '../../cli/transformer-options';
import { writeAddresesOutputFiles } from '../../output';
import { AddresseReport } from '../../history';

export const writeAddressesInFiles =
  (transformerOptions: TransformerOptions) =>
  (addresseReport: AddresseReport): void => {
    writeAddresesOutputFiles({
      path: transformerOptions.outputDirectory,
      name: transformerOptions.sourceName,
      territoire: transformerOptions.territory
    })(addresseReport);
  };
