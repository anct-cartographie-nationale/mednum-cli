export type CleanOperation = {
  selector: RegExp;
  fix: (...matches: string[]) => string;
};

const addMissingTimeSeparator = (minutes: string): string => (minutes.startsWith(':') ? minutes : `:${minutes}`);

const setMinutesIfDefined = (minutes?: string): string => (minutes == null ? ':00' : addMissingTimeSeparator(minutes));

const addMissing0 = (hours: string): string => (hours.length === 1 ? `0${hours}` : hours);

const formatTime = (hours: string, minutes?: string): string => `${addMissing0(hours)}${setMinutesIfDefined(minutes)}`;

const UNIFORMIZE_HYPHEN_SEPARATOR: CleanOperation = {
  selector: /–/g,
  fix: (): string => '-'
};

const REMOVE_MULTIPLE_SPACES: CleanOperation = {
  selector: /\s\s+/g,
  fix: (): string => ' '
};

const ADD_MISSING_TIME_RANGE_SEPARATOR: CleanOperation = {
  selector: /(?<startHour>[0-2]?\d)[hH](?<endHour>[0-2]?\d)[hH]/g,
  fix: (_: string, startHour: string, endHour: string): string => `${startHour}h-${endHour}h`
};

const REMOVE_FORMAT_SPACE_TIME_SEPARATOR: CleanOperation = {
  selector:
    /^(?<startRangeStartHour>[0-2]?\d)h(?<startRangeStarMinute>[0-5]\d)?\s(?<startRangeEndHour>[0-2]?\d)h(?<startRangeEndMinute>[0-5]\d)?\D+(?<endRangeStartHour>[0-2]?\d)h(?<endRangeStartMinute>[0-5]\d)?\s(?<endRangeEndHour>[0-2]?\d)h(?<endRangeEndMinute>[0-5]\d)?$/u,
  fix: (
    _: string,
    startRangeStartHour: string,
    startRangeStarMinute: string,
    startRangeEndHour: string,
    startRangeEndMinute: string,
    endRangeStartHour: string,
    endRangeStarMinute: string,
    endRangeEndHour: string,
    endRangeEndMinute: string
  ): string =>
    `${startRangeStartHour}:${startRangeStarMinute}-${startRangeEndHour}:${startRangeEndMinute},${endRangeStartHour}:${endRangeStarMinute}-${endRangeEndHour}:${endRangeEndMinute}`
};

const REMOVE_H_FOR_HOURS_ONLY_RANGE: CleanOperation = {
  selector: /(?<startHour>[0-2]?\d)[hH]\s?(?<endHour>[0-2]?\d)[hH](?<nextCharacter>\D)/g,
  fix: (_: string, startHour: string, endHour: string, nextCharacter: string): string =>
    `${startHour}:00 ${endHour}:00${nextCharacter}`
};

const REMOVE_H_FOR_HOURS_ONLY_RANGE_SINGLE_H: CleanOperation = {
  selector: /(?<startHour>[0-2]\d)\s(?<endHour>[0-2]?\d)\s*[hH](?<after>\D|$)/g,
  fix: (_: string, startHour: string, endHour: string, after: string): string => `${startHour}:00 ${endHour}:00${after}`
};

const REMOVE_H_FOLLOWED_BY_HOURS: CleanOperation = {
  selector: /[hH]\s?(?<hour>[0-2]?\d)[hH]\s?(?<minute>[0-5]\d)?/g,
  fix: (_: string, hour: string, minute?: string): string => `-${formatTime(hour, minute)}`
};

const REMOVE_H_FOLLOWED_BY_MINUTES: CleanOperation = {
  selector: /[hH]\s?(?<hourLastNumber>\d)/g,
  fix: (_: string, hourLastNumber: string): string => `:${hourLastNumber}`
};

const REMOVE_H_FOLLOWED_BY_A_SPACE: CleanOperation = {
  selector: /[hH]\s/g,
  fix: (): string => ' '
};

const REMOVE_H_FOLLOWED_BY_A_SEPARATOR: CleanOperation = {
  selector: /[hH](?<separator>[-/à])/g,
  fix: (_: string, separator: string): string => separator
};

const REMOVE_WHITE_SPACES: CleanOperation = {
  selector: /\s/g,
  fix: (): string => ''
};

