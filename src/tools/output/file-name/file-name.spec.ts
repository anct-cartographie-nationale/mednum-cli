import { dataInclusionFileName, mediationNumeriqueFileName } from './file-name';

describe('output', (): void => {
  it('should generate mediation numérique file name', (): void => {
    const jsonFileName: string = mediationNumeriqueFileName(new Date('2022-11-07'), '213502387', 'rhone', 'json');

    expect(jsonFileName).toBe('20221107_213502387_lieux-de-mediation-numeriques-rhone.json');
  });

  it('should generate data inclusion file name', (): void => {
    const jsonFileName: string = dataInclusionFileName(new Date('2022-11-07'), '213502387', 'services', 'json');

    expect(jsonFileName).toBe('services-inclusion-20221107_213502387.json');
  });
});
