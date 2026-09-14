import type { Output } from '../../../libraries/file-system';
import type { Report } from '../domain';
import { writeErrorsOutputFiles } from './error-report.write';

export const writeErrorsInFiles =
  (producer: Output) =>
  (report: Report): void => {
    writeErrorsOutputFiles(producer)(report);
  };
