/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { processDate } from './date.field';
import { HinauraLieuMediationNumerique } from '../../helper';

describe('date field', (): void => {
  it('should process date field', (): void => {
    const date: Date = processDate({
      datetime_latest: '21/04/2022 14:34:13'
    } as HinauraLieuMediationNumerique);

    expect(date).toEqual(new Date('2022-04-21T14:34:13.000Z'));
  });
});
