import { describe, it, expect } from 'vitest';
import { dataInclusionFileName } from './data-inclusion.file-name';

describe('data inclusion file name', (): void => {
  it('should generate data inclusion file name', (): void => {
    const jsonFileName: string = dataInclusionFileName(new Date('2022-11-07'), '213502387', 'services', 'json');

    expect(jsonFileName).toBe('services-inclusion-20221107-213502387.json');
  });

  it('should generate data inclusion file name with suffix', (): void => {
    const jsonFileName: string = dataInclusionFileName(new Date('2022-11-07'), '213502387', 'services', 'json', 'suffix');

    expect(jsonFileName).toBe('services-inclusion-20221107-213502387-suffix.json');
  });
});