const FORMAT_ET_SEPARATORS: CleanOperation = {
  selector:
    /^(?<startTimeStartRange>.*)[à/,-](?<startTimeEndRange>.*)\s?(?:et|&amp;)\s?(?<endTimeStartRange>.*)[à/,-](?<endTimeEndRange>.*)$/u,
  fix: (
    _: string,
    startTimeStartRange: string,
    startTimeEndRange: string,
    endTimeStartRange: string,
    endTimeEndRange: string
  ): string => `${startTimeStartRange}-${startTimeEndRange},${endTimeStartRange}-${endTimeEndRange}`
};

const FORMAT_LITERARY_TIME_SEPARATORS: CleanOperation = {
  selector: /^(?<startTimeStartRange>.*)à(?<startTimeEndRange>.*)[-_/,](?<endTimeStartRange>.*)à(?<endTimeEndRange>.*)$/u,
  fix: (
    _: string,
    startTimeStartRange: string,
    startTimeEndRange: string,
    endTimeStartRange: string,
    endTimeEndRange: string
  ): string => `${startTimeStartRange}-${startTimeEndRange},${endTimeStartRange}-${endTimeEndRange}`
};

const FORMAT_LITERARY_TIME_SEPARATORS_NO_RANGE_SEPARATOR: CleanOperation = {
  selector: /^(?<startTimeStartRange>.*)à(?<startTimeEndRange>.*\d)\s(?<endTimeStartRange>\d.*)à(?<endTimeEndRange>.*)$/u,
  fix: (
    _: string,
    startTimeStartRange: string,
    startTimeEndRange: string,
    endTimeStartRange: string,
    endTimeEndRange: string
  ): string => `${startTimeStartRange}-${startTimeEndRange},${endTimeStartRange}-${endTimeEndRange}`
};

const REPLACE_LITERARY_TIME_SEPARATORS: CleanOperation = {
  selector: /(?<previous>\d.*?\d?)\s*[àèa]\s*(?<next>\d.*\d)/g,
  fix: (_: string, previous: string, next: string): string => `${previous}-${next}`
};

const REMOVE_SEPARATOR_IN_TEXT: CleanOperation = {
  selector: /[a-zA-ZÀ-ú*.'_]+-[a-zA-ZÀ-ú*.'_]+/g,
  fix: (): string => ''
};

const REMOVE_ADDITIONAL_INFORMATION_TEXT_IN_PARENTHESIS: CleanOperation = {
  selector: /\(.*\)/u,
  fix: (): string => ''
};

const REMOVE_NUMBERS_IN_ADDITIONAL_INFORMATION_TEXT: CleanOperation = {
  selector: /1er|\d?\d\sjours|[0-3]\d\/[01][1-9]\/\d\d\d\d|\d\s*[a-z]+\s*(?:\/|sur)\s*\d/g,
  fix: (): string => ''
};

