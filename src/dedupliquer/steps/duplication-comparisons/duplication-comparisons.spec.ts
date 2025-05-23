import { describe, it, expect } from 'vitest';
import { SchemaLieuMediationNumerique, Typologie } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DuplicationComparison, duplicationComparisons } from './duplication-comparisons';

describe('deduplication comparison', (): void => {
  it('should get duplication comparison', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey (chez Aconit)',
        code_postal: '38000',
        code_insee: '38185',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962,
        source: 'hinaura',
        typologie: Typologie.ESS,
        date_maj: '2020-09-08'
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        nom: 'La Turbine.Coop',
        adresse: '5 esplanade Andry Farcy',
        code_postal: '38000',
        code_insee: '38185',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953,
        source: 'res-in',
        typologie: Typologie.ESS,
        date_maj: '2020-11-15'
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: DuplicationComparison[] = duplicationComparisons(lieux, false);

    expect(lieuxWithoutDuplicates).toStrictEqual<DuplicationComparison[]>([
      {
        id1: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        id2: 'mediation-numerique-hub-lo-436-mediation-numerique',
        score: 27,
        adresseScore: 38,
        adresse1: '12 Rue Joseph Rey (chez Aconit) 38000 Grenoble',
        adresse2: '5 esplanade Andry Farcy 38000 Grenoble',
        nomScore: 38,
        nom1: 'Numerinaute',
        nom2: 'La Turbine.Coop',
        distanceScore: 7,
        localisation1: '45.186115 : 5.716962',
        localisation2: '45.187654 : 5.704953',
        source1: 'hinaura',
        source2: 'res-in',
        typologie1: 'ESS',
        typologie2: 'ESS'
      }
    ]);
  });

  it('should not get duplication comparison when score is NaN', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey (chez Aconit)',
        code_postal: '38000',
        code_insee: '38185',
        commune: 'Grenoble'
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        nom: 'La Turbine.Coop',
        adresse: '5 esplanade Andry Farcy',
        code_postal: '38000',
        code_insee: '38185',
        commune: 'Grenoble'
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: DuplicationComparison[] = duplicationComparisons(lieux, false);

    expect(lieuxWithoutDuplicates).toStrictEqual<DuplicationComparison[]>([]);
  });

  it('should get duplication comparison for many lieux in same commune', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'A',
        nom: 'Maison Des Habitants Centre-Ville',
        commune: 'GRENOBLE',
        code_postal: '38100',
        code_insee: '38185',
        adresse: '2 Rue du vieux temple',
        latitude: 45.193684,
        longitude: 5.733633,
        source: 'france-services',
        typologie: Typologie.TIERS_LIEUX,
        date_maj: '2020-09-01'
      } as SchemaLieuMediationNumerique,
      {
        id: 'B',
        nom: 'Espace Personnes Agées Bouchayer',
        commune: 'GRENOBLE',
        code_postal: '38100',
        code_insee: '38185',
        adresse: '70 BIS rue Joseph Bouchayer',
        latitude: 45.177784,
        longitude: 5.707327,
        source: 'conseiller-numerique',
        typologie: Typologie.TIERS_LIEUX,
        date_maj: '2020-09-02'
      } as SchemaLieuMediationNumerique,
      {
        id: 'C',
        nom: 'Maison des Habitant.es Anatole France',
        commune: 'GRENOBLE',
        code_postal: '38100',
        code_insee: '38185',
        adresse: '68bis rue Anatole France',
        latitude: 45.172522,
        longitude: 5.704961,
        source: 'fibre64',
        typologie: Typologie.TIERS_LIEUX,
        date_maj: '2020-09-03'
      } as SchemaLieuMediationNumerique,
      {
        id: 'D',
        nom: 'Maison Des Habitant.es Les Baladins',
        commune: 'GRENOBLE',
        code_postal: '38100',
        code_insee: '38185',
        adresse: '31 Place des Géants',
        latitude: 45.162266,
        longitude: 5.738204,
        source: 'hinaura',
        typologie: Typologie.TIERS_LIEUX,
        date_maj: '2020-09-04'
      } as SchemaLieuMediationNumerique,
      {
        id: 'E',
        nom: 'Maison Des Habitant.es Prémol',
        commune: 'GRENOBLE',
        code_postal: '38100',
        code_insee: '38185',
        adresse: '7 Rue Henri Duhamel',
        latitude: 45.163403,
        longitude: 5.727504,
        source: 'francil-in',
        typologie: Typologie.TIERS_LIEUX,
        date_maj: '2020-09-05'
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: DuplicationComparison[] = duplicationComparisons(lieux, false);

    expect(lieuxWithoutDuplicates).toStrictEqual<DuplicationComparison[]>([
      {
        id1: 'A',
        id2: 'E',
        adresse1: '2 Rue du vieux temple 38100 GRENOBLE',
        adresse2: '7 Rue Henri Duhamel 38100 GRENOBLE',
        adresseScore: 45,
        distanceScore: 3,
        localisation1: '45.193684 : 5.733633',
        localisation2: '45.163403 : 5.727504',
        nom1: 'Maison Des Habitants Centre-Ville',
        nom2: 'Maison Des Habitant.es Prémol',
        nomScore: 74,
        score: 40,
        source1: 'france-services',
        source2: 'francil-in',
        typologie1: Typologie.TIERS_LIEUX,
        typologie2: Typologie.TIERS_LIEUX
      },
      {
        id1: 'C',
        id2: 'E',
        adresse1: '68bis rue Anatole France 38100 GRENOBLE',
        adresse2: '7 Rue Henri Duhamel 38100 GRENOBLE',
        adresseScore: 42,
        distanceScore: 3,
        localisation1: '45.172522 : 5.704961',
        localisation2: '45.163403 : 5.727504',
        nom1: 'Maison des Habitant.es Anatole France',
        nom2: 'Maison Des Habitant.es Prémol',
        nomScore: 76,
        score: 40,
        source1: 'fibre64',
        source2: 'francil-in',
        typologie1: Typologie.TIERS_LIEUX,
        typologie2: Typologie.TIERS_LIEUX
      },
      {
        id1: 'D',
        id2: 'E',
        adresse1: '31 Place des Géants 38100 GRENOBLE',
        adresse2: '7 Rue Henri Duhamel 38100 GRENOBLE',
        adresseScore: 32,
        distanceScore: 8,
        localisation1: '45.162266 : 5.738204',
        localisation2: '45.163403 : 5.727504',
        nom1: 'Maison Des Habitant.es Les Baladins',
        nom2: 'Maison Des Habitant.es Prémol',
        nomScore: 75,
        score: 38,
        source1: 'hinaura',
        source2: 'francil-in',
        typologie1: Typologie.TIERS_LIEUX,
        typologie2: Typologie.TIERS_LIEUX
      },
      {
        id1: 'A',
        id2: 'C',
        adresse1: '2 Rue du vieux temple 38100 GRENOBLE',
        adresse2: '68bis rue Anatole France 38100 GRENOBLE',
        adresseScore: 36,
        distanceScore: 2,
        localisation1: '45.193684 : 5.733633',
        localisation2: '45.172522 : 5.704961',
        nom1: 'Maison Des Habitants Centre-Ville',
        nom2: 'Maison des Habitant.es Anatole France',
        nomScore: 74,
        score: 37,
        source1: 'france-services',
        source2: 'fibre64',
        typologie1: Typologie.TIERS_LIEUX,
        typologie2: Typologie.TIERS_LIEUX
      },
      {
        id1: 'C',
        id2: 'D',
        adresse1: '68bis rue Anatole France 38100 GRENOBLE',
        adresse2: '31 Place des Géants 38100 GRENOBLE',
        adresseScore: 33,
        distanceScore: 2,
        localisation1: '45.172522 : 5.704961',
        localisation2: '45.162266 : 5.738204',
        nom1: 'Maison des Habitant.es Anatole France',
        nom2: 'Maison Des Habitant.es Les Baladins',
        nomScore: 78,
        score: 37,
        source1: 'fibre64',
        source2: 'hinaura',
        typologie1: Typologie.TIERS_LIEUX,
        typologie2: Typologie.TIERS_LIEUX
      },
      {
        id1: 'A',
        id2: 'D',
        adresse1: '2 Rue du vieux temple 38100 GRENOBLE',
        adresse2: '31 Place des Géants 38100 GRENOBLE',
        adresseScore: 35,
        distanceScore: 3,
        localisation1: '45.193684 : 5.733633',
        localisation2: '45.162266 : 5.738204',
        nom1: 'Maison Des Habitants Centre-Ville',
        nom2: 'Maison Des Habitant.es Les Baladins',
        nomScore: 71,
        score: 36,
        source1: 'france-services',
        source2: 'hinaura',
        typologie1: Typologie.TIERS_LIEUX,
        typologie2: Typologie.TIERS_LIEUX
      },
      {
        id1: 'B',
        id2: 'C',
        adresse1: '70 BIS rue Joseph Bouchayer 38100 GRENOBLE',
        adresse2: '68bis rue Anatole France 38100 GRENOBLE',
        adresseScore: 51,
        distanceScore: 14,
        localisation1: '45.177784 : 5.707327',
        localisation2: '45.172522 : 5.704961',
        nom1: 'Espace Personnes Agées Bouchayer',
        nom2: 'Maison des Habitant.es Anatole France',
        nomScore: 41,
        score: 35,
        source1: 'conseiller-numerique',
        source2: 'fibre64',
        typologie1: Typologie.TIERS_LIEUX,
        typologie2: Typologie.TIERS_LIEUX
      },
      {
        id1: 'B',
        id2: 'E',
        adresse1: '70 BIS rue Joseph Bouchayer 38100 GRENOBLE',
        adresse2: '7 Rue Henri Duhamel 38100 GRENOBLE',
        adresseScore: 52,
        distanceScore: 3,
        localisation1: '45.177784 : 5.707327',
        localisation2: '45.163403 : 5.727504',
        nom1: 'Espace Personnes Agées Bouchayer',
        nom2: 'Maison Des Habitant.es Prémol',
        nomScore: 39,
        score: 31,
        source1: 'conseiller-numerique',
        source2: 'francil-in',
        typologie1: Typologie.TIERS_LIEUX,
        typologie2: Typologie.TIERS_LIEUX
      },
      {
        id1: 'A',
        id2: 'B',
        adresse1: '2 Rue du vieux temple 38100 GRENOBLE',
        adresse2: '70 BIS rue Joseph Bouchayer 38100 GRENOBLE',
        adresseScore: 33,
        distanceScore: 3,
        localisation1: '45.193684 : 5.733633',
        localisation2: '45.177784 : 5.707327',
        nom1: 'Maison Des Habitants Centre-Ville',
        nom2: 'Espace Personnes Agées Bouchayer',
        nomScore: 40,
        score: 25,
        source1: 'france-services',
        source2: 'conseiller-numerique',
        typologie1: Typologie.TIERS_LIEUX,
        typologie2: Typologie.TIERS_LIEUX
      },
      {
        id1: 'B',
        id2: 'D',
        adresse1: '70 BIS rue Joseph Bouchayer 38100 GRENOBLE',
        adresse2: '31 Place des Géants 38100 GRENOBLE',
        adresseScore: 26,
        distanceScore: 2,
        localisation1: '45.177784 : 5.707327',
        localisation2: '45.162266 : 5.738204',
        nom1: 'Espace Personnes Agées Bouchayer',
        nom2: 'Maison Des Habitant.es Les Baladins',
        nomScore: 39,
        score: 22,
        source1: 'conseiller-numerique',
        source2: 'hinaura',
        typologie1: Typologie.TIERS_LIEUX,
        typologie2: Typologie.TIERS_LIEUX
      }
    ]);
  });
});
