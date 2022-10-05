import { CleanOperation, CLEAN_OPERATIONS } from './clean-operations';

const TIME_PARTS_SELECTOR: RegExp = /\d?\d/gu;

const clean = (hours: string): string =>
  CLEAN_OPERATIONS.reduce(
    (osmHours: string, cleanOperation: CleanOperation): string => osmHours.replace(cleanOperation.selector, cleanOperation.fix),
    hours.toLowerCase()
  );

const hasMatch = (matchIteration: IteratorResult<RegExpMatchArray>): boolean =>
  matchIteration.done != null && !matchIteration.done && matchIteration.value[0] != null;

const execRegExp = (regExp: RegExp, hours: string): string[] => {
  const matches: string[] = [];
  const matchesIterator: IterableIterator<RegExpMatchArray> = hours.matchAll(regExp);
  let matchIteration: IteratorResult<RegExpMatchArray> = matchesIterator.next();

  while (hasMatch(matchIteration)) {
    matches.push(matchIteration.value.at(0));
    matchIteration = matchesIterator.next();
  }
  return matches;
};

const isEndTime = (timePartIndex: number): boolean => timePartIndex % 2 === 0;
const TIMES_SEPARATOR: string = '-';

const HOURS_AND_MINUTES_SEPARATOR: string = ':';

const inTimeRangeSeparator = (timePartIndex: number): string =>
  isEndTime(timePartIndex) ? TIMES_SEPARATOR : HOURS_AND_MINUTES_SEPARATOR;

const isTimeRange = (index: number): boolean => index % 4 === 0;
const TIME_RANGES_SEPARATOR: string = ',';

const timePartsSeparator = (timePartIndex: number): string =>
  isTimeRange(timePartIndex) ? TIME_RANGES_SEPARATOR : inTimeRangeSeparator(timePartIndex);

const addMissing0Digit = (timeMatch: string): string => (timeMatch.length === 1 ? `0${timeMatch}` : timeMatch);

const concatTimeParts = (osmHours: string, timeMatch: string, index: number): string =>
  index === 0 ? timeMatch : `${osmHours}${timePartsSeparator(index)}${timeMatch}`;

export const toOsmHours = (hours: string): string =>
  execRegExp(TIME_PARTS_SELECTOR, clean(hours)).map(addMissing0Digit).reduce(concatTimeParts);
