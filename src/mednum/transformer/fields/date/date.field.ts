import { DataSource, LieuxMediationNumeriqueMatching } from '../../input';

type RegexResult = {
  year: string;
  month: string;
  day: string;
  time: string;
};

export class DateCannotBeEmptyError extends Error {
  constructor() {
    super('Date cannot be empty');
  }
}

const STANDARD_DATE_REG_EXP: RegExp = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/u;

const FRENCH_DATE_REG_EXP: RegExp = /^(?<day>\d{2})\/(?<month>\d{1,2})\/(?<year>\d{4})$/u;

const FRENCH_DATE_TIME_REG_EXP: RegExp = /^(?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{4}) (?<time>\d{2}:\d{2}:\d{2})$/u;

const DATE_REGEXP: RegExp[] = [STANDARD_DATE_REG_EXP, FRENCH_DATE_TIME_REG_EXP, FRENCH_DATE_REG_EXP];

const DEFAULT_TIME: { time: '00:00:00' } = { time: '00:00:00' };

const addMissing0 = (month: string | undefined): string => (month?.length === 1 ? '0' : '');

const toDate = (date?: Partial<RegexResult>): Date =>
  new Date(`${date?.year}-${addMissing0(date?.month)}${date?.month}-${date?.day}T${date?.time}`);

const dateRegexpResultFrom = (dateRegexp: RegExp, sourceDate: string): Partial<RegexResult> => ({
  ...DEFAULT_TIME,
  ...dateRegexp.exec(sourceDate)?.groups
});

const throwDateCannotBeEmptyError = (): Date => {
  throw new DateCannotBeEmptyError();
};

const formatDate = (dateRegexp: RegExp, sourceDate: string, date: Date): Date =>
  dateRegexp.test(sourceDate) ? toDate(dateRegexpResultFrom(dateRegexp, sourceDate)) : date;

const dateFromRegExp =
  (sourceDate: string) =>
  (date: Date, dateRegexp: RegExp): Date =>
    sourceDate === '' ? throwDateCannotBeEmptyError() : formatDate(dateRegexp, sourceDate, date);

const removeInvalidChars = (sourceDate: string = ''): string => sourceDate.replace(/[A-Za-zÀ-ÖØ-öø-ÿœ]/gu, '').trim();

export const processDate = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Date =>
  DATE_REGEXP.reduce(dateFromRegExp(removeInvalidChars(source[matching.date_maj.colonne])), new Date(NaN));
