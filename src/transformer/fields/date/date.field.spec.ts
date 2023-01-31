/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { DateCannotBeEmptyError, processDate } from './date.field';
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
    expect((): void => {
      processDate(
        {
          datetime_latest: ' '
        },
        matching
      );
    }).toThrow(new DateCannotBeEmptyError());
  });

  it('should process default date if missing field', (): void => {
    const date: Date = processDate({}, matching);

    expect(date).toEqual(new Date('1970-01-01T00:00:00.000Z'));
  });
});
