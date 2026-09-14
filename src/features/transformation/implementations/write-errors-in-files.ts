import type { Output } from '../../../libraries/file-system/index.js';
import type { Report } from '../domain/index.js';
import { writeErrorsOutputFiles } from './error-report.write.js';

export const writeErrorsInFiles =
  (producer: Output) =>
  (report: Report): void => {
    writeErrorsOutputFiles(producer)(report);
  };
