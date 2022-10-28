export type Fix = {
  before: string;
  apply: string;
  after?: string;
};

export type RecordError = {
  field: string;
  message: string;
  fixes: Fix[];
};

export type Record = {
  index: number;
  errors: RecordError[];
};

export type Recorder = {
  fix: (fix: Fix) => Recorder;
  commit: () => Report;
  record: (field: string, message: string) => Recorder;
};

export type Report = {
  entry: (index: number) => Recorder;
  records: () => Record[];
};

const lastValueOf = <T>(array: T[]): T | undefined => array[array.length - 1];

/* eslint-disable-next-line @typescript-eslint/naming-convention */
const Recorder = (index: number, records: Record[], errors: RecordError[] = []): Recorder => ({
  record: (field: string, message: string): Recorder => {
    errors.push({ field, message, fixes: [] });
    return Recorder(index, records, errors);
  },
  fix: (fix: Fix): Recorder => {
    lastValueOf(errors)?.fixes.push(fix);
    return Recorder(index, records, errors);
  },
  commit: (): Report => {
    errors.length > 0 && records.push({ index, errors });
    return Report(records);
  }
});

/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const Report = (records: Record[] = []): Report => ({
  entry: (index: number): Recorder => Recorder(index, records),
  records: (): Record[] => records
});
