import { describe, it, expect } from 'vitest';
import { errorReportToCsv } from './error-report.to-csv';

const ENTETE = '"index","field","message","entryName","valeurDorigine","valeurRetenue"';

describe('output', (): void => {
  it('should convert empty report errors data to CSV with headers only', (): void => {
    expect(errorReportToCsv([])).toBe(`${ENTETE}\n`);
  });

  it('should convert report errors data to CSV with headers and one line', (): void => {
    const csv: string = errorReportToCsv([
      { index: 35, field: 'voie', message: "La voie  n'est pas valide", entryName: 'Saint Priest la Plaine' }
    ]);

    expect(csv).toBe(`${ENTETE}\n"35","voie","La voie  n'est pas valide","Saint Priest la Plaine","",""`);
  });

  it('should convert report errors data to CSV with headers and two lines', (): void => {
    const csv: string = errorReportToCsv([
      { index: 35, field: 'voie', message: "La voie  n'est pas valide", entryName: 'Saint Priest la Plaine' },
      { index: 60, field: 'voie', message: "La voie  n'est pas valide", entryName: 'Mérinchal - Bus de services' }
    ]);

    expect(csv).toBe(
      `${ENTETE}\n` +
        `"35","voie","La voie  n'est pas valide","Saint Priest la Plaine","",""\n` +
        `"60","voie","La voie  n'est pas valide","Mérinchal - Bus de services","",""`
    );
  });

  it('porte la valeur d’origine et la valeur retenue quand une correction a eu lieu', (): void => {
    const csv: string = errorReportToCsv([
      {
        index: 12,
        field: 'pivot',
        message: 'Le SIRET déclaré désigne un autre établissement',
        entryName: 'Mairie',
        valeurDorigine: '43493312300029',
        valeurRetenue: '40852636600039'
      }
    ]);

    expect(csv).toContain('"43493312300029","40852636600039"');
  });
});
