import { describe, it, expect } from 'vitest';
import { processDate } from './date.field';
import { LieuxMediationNumeriqueMatching } from '../../input';

const matching: LieuxMediationNumeriqueMatching = {
  date_maj: {
    colonne: 'datetime_latest'
  }
} as LieuxMediationNumeriqueMatching;

describe('date field', (): void => {
  it('should process date field with value 21/04/2022 14:34:13', (): void => {
    const date: Date = processDate(
      {
        datetime_latest: '21/04/2022 14:34:13'
      },
      matching
    );

    expect(date).toEqual(new Date('2022-04-21T14:34:13.000Z'));
  });

  it('should process date field with value 2022-09-26 19:00:45', (): void => {
    const date: Date = processDate(
      {
        datetime_latest: '2022-09-26 19:00:45'
      },
      matching
    );

    expect(date).toEqual(new Date('2022-09-26T19:00:45.000Z'));
  });

  it('should process date field with value 21/04/2022', (): void => {
    const date: Date = processDate(
      {
        datetime_latest: '21/04/2022'
      },
      matching
    );

    expect(date).toEqual(new Date('2022-04-21T12:00:00'));
  });

  it('should process date field with value 21/4/2022', (): void => {
    const date: Date = processDate(
      {
        datetime_latest: '21/4/2022'
      },
      matching
    );

    expect(date).toEqual(new Date('2022-04-21T12:00:00'));
  });

  it('should process date field with value 2021-06-10', (): void => {
    const date: Date = processDate(
      {
        datetime_latest: '2021-06-10'
      },
      matching
    );

    expect(date).toEqual(new Date('2021-06-10T12:00:00.000Z'));
  });

  it('should process date field with value Espace labellisé 01/12/2022', (): void => {
    const date: Date = processDate(
      {
        datetime_latest: 'Espace labellisé 01/12/2022'
      },
      matching
    );

    expect(date).toEqual(new Date('2022-12-01T12:00:00.000Z'));
  });

  it('should process date field with value 1670421075', (): void => {
    const date: Date = processDate(
      {
        datetime_latest: 1670421075 as unknown as string
      },
      matching
    );

    expect(date).toEqual(new Date('2022-12-07T13:51:15.000Z'));
  });

  it('should not process empty date', (): void => {
    const date: Date = processDate({ datetime_latest: '' }, matching);

    expect(date).toEqual(new Date('1970-01-01T00:00:00.000Z'));
  });

  it('should not process default date', (): void => {
    const defaultMtching: LieuxMediationNumeriqueMatching = {
      date_maj: {
        valeur: '2022-12-07'
      }
    } as LieuxMediationNumeriqueMatching;

    const date: Date = processDate({ datetime_latest: '' }, defaultMtching);

    expect(date).toEqual(new Date('2022-12-07T12:00:00.000Z'));
  });

  it('should delete milliseconds in date', (): void => {
    const date: Date = processDate(
      {
        datetime_latest: '2022/06/10 10:04:59.524'
      },
      matching
    );

    expect(date).toEqual(new Date('2022/06/10 10:04:59'));
  });

  it('should process date field with value 2022/06/10 10:04:59', (): void => {
    const date: Date = processDate(
      {
        datetime_latest: '2022/06/10 10:04:59'
      },
      matching
    );

    expect(date).toEqual(new Date('2022/06/10 10:04:59'));
  });

  it('should process default date if missing field', (): void => {
    const date: Date = processDate({}, matching);

    expect(date).toEqual(new Date('1970-01-01T00:00:00.000Z'));
  });

  it('should process standart date without milliseconds', (): void => {
    const date: Date = processDate({ datetime_latest: '2023-03-03T10:29:10.128Z' }, matching);

    expect(date).toEqual(new Date('2023-03-03T10:29:10'));
  });

  it('should process date field with value 18/04/2023 09:49', (): void => {
    const date: Date = processDate(
      {
        datetime_latest: '18/04/2023 09:49'
      },
      matching
    );

    expect(date).toEqual(new Date('2023-04-18T09:49:00.000Z'));
  });
});
