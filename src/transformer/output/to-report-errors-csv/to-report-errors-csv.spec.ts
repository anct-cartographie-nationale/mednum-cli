/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { toReportErrorsCsv } from './to-report-errors-csv';

describe('output', (): void => {
  it('should convert empty report errors data to CSV with headers only', (): void => {
    const csv: string = toReportErrorsCsv([]);

    expect(csv).toBe('"index","field","message","entryName"\n');
  });

  it('should convert report errors data to CSV with headers and one line', (): void => {
    const csv: string = toReportErrorsCsv([
      {
        index: 35,
        field: 'voie',
        message: "La voie  n'est pas valide",
        entryName: 'Saint Priest la Plaine'
      }
    ]);

    expect(csv).toBe(
      '"index","field","message","entryName"\n"35","voie","La voie  n\'est pas valide","Saint Priest la Plaine"'
    );
  });

  it('should convert report errors data to CSV with headers and two lines', (): void => {
    const csv: string = toReportErrorsCsv([
      {
        index: 35,
        field: 'voie',
        message: "La voie  n'est pas valide",
        entryName: 'Saint Priest la Plaine'
      },
      {
        index: 60,
        field: 'voie',
        message: "La voie  n'est pas valide",
        entryName: 'Mérinchal - Bus de services'
      }
    ]);

    expect(csv).toBe(
      '"index","field","message","entryName"\n' +
        '"35","voie","La voie  n\'est pas valide","Saint Priest la Plaine"\n' +
        '"60","voie","La voie  n\'est pas valide","Mérinchal - Bus de services"'
    );
  });
});
