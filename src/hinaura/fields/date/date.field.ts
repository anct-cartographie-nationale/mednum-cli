import { HinauraLieuMediationNumerique } from '../../helper';

type RegexResult = {
  year: string;
  month: string;
  day: string;
  time: string;
};

const parseHinauraDate = (hinauraDate: string): Partial<RegexResult> | undefined =>
  /^(?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{4}) (?<time>\d{2}:\d{2}:\d{2})$/u.exec(hinauraDate)?.groups;

const toDate = (hinauraDate?: Partial<RegexResult>): Date =>
  new Date(`${hinauraDate?.year}-${hinauraDate?.month}-${hinauraDate?.day}T${hinauraDate?.time}`);

export const processDate = (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique): Date =>
  toDate(parseHinauraDate(hinauraLieuMediationNumerique.datetime_latest));
