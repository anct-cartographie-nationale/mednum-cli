import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DuplicationComparison } from './dedupliquer.action';
import { duplicationComparisons, formatToCSV } from './duplication-comparisons';

describe('dédupliquer action', (): void => {
  it('should get duplication comparison', (): void => {
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
        id: '537-mediation-numerique-hinaura',
        nom: 'La Turbine.Coop',
        adresse: '5 esplanade Andry Farcy',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: DuplicationComparison[] = duplicationComparisons(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual<DuplicationComparison[]>([
      {
        score: 52,
        adresseScore: 38,
        adresse1: '12 Rue Joseph Rey (chez Aconit) 38000 Grenoble',
        adresse2: '5 esplanade Andry Farcy 38000 Grenoble',
        nomScore: 38,
        nom1: 'Numerinaute',
        nom2: 'La Turbine.Coop',
        distanceScore: 82,
        localisation1: '45.186115 : 5.716962',
        localisation2: '45.187654 : 5.704953'
      }
    ]);
  });

  it('tmp', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'A',
        nom: 'Maison Des Habitants Centre-Ville',
        commune: 'GRENOBLE',
        code_postal: '38100',
        adresse: '2 Rue du vieux temple',
        latitude: 45.193684,
        longitude: 5.733633
      } as SchemaLieuMediationNumerique,
      {
        id: 'B',
        nom: 'Espace Personnes Agées Bouchayer',
        commune: 'GRENOBLE',
        code_postal: '38100',
        adresse: '70 BIS rue Joseph Bouchayer',
        latitude: 45.177784,
        longitude: 5.707327
      } as SchemaLieuMediationNumerique,
      {
        id: 'C',
        nom: 'Maison des Habitant.es Anatole France',
        commune: 'GRENOBLE',
        code_postal: '38100',
        adresse: '68bis rue Anatole France',
        latitude: 45.172522,
        longitude: 5.704961
      } as SchemaLieuMediationNumerique,
      {
        id: 'D',
        nom: 'Maison Des Habitant.es Les Baladins',
        commune: 'GRENOBLE',
        code_postal: '38100',
        adresse: '31 Place des Géants',
        latitude: 45.162266,
        longitude: 5.738204
      } as SchemaLieuMediationNumerique,
      {
        id: 'E',
        nom: 'Maison Des Habitant.es Prémol',
        commune: 'GRENOBLE',
        code_postal: '38100',
        adresse: '7 Rue Henri Duhamel',
        latitude: 45.163403,
        longitude: 5.727504
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: DuplicationComparison[] = duplicationComparisons(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual<DuplicationComparison[]>([
      {
        adresse1: '2 Rue du vieux temple 38100 GRENOBLE',
        adresse2: '70 BIS rue Joseph Bouchayer 38100 GRENOBLE',
        adresseScore: 33,
        distanceScore: 32,
        localisation1: '45.193684 : 5.733633',
        localisation2: '45.177784 : 5.707327',
        nom1: 'Maison Des Habitants Centre-Ville',
        nom2: 'Espace Personnes Agées Bouchayer',
        nomScore: 40,
        score: 35
      },
      {
        adresse1: '2 Rue du vieux temple 38100 GRENOBLE',
        adresse2: '68bis rue Anatole France 38100 GRENOBLE',
        adresseScore: 36,
        distanceScore: 28,
        localisation1: '45.193684 : 5.733633',
        localisation2: '45.172522 : 5.704961',
        nom1: 'Maison Des Habitants Centre-Ville',
        nom2: 'Maison des Habitant.es Anatole France',
        nomScore: 74,
        score: 46
      },
      {
        adresse1: '2 Rue du vieux temple 38100 GRENOBLE',
        adresse2: '31 Place des Géants 38100 GRENOBLE',
        adresseScore: 35,
        distanceScore: 31,
        localisation1: '45.193684 : 5.733633',
        localisation2: '45.162266 : 5.738204',
        nom1: 'Maison Des Habitants Centre-Ville',
        nom2: 'Maison Des Habitant.es Les Baladins',
        nomScore: 71,
        score: 45
      },
      {
        adresse1: '2 Rue du vieux temple 38100 GRENOBLE',
        adresse2: '7 Rue Henri Duhamel 38100 GRENOBLE',
        adresseScore: 45,
        distanceScore: 32,
        localisation1: '45.193684 : 5.733633',
        localisation2: '45.163403 : 5.727504',
        nom1: 'Maison Des Habitants Centre-Ville',
        nom2: 'Maison Des Habitant.es Prémol',
        nomScore: 74,
        score: 50
      },
      {
        adresse1: '70 BIS rue Joseph Bouchayer 38100 GRENOBLE',
        adresse2: '68bis rue Anatole France 38100 GRENOBLE',
        adresseScore: 51,
        distanceScore: 100,
        localisation1: '45.177784 : 5.707327',
        localisation2: '45.172522 : 5.704961',
        nom1: 'Espace Personnes Agées Bouchayer',
        nom2: 'Maison des Habitant.es Anatole France',
        nomScore: 41,
        score: 64
      },
      {
        adresse1: '70 BIS rue Joseph Bouchayer 38100 GRENOBLE',
        adresse2: '31 Place des Géants 38100 GRENOBLE',
        adresseScore: 26,
        distanceScore: 28,
        localisation1: '45.177784 : 5.707327',
        localisation2: '45.162266 : 5.738204',
        nom1: 'Espace Personnes Agées Bouchayer',
        nom2: 'Maison Des Habitant.es Les Baladins',
        nomScore: 39,
        score: 31
      },
      {
        adresse1: '70 BIS rue Joseph Bouchayer 38100 GRENOBLE',
        adresse2: '7 Rue Henri Duhamel 38100 GRENOBLE',
        adresseScore: 52,
        distanceScore: 40,
        localisation1: '45.177784 : 5.707327',
        localisation2: '45.163403 : 5.727504',
        nom1: 'Espace Personnes Agées Bouchayer',
        nom2: 'Maison Des Habitant.es Prémol',
        nomScore: 39,
        score: 43
      },
      {
        adresse1: '68bis rue Anatole France 38100 GRENOBLE',
        adresse2: '31 Place des Géants 38100 GRENOBLE',
        adresseScore: 33,
        distanceScore: 28,
        localisation1: '45.172522 : 5.704961',
        localisation2: '45.162266 : 5.738204',
        nom1: 'Maison des Habitant.es Anatole France',
        nom2: 'Maison Des Habitant.es Les Baladins',
        nomScore: 78,
        score: 46
      },
      {
        adresse1: '68bis rue Anatole France 38100 GRENOBLE',
        adresse2: '7 Rue Henri Duhamel 38100 GRENOBLE',
        adresseScore: 42,
        distanceScore: 41,
        localisation1: '45.172522 : 5.704961',
        localisation2: '45.163403 : 5.727504',
        nom1: 'Maison des Habitant.es Anatole France',
        nom2: 'Maison Des Habitant.es Prémol',
        nomScore: 76,
        score: 53
      },
      {
        adresse1: '31 Place des Géants 38100 GRENOBLE',
        adresse2: '7 Rue Henri Duhamel 38100 GRENOBLE',
        adresseScore: 32,
        distanceScore: 92,
        localisation1: '45.162266 : 5.738204',
        localisation2: '45.163403 : 5.727504',
        nom1: 'Maison Des Habitant.es Les Baladins',
        nom2: 'Maison Des Habitant.es Prémol',
        nomScore: 75,
        score: 66
      }
    ]);
  });

  it('should get duplication comparison ready to write in CSV file', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '574-mediation-numerique-hinaura',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey ; chez Aconit',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962
      } as SchemaLieuMediationNumerique,
      {
        id: '537-mediation-numerique-hinaura',
        nom: 'La Turbine.Coop',
        adresse: '5 esplanade Andry Farcy',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953
      } as SchemaLieuMediationNumerique
    ];

    const duplicationComparisonCSV: string = formatToCSV(duplicationComparisons(lieux));

    expect(duplicationComparisonCSV).toStrictEqual<string>(
      'Score;Score Nom;Nom 1;Nom 2;Score Adresse;Adresse 1;Adresse 2;Score Distance;Localisation 1;Localisation 2\n52;38;Numerinaute;La Turbine.Coop;38;12 Rue Joseph Rey  chez Aconit 38000 Grenoble;5 esplanade Andry Farcy 38000 Grenoble;82;45.186115 : 5.716962;45.187654 : 5.704953'
    );
  });
});
