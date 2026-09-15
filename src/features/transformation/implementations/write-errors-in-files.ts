import type { Output } from '../../../libraries/file-system/index';
import type { Report } from '../domain/index';
import { writeErrorsOutputFiles } from './error-report.write';

export const writeErrorsInFiles =
  (producer: Output) =>
  (report: Report): void => {
    writeErrorsOutputFiles(producer)(report);
  };
