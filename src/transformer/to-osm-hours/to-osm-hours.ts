import { CleanOperation, CLEAN_OPERATIONS } from './clean-operations';

export const toOsmHours = (hours: string): string =>
  CLEAN_OPERATIONS.reduce(
    (osmHours: string, cleanOperation: CleanOperation): string => osmHours.replace(cleanOperation.selector, cleanOperation.fix),
    hours.toLowerCase().trim()
  );
