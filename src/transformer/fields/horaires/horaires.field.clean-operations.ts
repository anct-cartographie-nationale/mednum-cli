export type HorairesFieldCleanOperation = {
  selector: RegExp;
  fix: (...matches: string[]) => string;
};

const INSERT_SPACE_AFTER_H_OR_HEURE: HorairesFieldCleanOperation = {
  selector: /(heure|h)(?=[A-Za-z])/gu,
  fix: (match: string) => `${match} `
};

const REPLACE_SHORT_LUNDI: HorairesFieldCleanOperation = {
  selector: /(?:^|\s)l(?:un?)?(?<afterDay>\s|\d)/gu,
  fix: (_: string, afterDay: string): string => ` lundi ${afterDay}`
};

const REPLACE_SHORT_MARDI: HorairesFieldCleanOperation = {
  selector: /(?:^|\s)m(?:ar?)(?<afterDay>\s|\d)/gu,
  fix: (_: string, afterDay: string): string => ` mardi ${afterDay}`
};

const REPLACE_SHORT_MERCREDI: HorairesFieldCleanOperation = {
  selector: /(?:^|\s)m(?:er?)(?<afterDay>\s|\d)/gu,
  fix: (_: string, afterDay: string): string => ` mercredi ${afterDay}`
};

const REPLACE_SHORT_JEUDI: HorairesFieldCleanOperation = {
  selector: /(?:^|\s)j(?:eu?)?(?<afterDay>\s|\d)/gu,
  fix: (_: string, afterDay: string): string => ` jeudi ${afterDay}`
};

const REPLACE_SHORT_VENDREDI: HorairesFieldCleanOperation = {
  selector: /(?:^|\s)v(?:en?)?(?<afterDay>\s|\d)/gu,
  fix: (_: string, afterDay: string): string => ` vendredi ${afterDay}`
};

const REPLACE_SHORT_SAMEDI: HorairesFieldCleanOperation = {
  selector: /(?:^|\s)s(?:am?)?(?<afterDay>\s|\d)/gu,
  fix: (_: string, afterDay: string): string => ` samedi ${afterDay}`
};

const REPLACE_SHORT_DIMANCHE: HorairesFieldCleanOperation = {
  selector: /(?:^|\s)d(?:im?)?(?<afterDay>\s|\d)/gu,
  fix: (_: string, afterDay: string): string => ` dimanche ${afterDay}`
};

