import { mergeHoursRanges, mergeMultipleHoursRanges } from './merge-hours-ranges';

describe('merge hours ranges', (): void => {
  it('should merge hours ranges with overlap', (): void => {
    const hoursRange1: string = '08:30-19:00';
    const hoursRange2: string = '14:00-21:00';

    const merged: string = mergeHoursRanges(hoursRange1, hoursRange2);

    expect(merged).toBe('08:30-21:00');
  });

  it('should merge reversed hours ranges with overlap', (): void => {
    const hoursRange1: string = '08:30-19:00';
    const hoursRange2: string = '14:00-21:00';

    const merged: string = mergeHoursRanges(hoursRange2, hoursRange1);

    expect(merged).toBe('08:30-21:00');
  });

  it('should merge hours ranges without overlap', (): void => {
    const hoursRange1: string = '08:30-12:00';
    const hoursRange2: string = '14:00-21:00';

    const merged: string = mergeHoursRanges(hoursRange1, hoursRange2);

    expect(merged).toBe('08:30-12:00,14:00-21:00');
  });

  it('should merge reversed hours ranges without overlap', (): void => {
    const hoursRange1: string = '08:30-12:00';
    const hoursRange2: string = '14:00-21:00';

    const merged: string = mergeHoursRanges(hoursRange2, hoursRange1);

    expect(merged).toBe('08:30-12:00,14:00-21:00');
  });

  it('should merge hour range with combined hours ranges start overlap', (): void => {
    const hoursRange: string = '08:30-12:00';
    const combinedHoursRange: string = '07:00-11:30,14:00-21:00';

    const merged: string = mergeMultipleHoursRanges(hoursRange, combinedHoursRange);

    expect(merged).toBe('07:00-12:00,14:00-21:00');
  });

  it('should merge 2 combined hours ranges', (): void => {
    const hoursRange: string = '08:00-12:30,13:00-16:00';
    const combinedHoursRange: string = '07:00-11:00,14:00-18:00';

    const merged: string = mergeMultipleHoursRanges(hoursRange, combinedHoursRange);

    expect(merged).toBe('07:00-12:30,13:00-18:00');
  });

  it('should merge 2 singles hours ranges', (): void => {
    const hoursRange: string = '08:00-12:30';
    const combinedHoursRange: string = '14:00-18:00';

    const merged: string = mergeMultipleHoursRanges(hoursRange, combinedHoursRange);

    expect(merged).toBe('08:00-12:30,14:00-18:00');
  });
});
