import { SchemaLieuMediationNumerique, Typologie } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Groups } from '../group-duplicates/group-duplicates';
import { MergedLieuxByGroupMap } from '../merge-duplicates';
import { findGroupIdsToDelete, MergeGroup, mergeGroups } from './merge-group';

describe('merge group transfer', (): void => {
  it('should create merge group to transfer from groups and lieux by group', (): void => {
    const groups: Groups = {
      mergeGroupsMap: new Map<string, string[]>([
        ['0', ['mediation-numerique-hinaura-MairiE2-mediation-numerique', 'mediation-numerique-hub-lo-436-mediation-numerique']]
      ]),
      itemGroupMap: new Map<string, string>([
        ['mediation-numerique-hinaura-MairiE2-mediation-numerique', '0'],
        ['mediation-numerique-hub-lo-436-mediation-numerique', '0']
      ])
    };

    const mergedLieux: MergedLieuxByGroupMap = new Map<string, SchemaLieuMediationNumerique>([
      [
        '0',
        {
          id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique|mediation-numerique-hub-lo-436-mediation-numerique',
          nom: 'Numerinaute',
          adresse: '12 Rue Joseph Rey (chez Aconit)',
          code_postal: '38000',
          commune: 'Grenoble',
          latitude: 45.186115,
          longitude: 5.716962,
          source: 'hinaura',
          typologie: Typologie.TIERS_LIEUX,
          date_maj: '2020-09-08'
        } as SchemaLieuMediationNumerique
      ]
    ]);

    const transfer: MergeGroup[] = mergeGroups(groups, mergedLieux);

    expect(transfer).toStrictEqual<MergeGroup[]>([
      {
        groupId: '0',
        lieu: {
          id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique|mediation-numerique-hub-lo-436-mediation-numerique',
          nom: 'Numerinaute',
          adresse: '12 Rue Joseph Rey (chez Aconit)',
          code_postal: '38000',
          commune: 'Grenoble',
          latitude: 45.186115,
          longitude: 5.716962,
          source: 'hinaura',
          typologie: Typologie.TIERS_LIEUX,
          date_maj: '2020-09-08'
        } as SchemaLieuMediationNumerique,
        mergedIds: [
          'mediation-numerique-hinaura-MairiE2-mediation-numerique',
          'mediation-numerique-hub-lo-436-mediation-numerique'
        ]
      }
    ]);
  });

  it('should not find any updates group ids to delete when there is no previous merge groups', (): void => {
    const previousMergeGroup: MergeGroup[] = [];

    const groups: Groups = {
      mergeGroupsMap: new Map<string, string[]>([
        [
          '23',
          [
            'mediation-numerique-hinaura-MairiE2-mediation-numerique',
            'mediation-numerique-hub-lo-436-mediation-numerique',
            'mediation-numerique-res-in-1fa588561e4zf-mediation-numerique'
          ]
        ]
      ]),
      itemGroupMap: new Map<string, string>([
        ['mediation-numerique-hinaura-MairiE2-mediation-numerique', '23'],
        ['mediation-numerique-hub-lo-436-mediation-numerique', '23'],
        ['mediation-numerique-res-in-1fa588561e4zf-mediation-numerique', '23']
      ])
    };

    const groupIdsToDelete: string[] = findGroupIdsToDelete(previousMergeGroup)(groups);

    expect(groupIdsToDelete).toStrictEqual([]);
  });

  it('should find updates group ids to delete', (): void => {
    const previousMergeGroup: MergeGroup[] = [
      {
        groupId: '0',
        lieu: {
          id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique|mediation-numerique-hub-lo-436-mediation-numerique',
          nom: 'Numerinaute',
          adresse: '12 Rue Joseph Rey (chez Aconit)',
          code_postal: '38000',
          commune: 'Grenoble',
          latitude: 45.186115,
          longitude: 5.716962,
          source: 'hinaura',
          typologie: Typologie.TIERS_LIEUX,
          date_maj: '2020-09-08'
        } as SchemaLieuMediationNumerique,
        mergedIds: [
          'mediation-numerique-hinaura-MairiE2-mediation-numerique',
          'mediation-numerique-hub-lo-436-mediation-numerique'
        ]
      }
    ];

    const groups: Groups = {
      mergeGroupsMap: new Map<string, string[]>([
        [
          '23',
          [
            'mediation-numerique-hinaura-MairiE2-mediation-numerique',
            'mediation-numerique-hub-lo-436-mediation-numerique',
            'mediation-numerique-res-in-1fa588561e4zf-mediation-numerique'
          ]
        ]
      ]),
      itemGroupMap: new Map<string, string>([
        ['mediation-numerique-hinaura-MairiE2-mediation-numerique', '23'],
        ['mediation-numerique-hub-lo-436-mediation-numerique', '23'],
        ['mediation-numerique-res-in-1fa588561e4zf-mediation-numerique', '23']
      ])
    };

    const groupIdsToDelete: string[] = findGroupIdsToDelete(previousMergeGroup)(groups);

    expect(groupIdsToDelete).toStrictEqual(['0']);
  });

  it('should not find any updates group ids to delete when there is no match between previous merge groups and new groups', (): void => {
    const previousMergeGroup: MergeGroup[] = [
      {
        groupId: '0',
        lieu: {
          id: 'A|B',
          nom: 'Numerinaute',
          adresse: '12 Rue Joseph Rey (chez Aconit)',
          code_postal: '38000',
          commune: 'Grenoble',
          latitude: 45.186115,
          longitude: 5.716962,
          source: 'hinaura',
          typologie: Typologie.TIERS_LIEUX,
          date_maj: '2020-09-08'
        } as SchemaLieuMediationNumerique,
        mergedIds: ['A', 'B']
      }
    ];

    const groups: Groups = {
      mergeGroupsMap: new Map<string, string[]>([
        [
          '23',
          [
            'mediation-numerique-hinaura-MairiE2-mediation-numerique',
            'mediation-numerique-hub-lo-436-mediation-numerique',
            'mediation-numerique-res-in-1fa588561e4zf-mediation-numerique'
          ]
        ]
      ]),
      itemGroupMap: new Map<string, string>([
        ['mediation-numerique-hinaura-MairiE2-mediation-numerique', '23'],
        ['mediation-numerique-hub-lo-436-mediation-numerique', '23'],
        ['mediation-numerique-res-in-1fa588561e4zf-mediation-numerique', '23']
      ])
    };

    const groupIdsToDelete: string[] = findGroupIdsToDelete(previousMergeGroup)(groups);

    expect(groupIdsToDelete).toStrictEqual([]);
  });

  it('should delete previous groups that contains a single remaining id', (): void => {
    const previousMergeGroup: MergeGroup[] = [
      {
        groupId: 'A',
        lieu: {} as SchemaLieuMediationNumerique,
        mergedIds: ['A1', 'A2', 'A3']
      },
      {
        groupId: 'B',
        lieu: {} as SchemaLieuMediationNumerique,
        mergedIds: ['B1', 'B2']
      }
    ];

    const groups: Groups = {
      mergeGroupsMap: new Map<string, string[]>([['AB', ['A1', 'A2', 'B1', 'B2', 'NEW']]]),
      itemGroupMap: new Map<string, string>([
        ['A1', 'AB'],
        ['A2', 'AB'],
        ['B1', 'AB'],
        ['B2', 'AB'],
        ['NEW', 'AB']
      ])
    };

    const groupIdsToDelete: string[] = findGroupIdsToDelete(previousMergeGroup)(groups);

    expect(groupIdsToDelete).toStrictEqual(['A', 'B']);
  });

  it('should not delete previous groups that contains multiple remaining ids', (): void => {
    const previousMergeGroup: MergeGroup[] = [
      {
        groupId: 'A',
        lieu: {} as SchemaLieuMediationNumerique,
        mergedIds: ['A1', 'A2', 'A3', 'A4']
      },
      {
        groupId: 'B',
        lieu: {} as SchemaLieuMediationNumerique,
        mergedIds: ['B1', 'B2']
      }
    ];

    const groups: Groups = {
      mergeGroupsMap: new Map<string, string[]>([['AB', ['A1', 'A2', 'B1', 'NEW']]]),
      itemGroupMap: new Map<string, string>([
        ['A1', 'AB'],
        ['A2', 'AB'],
        ['B1', 'AB'],
        ['NEW', 'AB']
      ])
    };

    const groupIdsToDelete: string[] = findGroupIdsToDelete(previousMergeGroup)(groups);

    expect(groupIdsToDelete).toStrictEqual(['B']);
  });
});