const REPLACE_HYPHEN_DAYS_RANGE_WITH_AU: HorairesFieldCleanOperation = {
  selector:
    /(?<startDay>lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s*-\s*(?<endDay>lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)/gu,
  fix: (_: string, startDay: string, endDay: string): string => `${startDay} au ${endDay}`
};

const REPLACE_ANY_DAYS_SEPARATOR_WITH_SLASH: HorairesFieldCleanOperation = {
  selector: /(?:et|le|sauf|---|\.|-|>|,|\s{3})[\s:a-z]*(?<day>lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)/gu,
  fix: (day: string): string => `/ ${day}`
};

const REPLACE_SLASH_TIME_SEPARATOR_WITH_HYPHEN: HorairesFieldCleanOperation = {
  selector: /(?<startTime>[0-2]?\dh?(?:[0-5]?\d)?)\s?\/\s?(?<endTime>[0-2]?\dh?(?:[0-5]?\d)?)/gu,
  fix: (_: string, startTime: string, endTime: string): string => `${startTime}-${endTime}`
};

const REMOVE_PHONE_NUMBERS: HorairesFieldCleanOperation = {
  selector: /\d\d[-.\s]?\d\d[-.\s]?\d\d[-.\s]?\d\d[-.\s]?\d\d/gu,
  fix: (): string => ''
};

const REPLACE_DOT_DAYS_SEPARATOR_WITH_SLASH: HorairesFieldCleanOperation = {
  selector: /\.\s/gu,
  fix: (): string => '/ '
};

const REPLACE_0_INSTEAD_OF_ACCENTED_A_TYPO: HorairesFieldCleanOperation = {
  selector: /\s0\s/gu,
  fix: (): string => ' à '
};

const INSERT_DAYS_SEPARATOR_BETWEEN_H_AND_DU: HorairesFieldCleanOperation = {
  selector: /h\sdu/gu,
  fix: (): string => 'h / du'
};

const FIX_REVERSE_AU: HorairesFieldCleanOperation = {
  selector:
    /(?<hours>.*)(?<days>du\s(?<startDay>lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\sau\s(?<endDay>lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche))\s*(?:\/|et|$)/u,
  fix: (_: string, hours: string, days: string): string => `${days} ${hours} `
};

const FIX_REVERSE_SINGLE_DAY: HorairesFieldCleanOperation = {
  selector:
    /(?<hours>[0-2]?\dh?(?:[0-5]?\d)?-[0-2]?\dh?(?:[0-5]?\d)?)\D+\/\D+(?<day>lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)$/u,
  fix: (_: string, hours: string, day: string): string => `/ ${day} ${hours} `
};

const INSERT_DAYS_SEPARATOR_BETWEEN_HOURS_AND_DAY: HorairesFieldCleanOperation = {
  selector: /(?<before>[0-2]?\d\s*h(?:[0-5]\d)?)\s(?<day>lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)/gu,
  fix: (_: string, before: string, day: string): string => `${before} / ${day}`
};

const CLEAN_UNICODE_AND_USELESS_CHAR: HorairesFieldCleanOperation = {
  selector: /[\n+'"]/gu,
  fix: (): string => ' '
};

const INSERT_COMMA_BETWEEN_DAYS: HorairesFieldCleanOperation = {
  selector: /(?<=\d)\s*\b\p{L}+\b\s*(?=:)/gu,
  fix: (day: string): string => `,${day}`
};

const REPLACE_DASH_BY_DOUBLE_DOT_ONLY_IF_IT_IS_TIME: HorairesFieldCleanOperation = {
  selector: /(?<![0-9a-zA-Z-])\d{2}\/\d{2}(?![0-9a-zA-Z-])/gu,
  fix: (time: string): string => time.replace('/', ':')
};

export const REPLACE_SHORT_DAYS: HorairesFieldCleanOperation[] = [
  INSERT_SPACE_AFTER_H_OR_HEURE,
  REPLACE_SHORT_LUNDI,
  REPLACE_SHORT_MARDI,
  REPLACE_SHORT_MERCREDI,
  REPLACE_SHORT_JEUDI,
  REPLACE_SHORT_VENDREDI,
  REPLACE_SHORT_SAMEDI,
  REPLACE_SHORT_DIMANCHE
];

export const HORAIRES_FIELD_CLEAN_OPERATIONS: HorairesFieldCleanOperation[] = [
  ...REPLACE_SHORT_DAYS,
  CLEAN_UNICODE_AND_USELESS_CHAR,
  INSERT_COMMA_BETWEEN_DAYS,
  REPLACE_DASH_BY_DOUBLE_DOT_ONLY_IF_IT_IS_TIME,
  REPLACE_HYPHEN_DAYS_RANGE_WITH_AU,
  REPLACE_ANY_DAYS_SEPARATOR_WITH_SLASH,
  REPLACE_SLASH_TIME_SEPARATOR_WITH_HYPHEN,
  REPLACE_SLASH_TIME_SEPARATOR_WITH_HYPHEN,
  REMOVE_PHONE_NUMBERS,
  REPLACE_DOT_DAYS_SEPARATOR_WITH_SLASH,
  REPLACE_0_INSTEAD_OF_ACCENTED_A_TYPO,
  INSERT_DAYS_SEPARATOR_BETWEEN_H_AND_DU,
  FIX_REVERSE_AU,
  FIX_REVERSE_SINGLE_DAY,
  INSERT_DAYS_SEPARATOR_BETWEEN_HOURS_AND_DAY
];
