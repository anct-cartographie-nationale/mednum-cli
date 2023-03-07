import { DataSource, LieuxMediationNumeriqueMatching } from '../../input';

type RegexResult = {
  year: string;
  month: string;
  day: string;
  time: string;
  timestamp: string;
};

const STANDARD_DATE_REG_EXP: RegExp = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/u;

const STANDARD_DATE_TIME_REG_EXP: RegExp = /^(?<year>\d{4})[-/](?<month>\d{2})[-/](?<day>\d{2}) (?<time>\d{2}:\d{2}:\d{2})$/u;

const FRENCH_DATE_REG_EXP: RegExp = /^(?<day>\d{2})\/(?<month>\d{1,2})\/(?<year>\d{4})$/u;

const FRENCH_DATE_TIME_REG_EXP: RegExp = /^(?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{4}) (?<time>\d{2}:\d{2}:\d{2})$/u;

const TIMESTAMP_REG_EXP: RegExp = /^(?<timestamp>\d{10})/u;

const DATE_REGEXP: RegExp[] = [
  STANDARD_DATE_REG_EXP,
  STANDARD_DATE_TIME_REG_EXP,
  FRENCH_DATE_TIME_REG_EXP,
  FRENCH_DATE_REG_EXP,
  TIMESTAMP_REG_EXP
];

const DEFAULT_TIME: { time: '12:00:00' } = { time: '12:00:00' };

const addMissing0 = (month: string | undefined): string => (month?.length === 1 ? '0' : '');

const toDate = (date?: Partial<RegexResult>): Date =>
  date?.timestamp == null
    ? new Date(`${date?.year}-${addMissing0(date?.month)}${date?.month}-${date?.day}T${date?.time}`)
    : new Date(+date.timestamp * 1000);

const dateRegexpResultFrom = (dateRegexp: RegExp, sourceDate: string): Partial<RegexResult> => ({
  ...DEFAULT_TIME,
  ...dateRegexp.exec(sourceDate)?.groups
});

const formatDate = (dateRegexp: RegExp, sourceDate: string, date: Date): Date =>
  dateRegexp.test(sourceDate) ? toDate(dateRegexpResultFrom(dateRegexp, sourceDate)) : date;

const dateFromRegExp =
  (sourceDate: string) =>
  (date: Date, dateRegexp: RegExp): Date =>
    formatDate(dateRegexp, sourceDate, date);

const removeInvalidChars = (sourceDate: string = ''): string => sourceDate.replace(/[A-Za-zÀ-ÖØ-öø-ÿœ]/gu, ' ').trim();

export const processDate = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Date =>
  DATE_REGEXP.reduce(
    dateFromRegExp(removeInvalidChars(source[matching.date_maj.colonne]?.toString().replace(/\.\d+/u, ''))),
    new Date(1970, 0, 1)
  );
