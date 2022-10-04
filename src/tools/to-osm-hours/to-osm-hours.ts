/* eslint-disable */

import { CleanOperation, CLEAN_OPERATIONS } from './clean-operations';

const clean = (hours: string): string =>
  CLEAN_OPERATIONS.reduce(
    (osmHours: string, cleanOperation: CleanOperation): string => osmHours.replace(cleanOperation.selector, cleanOperation.fix),
    hours.toLowerCase()
  );

const execRegExp = (regExp: RegExp, hours: string): string[] => {
  let m0: RegExpExecArray | null = null;
  const matches: string[] = [];
  while ((m0 = regExp.exec(hours)) !== null) {
    if (m0.index === regExp.lastIndex) {
      regExp.lastIndex++;
    }

    m0.forEach((match: string): void => {
      matches.push(match);
    });
  }
  return matches;
};

export const toOsmHours = (hours: string): string =>
  execRegExp(/\d?\d/gu, clean(hours))
    .map((timeMatch: string): string => (timeMatch.length === 1 ? `0${timeMatch}` : timeMatch))
    .reduce((osmHours: string, timeMatch: string, index: number): string => {
      if (index === 0) return timeMatch;
      if (index % 4 === 0) return `${osmHours},${timeMatch}`;
      if (index % 2 === 0) return `${osmHours}-${timeMatch}`;

      return `${osmHours}:${timeMatch}`;
    }, '');
