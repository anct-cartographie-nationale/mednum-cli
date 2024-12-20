const compareTimes = ([hoursA, minutesA]: [string, string], [hoursB, minutesB]: [string, string]): number =>
  hoursA === hoursB && minutesA === minutesB ? 0 : +hoursA * 60 + +minutesA - (+hoursB * 60 + +minutesB);

const combineHoursAndMinutes = ([hours, minutes]: [string, string]): string => `${hours}:${minutes}`;

const combineTimes = (timeA: string, timeB: string): string => `${timeA}-${timeB}`;

const isEarlierTimeFirst = (timeA: [string, string], timeB: [string, string]): boolean => compareTimes(timeA, timeB) < 0;

const laterStartingHour = (timeA: [string, string], timeB: [string, string]): string =>
  isEarlierTimeFirst(timeA, timeB) ? combineHoursAndMinutes(timeB) : combineHoursAndMinutes(timeA);

const earlierStartingHour = (timeA: [string, string], timeB: [string, string]): string =>
  isEarlierTimeFirst(timeA, timeB) ? combineHoursAndMinutes(timeA) : combineHoursAndMinutes(timeB);

const combineRanges = (hoursRangeA: string, hoursRangeB: string): string => `${hoursRangeA},${hoursRangeB}`;

const throwSplitTimeError = (hourRanges?: [string | undefined, string | undefined]): [string, string] => {
  throw new Error(`The hour ranges ${hourRanges?.join(',')} is invalid`);
};

const isValidSplitTime = (times?: [string | undefined, string | undefined]): times is [string, string] => times?.length === 2;

const formatSplitTime = (times?: [string | undefined, string | undefined]): [string, string] =>
  isValidSplitTime(times) ? times : throwSplitTimeError(times);

const splitTime = (hourRanges?: string[]): [string, string] => formatSplitTime([hourRanges?.at(0), hourRanges?.at(1)]);

const rangeToStartingTime = (hoursRangeB: string): [string, string] => splitTime(hoursRangeB.split('-').at(0)?.split(':'));

const rangeToEndingTime = (hoursRangeA: string): [string, string] => splitTime(hoursRangeA.split('-').at(1)?.split(':'));

const orderByEarlierStartingHours = (hoursRangeA: string, hoursRangeB: string): [string, string] =>
  isEarlierTimeFirst(rangeToEndingTime(hoursRangeA), rangeToStartingTime(hoursRangeB))
    ? [hoursRangeA, hoursRangeB]
    : [hoursRangeB, hoursRangeA];

const hasOverlap = (hoursRange1: string, hoursRange2: string): boolean =>
  !isEarlierTimeFirst(rangeToEndingTime(hoursRange1), rangeToStartingTime(hoursRange2));

export const mergeHoursRanges = (hoursRangeA: string, hoursRangeB: string): string =>
  (([earlierRange, laterRange]: [string, string]): string =>
    hasOverlap(earlierRange, laterRange)
      ? combineTimes(
          earlierStartingHour(rangeToStartingTime(earlierRange), rangeToStartingTime(laterRange)),
          laterStartingHour(rangeToEndingTime(earlierRange), rangeToEndingTime(laterRange))
        )
      : combineRanges(earlierRange, laterRange))(orderByEarlierStartingHours(hoursRangeA, hoursRangeB));

const isValidDecomposeMultipleRanges = (hoursRangesSplit?: string[]): hoursRangesSplit is [string, string] =>
  hoursRangesSplit?.length === 2;

const decomposeMultipleRanges = (hoursRanges: string): [string, string] =>
  ((hoursRangesSplit: string[]): [string, string] =>
    isValidDecomposeMultipleRanges(hoursRangesSplit) ? hoursRangesSplit : [hoursRanges, hoursRanges])(hoursRanges.split(','));

const isValidHourRange = (hourRange?: string): hourRange is string => hourRange != null;

const startRange = (startMerged: string): string =>
  ((splitStartHoursRange?: string): string => (isValidHourRange(splitStartHoursRange) ? splitStartHoursRange : startMerged))(
    startMerged.split(',').at(0)
  );

const endRange = (endMerged: string): string =>
  ((splitEndHoursRange?: string): string => (isValidHourRange(splitEndHoursRange) ? splitEndHoursRange : endMerged))(
    endMerged.split(',').at(1)
  );

export const mergeMultipleHoursRanges = (hoursRanges1: string, hoursRanges2: string): string =>
  (([startHoursRange1, endHoursRange1]: [string, string], [startHoursRange2, endHoursRange2]: [string, string]): string =>
    mergeHoursRanges(
      startRange(mergeHoursRanges(startHoursRange1, startHoursRange2)),
      endRange(mergeHoursRanges(endHoursRange1, endHoursRange2))
    ))(decomposeMultipleRanges(hoursRanges1), decomposeMultipleRanges(hoursRanges2));
