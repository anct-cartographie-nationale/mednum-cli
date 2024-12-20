import { SchemaLieuMediationNumerique, Service } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Groups } from '../group-duplicates/group-duplicates';
import { removeMerged } from './remove-merged';

describe('remove merged', (): void => {
  it('should not remove anything when there is no merge group', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey (chez Aconit)',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962,
        date_maj: '2023-05-03',
        source: 'hinaura',
        services: Service.AccesInternetEtMaterielInformatique
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'La Turbine.Coop',
        adresse: '5 esplanade Andry Farcy 38000 Grenoble',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953,
        date_maj: '2023-05-03',
        source: 'hinaura',
        services: Service.AccesInternetEtMaterielInformatique
      }
    ];

    const groups: Groups = {
      mergeGroupsMap: new Map<string, string[]>([]),
      itemGroupMap: new Map<string, string>([])
    };

    const lieuxWithoutMergedItems: SchemaLieuMediationNumerique[] = removeMerged(lieux, groups);

    expect(lieuxWithoutMergedItems).toStrictEqual(lieux);
  });

  it('should remove one of the lieu which is in a group', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey (chez Aconit)',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962,
        date_maj: '2023-05-03',
        source: 'hinaura',
        services: Service.AccesInternetEtMaterielInformatique
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'La Turbine.Coop',
        adresse: '5 esplanade Andry Farcy 38000 Grenoble',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953,
        date_maj: '2023-05-03',
        source: 'hinaura',
        services: Service.AccesInternetEtMaterielInformatique
      }
    ];

    const groups: Groups = {
      mergeGroupsMap: new Map<string, string[]>([['0', ['mediation-numerique-hinaura-MairiE2-mediation-numerique']]]),
      itemGroupMap: new Map<string, string>([['mediation-numerique-hinaura-MairiE2-mediation-numerique', '0']])
    };

    const lieuxWithoutMergedItems: SchemaLieuMediationNumerique[] = removeMerged(lieux, groups);

    expect(lieuxWithoutMergedItems).toStrictEqual([
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'La Turbine.Coop',
        adresse: '5 esplanade Andry Farcy 38000 Grenoble',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953,
        date_maj: '2023-05-03',
        source: 'hinaura',
        services: Service.AccesInternetEtMaterielInformatique
      }
    ]);
  });
});
