/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { CommuneDuplications, findDuplicates } from './find-duplicates';

describe('find duplicates', (): void => {
  it('should not need to deduplicate when there is only one lieu', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '574-mediation-numerique-hinaura',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey (chez Aconit)',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962
      } as SchemaLieuMediationNumerique
    ];

    const duplicates: CommuneDuplications[] = findDuplicates(lieux);

    expect(duplicates).toStrictEqual([]);
  });

  it('should not need to deduplicate when lieux are in different communes', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '574-mediation-numerique-hinaura',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey (chez Aconit)',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962
      } as SchemaLieuMediationNumerique,
      {
        id: '2848-mediation-numerique-france-services',
        nom: "France services d'Etrechy",
        adresse: '26 rue Jean Moulin',
        code_postal: '91580',
        commune: 'Étréchy',
        latitude: 48.487691,
        longitude: 2.186761
      } as SchemaLieuMediationNumerique
    ];

    const duplicates: CommuneDuplications[] = findDuplicates(lieux);

    expect(duplicates).toStrictEqual([]);
  });

  it('should not need to deduplicate when lieux have the same source', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '574-mediation-numerique-hinaura',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey (chez Aconit)',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962,
        source: 'hinaura'
      } as SchemaLieuMediationNumerique,
      {
        id: '2848-mediation-numerique-france-services',
        nom: "France services d'Etrechy",
        adresse: '26 rue Jean Moulin',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 48.487691,
        longitude: 2.186761,
        source: 'hinaura'
      } as SchemaLieuMediationNumerique
    ];

    const duplicates: CommuneDuplications[] = findDuplicates(lieux);

    expect(duplicates).toStrictEqual([]);
  });

  it('should get deduplication data for two lieux in same commune', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '574-mediation-numerique-hinaura',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey (chez Aconit)',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962,
        source: 'hinaura'
      } as SchemaLieuMediationNumerique,
      {
        id: '537-mediation-numerique-hinaura',
        nom: 'La Turbine.Coop',
        adresse: '5 esplanade Andry Farcy 38000 Grenoble',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953,
        source: 'francil-in'
      } as SchemaLieuMediationNumerique
    ];

    const duplicates: CommuneDuplications[] = findDuplicates(lieux);

    expect(duplicates).toStrictEqual<CommuneDuplications[]>([
      {
        codePostal: '38000',
        lieux: [
          {
            id: '574-mediation-numerique-hinaura',
            duplicates: [
              {
                id: '537-mediation-numerique-hinaura',
                distanceScore: 7,
                nomFuzzyScore: 38,
                voieFuzzyScore: 33
              }
            ]
          },
          {
            id: '537-mediation-numerique-hinaura',
            duplicates: [
              {
                id: '574-mediation-numerique-hinaura',
                distanceScore: 7,
                nomFuzzyScore: 38,
                voieFuzzyScore: 33
              }
            ]
          }
        ]
      }
    ]);
  });

  it('should get deduplication data for two lieux in same commune with low distance score', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '1',
        nom: 'LA POSTE',
        adresse: '8 Av du Mal de Lattre de Tassigny',
        code_postal: '88000',
        commune: 'EPINAL',
        latitude: 48.176748,
        longitude: 6.444835,
        source: 'hinaura'
      } as SchemaLieuMediationNumerique,
      {
        id: '2',
        nom: 'LA POSTE',
        adresse: '20 PL D AVRINSART',
        code_postal: '88000',
        commune: 'EPINAL',
        latitude: 48.183401,
        longitude: 6.45588,
        source: 'francil-in'
      } as SchemaLieuMediationNumerique
    ];

    const duplicates: CommuneDuplications[] = findDuplicates(lieux);

    expect(duplicates).toStrictEqual<CommuneDuplications[]>([
      {
        codePostal: '88000',
        lieux: [
          {
            id: '1',
            duplicates: [
              {
                id: '2',
                distanceScore: 7,
                nomFuzzyScore: 100,
                voieFuzzyScore: 36
              }
            ]
          },
          {
            id: '2',
            duplicates: [
              {
                id: '1',
                distanceScore: 7,
                nomFuzzyScore: 100,
                voieFuzzyScore: 36
              }
            ]
          }
        ]
      }
    ]);
  });

  it('should get deduplication data for two lieux in same commune with medium distance score', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '1',
        nom: 'Mediatheque Municipale de Bailleul',
        adresse: "41 Rue D 'Ypres",
        code_postal: '59270',
        commune: 'Bailleul',
        latitude: 50.740045,
        longitude: 2.737217,
        source: 'hinaura'
      } as SchemaLieuMediationNumerique,
      {
        id: '2',
        nom: 'CCAS de Bailleul',
        adresse: "22 Bis Rue d'Ypres",
        code_postal: '59270',
        commune: 'Bailleul',
        latitude: 50.740407,
        longitude: 2.737429,
        source: 'francil-in'
      } as SchemaLieuMediationNumerique
    ];

    const duplicates: CommuneDuplications[] = findDuplicates(lieux);

    expect(duplicates).toStrictEqual<CommuneDuplications[]>([
      {
        codePostal: '59270',
        lieux: [
          {
            id: '1',
            duplicates: [
              {
                id: '2',
                distanceScore: 70,
                nomFuzzyScore: 56,
                voieFuzzyScore: 75
              }
            ]
          },
          {
            id: '2',
            duplicates: [
              {
                id: '1',
                distanceScore: 70,
                nomFuzzyScore: 56,
                voieFuzzyScore: 75
              }
            ]
          }
        ]
      }
    ]);
  });
});
