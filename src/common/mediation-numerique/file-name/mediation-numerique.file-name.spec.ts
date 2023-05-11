import { mediationNumeriqueFileName } from './mediation-numerique.file-name';

describe('mediation numérique file name', (): void => {
  it('should generate mediation numérique file name', (): void => {
    const jsonFileName: string = mediationNumeriqueFileName(new Date('2022-11-07'), '213502387', 'rhone', 'json');

    expect(jsonFileName).toBe('20221107-213502387-lieux-de-mediation-numeriques-rhone.json');
  });

  it('should generate mediation numérique file name with suffix', (): void => {
    const jsonFileName: string = mediationNumeriqueFileName(new Date('2022-11-07'), '213502387', 'rhone', 'json', 'suffix');

    expect(jsonFileName).toBe('20221107-213502387-lieux-de-mediation-numeriques-rhone-suffix.json');
  });
});
