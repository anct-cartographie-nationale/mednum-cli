/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { duplicationComparisons } from '../duplication-comparisons';
import { formatToCSV } from './deduplication-comparisons-to-csv';

describe('deduplication comparison to csv', (): void => {
  it('should get duplication comparison ready to write in CSV file', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '574-mediation-numerique-hinaura',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey ; chez Aconit',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962,
        source: 'res-in'
      } as SchemaLieuMediationNumerique,
      {
        id: '537-mediation-numerique-hinaura',
        nom: 'La Turbine.Coop',
        adresse: '5 esplanade Andry Farcy',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953,
        source: 'hinaura'
      } as SchemaLieuMediationNumerique
    ];

    const duplicationComparisonCSV: string = formatToCSV(duplicationComparisons(lieux));

    expect(duplicationComparisonCSV).toBe<string>(
      'Score;Score Nom;Nom 1;Nom 2;Score Adresse;Adresse 1;Adresse 2;Score Distance;Localisation 1;Localisation 2;Source 1;Source 2\n27;38;Numerinaute;La Turbine.Coop;38;12 Rue Joseph Rey  chez Aconit 38000 Grenoble;5 esplanade Andry Farcy 38000 Grenoble;7;45.186115 : 5.716962;45.187654 : 5.704953;res-in;hinaura'
    );
  });
});
