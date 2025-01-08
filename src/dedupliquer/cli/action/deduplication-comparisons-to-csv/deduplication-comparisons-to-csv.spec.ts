import { describe, it, expect } from 'vitest';
import { SchemaLieuMediationNumerique, Typologie } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { duplicationComparisons } from '../../../steps';
import { formatToCSV } from './deduplication-comparisons-to-csv';

describe('deduplication comparison to csv', (): void => {
  it('should get duplication comparison ready to write in CSV file', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '574-mediation-numerique-hinaura',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey ; chez Aconit',
        code_postal: '38000',
        code_insee: '38185',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962,
        source: 'res-in',
        typologie: Typologie.ESS
      } as SchemaLieuMediationNumerique,
      {
        id: '537-mediation-numerique-hinaura',
        nom: 'La Turbine.Coop',
        adresse: '5 esplanade Andry Farcy',
        code_postal: '38000',
        code_insee: '38185',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953,
        source: 'hinaura',
        typologie: Typologie.ESS
      } as SchemaLieuMediationNumerique
    ];

    const duplicationComparisonCSV: string = formatToCSV(duplicationComparisons(lieux, false));

    expect(duplicationComparisonCSV).toBe<string>(
      'Score;Typologie 1;Typologie 2;Score Nom;Nom 1;Nom 2;Score Adresse;Adresse 1;Adresse 2;Score Distance;Localisation 1;Localisation 2;Source 1;Source 2\n27;ESS;ESS;38;Numerinaute;La Turbine.Coop;38;12 Rue Joseph Rey  chez Aconit 38000 Grenoble;5 esplanade Andry Farcy 38000 Grenoble;7;45.186115 : 5.716962;45.187654 : 5.704953;res-in;hinaura'
    );
  });

  it('should have only one cell for typologies', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '574-mediation-numerique-hinaura',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey ; chez Aconit',
        code_postal: '38000',
        code_insee: '38185',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962,
        source: 'res-in',
        typologie: Typologie.ESS
      } as SchemaLieuMediationNumerique,
      {
        id: '537-mediation-numerique-hinaura',
        nom: 'La Turbine.Coop',
        adresse: '5 esplanade Andry Farcy',
        code_postal: '38000',
        code_insee: '38185',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953,
        source: 'hinaura',
        typologie: [Typologie.ESS, Typologie.CAF, Typologie.TIERS_LIEUX].join('|')
      } as SchemaLieuMediationNumerique
    ];

    const duplicationComparisonCSV: string = formatToCSV(duplicationComparisons(lieux, false));

    expect(duplicationComparisonCSV).toBe<string>(
      'Score;Typologie 1;Typologie 2;Score Nom;Nom 1;Nom 2;Score Adresse;Adresse 1;Adresse 2;Score Distance;Localisation 1;Localisation 2;Source 1;Source 2\n27;ESS;ESS,CAF,TIERS_LIEUX;38;Numerinaute;La Turbine.Coop;38;12 Rue Joseph Rey  chez Aconit 38000 Grenoble;5 esplanade Andry Farcy 38000 Grenoble;7;45.186115 : 5.716962;45.187654 : 5.704953;res-in;hinaura'
    );
  });
});
