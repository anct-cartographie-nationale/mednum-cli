import { TransformerOptions } from '../../cli/transformer-options';
import { writeErrorsOutputFiles } from '../../output';
import { Report } from '../../report';

export const writeErrorsInFiles =
  (transformerOptions: TransformerOptions) =>
  (report: Report): void => {
    writeErrorsOutputFiles({
      path: transformerOptions.outputDirectory,
      name: transformerOptions.sourceName,
      territoire: transformerOptions.territory
    })(report);
  };