const REMOVE_ADDITIONAL_INFORMATION_TEXT: CleanOperation = {
  selector: /[a-zA-ZÀ-úû*.'_(|>]+/g,
  fix: (): string => ''
};

const REMOVE_ORPHAN_DIGITS: CleanOperation = {
  selector: /^\s*\d+\s*(?<ranges>[0-2]\d-[0-5]\d)/u,
  fix: (_: string, ranges: string): string => `${ranges}`
};

const FORMAT_MISSING_MINUTES_DIGIT: CleanOperation = {
  selector: /(?<hour>\d):(?<minuteToFix>\d)(?<followingCharacter>\D|$)/u,
  fix: (_: string, hour: string, minuteToFix: string, followingCharacter: string): string =>
    `${hour}:${minuteToFix}0${followingCharacter}`
};

const TRIM: CleanOperation = {
  selector: /(?<textToTrim>.*)/u,
  fix: (textToTrim: string): string => textToTrim.trim()
};

const FORMAT_MISSING_MINUTE_SEPARATOR: CleanOperation = {
  selector: /(?<hour>[0-2]\d)(?<minute>[0-5]\d)/g,
  fix: (_: string, hour: string, minute: string): string => `${hour}:${minute}`
};

const FORMAT_MISSING_TIME_SEPARATOR: CleanOperation = {
  selector: /^(?<startHour>[0-2]?\d)(?<startMinute>:[0-5]\d)(?<endtHour>[0-2]?\d)$/u,
  fix: (_: string, startHour: string, startMinute: string, endHour: string): string => `${startHour}:${startMinute}-${endHour}`
};

const FORMAT_SPACE_RANGES_SEPARATORS: CleanOperation = {
  selector:
    /^(?<startTimeStartRange>\d?.*\d)\s?[-/\s]\s?(?<startTimeEndRange>.+\d)\s+(?<endTimeStartRange>\d.+\d)\s?[-/\s]\s?(?<endTimeEndRange>.+\d)$/,
  fix: (
    _: string,
    startTimeStartRange: string,
    startTimeEndRange: string,
    endTimeStartRange: string,
    endTimeEndRange: string
  ): string => `${startTimeStartRange}-${startTimeEndRange},${endTimeStartRange}-${endTimeEndRange}`
};

const FORMAT_SPACE_TIMES_SEPARATORS: CleanOperation = {
  selector:
    /^(?<startTimeStartRange>\d\d:\d\d)\s(?<startTimeEndRange>\d\d:\d\d)\s-\s(?<endTimeStartRange>\d\d:\d\d)\s(?<endTimeEndRange>\d\d:\d\d)$/,
  fix: (
    _: string,
    startTimeStartRange: string,
    startTimeEndRange: string,
    endTimeStartRange: string,
    endTimeEndRange: string
  ): string => `${startTimeStartRange}-${startTimeEndRange},${endTimeStartRange}-${endTimeEndRange}`
};

const FORMAT_SPACE_TIME_SEPARATOR: CleanOperation = {
  selector: /^(?<startTime>\d.+\d)\s(?<endTime>\d.*\d)$/u,
  fix: (_: string, startTime: string, endTime: string): string => `${startTime}-${endTime}`
};

const FORMAT_HYPHEN_RANGES_SEPARATORS: CleanOperation = {
  selector: /^(?<startTimeStartRange>.*)[/-](?<startTimeEndRange>.*)-(?<endTimeStartRange>.*)[/-](?<endTimeEndRange>.*)$/u,
  fix: (
    _: string,
    startTimeStartRange: string,
    startTimeEndRange: string,
    endTimeStartRange: string,
    endTimeEndRange: string
  ): string => `${startTimeStartRange}-${startTimeEndRange},${endTimeStartRange}-${endTimeEndRange}`
};

const REMOVE_MULTIPLE_SAME_SEPARATOR: CleanOperation = {
  selector: /(?<separator>[-/,:])+/g,
  fix: (_: string, separator: string): string => `${separator}`
};

const REMOVE_HEADING_SEPARATOR: CleanOperation = {
  selector: /^[/,;:-]/u,
  fix: (): string => ''
};

const REMOVE_TRAILING_SEPARATOR: CleanOperation = {
  selector: /[/,;:-]$/u,
  fix: (): string => ''
};

const REMOVE_TIME_SEPARATOR_AFTER_RANGE_SEPARATOR: CleanOperation = {
  selector: /,:/g,
  fix: (): string => ','
};

const REMOVE_USELESS_TIME_SEPARATOR: CleanOperation = {
  selector: /:(?<nonDigitChar>\D)/g,
  fix: (_: string, nonDigitChar: string): string => `${nonDigitChar}`
};

const FORMAT_SINGLE_RANGE: CleanOperation = {
  selector: /^(?<startHour>[0-2]?\d)(?<startMinute>:[0-5]\d)?[-/à,](?<endHour>[0-2]?\d)(?<endMinute>:[0-5]\d)?$/u,
  fix: (
    _: string,
    startHour: string,
    startMinute: string | undefined = undefined,
    endHour: string,
    endMinute: string | undefined = undefined
  ): string => `${formatTime(startHour, startMinute)}-${formatTime(endHour, endMinute)}`
};

const FORMAT_TWO_TIMES_RANGES: CleanOperation = {
  selector:
    /^(?<startHourStartRange>[0-2]?\d)(?<startMinuteStartRange>:[0-5]\d)?[-/à,]?(?<endHourStartRange>[0-2]?\d)(?<endMinuteStartRange>:[0-5]\d)?[|/;,](?<startHourEndRange>[0-2]?\d)(?<startMinuteEndRange>:[0-5]\d)?[-/à,]?(?<endHourEndRange>[0-2]?\d)(?<endMinuteEndRange>:[0-5]\d)?$/u,
  fix: (
    _: string,
    startHourStartRange: string,
    startMinuteStartRange: string | undefined = undefined,
    endHourStartRange: string,
    endMinuteStartRange: string | undefined = undefined,
    startHourEndRange: string,
    startMinuteEndRange: string | undefined = undefined,
    endHourEndRange: string,
    endMinuteEndRange?: string
  ): string =>
    `${formatTime(startHourStartRange, startMinuteStartRange)}-${formatTime(
      endHourStartRange,
      endMinuteStartRange
    )},${formatTime(startHourEndRange, startMinuteEndRange)}-${formatTime(endHourEndRange, endMinuteEndRange)}`
};

const REMOVE_NO_TIME_RANGE: CleanOperation = {
  selector: /^[0-2]?\d(?::[0-5]\d)?$/,
  fix: (): string => ''
};

const REMOVE_TIME_EXTRA_DIGITS: CleanOperation = {
  selector: /(?<digitsToKeep>\d\d)\d/g,
  fix: (_: string, digitsToKeep: string): string => digitsToKeep
};

const CLEAN_WHITESPACE_SEPARATORS: CleanOperation[] = [
  FORMAT_SPACE_TIMES_SEPARATORS,
  FORMAT_SPACE_RANGES_SEPARATORS,
  FORMAT_SPACE_TIME_SEPARATOR
];

const CLEAN_ALL_SEPARATORS: CleanOperation[] = [
  FORMAT_MISSING_MINUTE_SEPARATOR,
  FORMAT_MISSING_TIME_SEPARATOR,
  REMOVE_TIME_SEPARATOR_AFTER_RANGE_SEPARATOR,
  REMOVE_MULTIPLE_SAME_SEPARATOR,
  REMOVE_HEADING_SEPARATOR,
  REMOVE_TRAILING_SEPARATOR,
  REMOVE_USELESS_TIME_SEPARATOR,
  FORMAT_HYPHEN_RANGES_SEPARATORS
];

const FINAL_OSM_FORMATTING: CleanOperation[] = [
  FORMAT_SINGLE_RANGE,
  FORMAT_TWO_TIMES_RANGES,
  REMOVE_NO_TIME_RANGE,
  REMOVE_TIME_EXTRA_DIGITS
];

export const CLEAN_OPERATIONS: CleanOperation[] = [
  UNIFORMIZE_HYPHEN_SEPARATOR,
  REMOVE_MULTIPLE_SPACES,
  ADD_MISSING_TIME_RANGE_SEPARATOR,
  REMOVE_FORMAT_SPACE_TIME_SEPARATOR,
  REMOVE_H_FOR_HOURS_ONLY_RANGE,
  REMOVE_H_FOR_HOURS_ONLY_RANGE_SINGLE_H,
  REMOVE_H_FOLLOWED_BY_HOURS,
  REMOVE_H_FOLLOWED_BY_MINUTES,
  REMOVE_H_FOLLOWED_BY_A_SPACE,
  REMOVE_H_FOLLOWED_BY_A_SEPARATOR,
  FORMAT_ET_SEPARATORS,
  FORMAT_LITERARY_TIME_SEPARATORS,
  FORMAT_LITERARY_TIME_SEPARATORS_NO_RANGE_SEPARATOR,
  REPLACE_LITERARY_TIME_SEPARATORS,
  REMOVE_SEPARATOR_IN_TEXT,
  REMOVE_ADDITIONAL_INFORMATION_TEXT_IN_PARENTHESIS,
  REMOVE_NUMBERS_IN_ADDITIONAL_INFORMATION_TEXT,
  REMOVE_ADDITIONAL_INFORMATION_TEXT,
  REMOVE_ORPHAN_DIGITS,
  FORMAT_MISSING_MINUTES_DIGIT,
  TRIM,
  ...CLEAN_WHITESPACE_SEPARATORS,
  REMOVE_WHITE_SPACES,
  ...CLEAN_ALL_SEPARATORS,
  ...FINAL_OSM_FORMATTING
];
