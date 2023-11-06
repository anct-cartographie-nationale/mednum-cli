import { SchemaLieuMediationNumerique, Typologie } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Groups, MergedLieuxByGroupMap } from '../../../steps';
import { MergeGroupTransfer, mergeGroupTransfers } from './merge-group.transfer';

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

    const transfer: MergeGroupTransfer[] = mergeGroupTransfers(groups, mergedLieux);

    expect(transfer).toStrictEqual<MergeGroupTransfer[]>([
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
});
