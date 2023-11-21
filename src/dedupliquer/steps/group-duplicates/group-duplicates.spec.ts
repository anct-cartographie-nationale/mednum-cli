import { DuplicationComparison } from '../duplication-comparisons';
import { groupDuplicates, Groups } from './group-duplicates';

describe('group duplicates', (): void => {
  it('should get ready for merge a single duplication comparison', (): void => {
    const duplicates: DuplicationComparison[] = [
      {
        id1: '036de1b2-3fc3-5f0f-9a2b-f5a692ce06d3',
        id2: '102d5560-52c3-5494-bd30-2d4bb2f1a597',
        score: 100,
        adresseScore: 100,
        adresse1: '13 AVENUE MARECHAL LECLERC 69700 Givors',
        adresse2: '13 AVENUE MARECHAL LECLERC 69700 Givors',
        nomScore: 100,
        nom1: "Groupe d'insertion ICARE - Givors",
        nom2: "Groupe d'insertion ICARE (Givors)",
        distanceScore: 100,
        localisation1: '45.5887127 : 4.7729586',
        localisation2: '45.5887127 : 4.7729586',
        source1: 'Hinaura',
        source2: 'Res-in'
      }
    ];

    const readyToMerge: Groups = groupDuplicates(duplicates);

    expect(readyToMerge).toStrictEqual({
      mergeGroupsMap: new Map<string, string[]>([
        [
          '74cc4cdab738fcef5c8d3a35b7dcbee355ec35b88cb4215911bd097f759223e0',
          ['036de1b2-3fc3-5f0f-9a2b-f5a692ce06d3', '102d5560-52c3-5494-bd30-2d4bb2f1a597']
        ]
      ]),
      itemGroupMap: new Map<string, string>([
        ['036de1b2-3fc3-5f0f-9a2b-f5a692ce06d3', '74cc4cdab738fcef5c8d3a35b7dcbee355ec35b88cb4215911bd097f759223e0'],
        ['102d5560-52c3-5494-bd30-2d4bb2f1a597', '74cc4cdab738fcef5c8d3a35b7dcbee355ec35b88cb4215911bd097f759223e0']
      ])
    });
  });

  it('should get ready for merge a two duplication comparison without overlap', (): void => {
    const duplicates: DuplicationComparison[] = [
      {
        id1: '036de1b2-3fc3-5f0f-9a2b-f5a692ce06d3',
        id2: '102d5560-52c3-5494-bd30-2d4bb2f1a597',
        score: 100,
        adresseScore: 100,
        adresse1: '13 AVENUE MARECHAL LECLERC 69700 Givors',
        adresse2: '13 AVENUE MARECHAL LECLERC 69700 Givors',
        nomScore: 100,
        nom1: "Groupe d'insertion ICARE - Givors",
        nom2: "Groupe d'insertion ICARE (Givors)",
        distanceScore: 100,
        localisation1: '45.5887127 : 4.7729586',
        localisation2: '45.5887127 : 4.7729586',
        source1: 'Hinaura',
        source2: 'Res-in'
      },
      {
        id1: '372ac350-22ed-5269-a7e6-5c82914aedb2',
        id2: 'ff24a3d1-e3cd-5f88-8ff9-95fe25fe5c0d',
        score: 100,
        adresseScore: 100,
        adresse1: '10 montée du Clos 69126 Brindas',
        adresse2: '10 montée du Clos 69126 Brindas',
        nomScore: 100,
        nom1: 'Médiathèque de Brindas',
        nom2: 'Médiathèque de Brindas',
        distanceScore: 100,
        localisation1: '45.72073878061979 : 4.695593118667603',
        localisation2: '45.7207387806 : 4.6955931187',
        source1: 'Hinaura',
        source2: 'Res-in',
        typologie2: 'BIB'
      }
    ];

    const readyToMerge: Groups = groupDuplicates(duplicates);

    expect(readyToMerge).toStrictEqual({
      mergeGroupsMap: new Map<string, string[]>([
        [
          '74cc4cdab738fcef5c8d3a35b7dcbee355ec35b88cb4215911bd097f759223e0',
          ['036de1b2-3fc3-5f0f-9a2b-f5a692ce06d3', '102d5560-52c3-5494-bd30-2d4bb2f1a597']
        ],
        [
          'dbce0064f4a8097ba272c4d6cb245c0bacac6a5cb668aac3bd80b6ca69dbfdf6',
          ['372ac350-22ed-5269-a7e6-5c82914aedb2', 'ff24a3d1-e3cd-5f88-8ff9-95fe25fe5c0d']
        ]
      ]),
      itemGroupMap: new Map<string, string>([
        ['036de1b2-3fc3-5f0f-9a2b-f5a692ce06d3', '74cc4cdab738fcef5c8d3a35b7dcbee355ec35b88cb4215911bd097f759223e0'],
        ['102d5560-52c3-5494-bd30-2d4bb2f1a597', '74cc4cdab738fcef5c8d3a35b7dcbee355ec35b88cb4215911bd097f759223e0'],
        ['372ac350-22ed-5269-a7e6-5c82914aedb2', 'dbce0064f4a8097ba272c4d6cb245c0bacac6a5cb668aac3bd80b6ca69dbfdf6'],
        ['ff24a3d1-e3cd-5f88-8ff9-95fe25fe5c0d', 'dbce0064f4a8097ba272c4d6cb245c0bacac6a5cb668aac3bd80b6ca69dbfdf6']
      ])
    });
  });

  it('should get ready for merge a two duplication comparison with overlap for id 1', (): void => {
    const duplicates: DuplicationComparison[] = [
      {
        id1: '036de1b2-3fc3-5f0f-9a2b-f5a692ce06d3',
        id2: '102d5560-52c3-5494-bd30-2d4bb2f1a597',
        score: 100,
        adresseScore: 100,
        adresse1: '13 AVENUE MARECHAL LECLERC 69700 Givors',
        adresse2: '13 AVENUE MARECHAL LECLERC 69700 Givors',
        nomScore: 100,
        nom1: "Groupe d'insertion ICARE - Givors",
        nom2: "Groupe d'insertion ICARE (Givors)",
        distanceScore: 100,
        localisation1: '45.5887127 : 4.7729586',
        localisation2: '45.5887127 : 4.7729586',
        source1: 'Hinaura',
        source2: 'Res-in'
      },
      {
        id1: '036de1b2-3fc3-5f0f-9a2b-f5a692ce06d3',
        id2: 'ff24a3d1-e3cd-5f88-8ff9-95fe25fe5c0d',
        score: 100,
        adresseScore: 100,
        adresse1: '13 AVENUE MARECHAL LECLERC 69700 Givors',
        adresse2: '13 AVENUE MARECHAL LECLERC 69700 Givors',
        nomScore: 100,
        nom1: "Groupe d'insertion ICARE - Givors",
        nom2: "Groupe d'insertion ICARE (Givors)",
        distanceScore: 100,
        localisation1: '45.5887127 : 4.7729586',
        localisation2: '45.5887127 : 4.7729586',
        source1: 'Hinaura',
        source2: 'Res-in'
      }
    ];

    const readyToMerge: Groups = groupDuplicates(duplicates);

    expect(readyToMerge).toStrictEqual({
      mergeGroupsMap: new Map<string, string[]>([
        [
          '37618d226e9c0d41525ff640a416d481c41c04076032e9e21c43f4414720b5f5',
          [
            '036de1b2-3fc3-5f0f-9a2b-f5a692ce06d3',
            '102d5560-52c3-5494-bd30-2d4bb2f1a597',
            'ff24a3d1-e3cd-5f88-8ff9-95fe25fe5c0d'
          ]
        ]
      ]),
      itemGroupMap: new Map<string, string>([
        ['036de1b2-3fc3-5f0f-9a2b-f5a692ce06d3', '37618d226e9c0d41525ff640a416d481c41c04076032e9e21c43f4414720b5f5'],
        ['102d5560-52c3-5494-bd30-2d4bb2f1a597', '37618d226e9c0d41525ff640a416d481c41c04076032e9e21c43f4414720b5f5'],
        ['ff24a3d1-e3cd-5f88-8ff9-95fe25fe5c0d', '37618d226e9c0d41525ff640a416d481c41c04076032e9e21c43f4414720b5f5']
      ])
    });
  });

  it('should get ready for merge a two duplication comparison with overlap for id2', (): void => {
    const duplicates: DuplicationComparison[] = [
      {
        id1: '102d5560-52c3-5494-bd30-2d4bb2f1a597',
        id2: 'ff24a3d1-e3cd-5f88-8ff9-95fe25fe5c0d',
        score: 100,
        adresseScore: 100,
        adresse1: '13 AVENUE MARECHAL LECLERC 69700 Givors',
        adresse2: '13 AVENUE MARECHAL LECLERC 69700 Givors',
        nomScore: 100,
        nom1: "Groupe d'insertion ICARE - Givors",
        nom2: "Groupe d'insertion ICARE (Givors)",
        distanceScore: 100,
        localisation1: '45.5887127 : 4.7729586',
        localisation2: '45.5887127 : 4.7729586',
        source1: 'Hinaura',
        source2: 'Res-in'
      },
      {
        id1: '036de1b2-3fc3-5f0f-9a2b-f5a692ce06d3',
        id2: 'ff24a3d1-e3cd-5f88-8ff9-95fe25fe5c0d',
        score: 100,
        adresseScore: 100,
        adresse1: '13 AVENUE MARECHAL LECLERC 69700 Givors',
        adresse2: '13 AVENUE MARECHAL LECLERC 69700 Givors',
        nomScore: 100,
        nom1: "Groupe d'insertion ICARE - Givors",
        nom2: "Groupe d'insertion ICARE (Givors)",
        distanceScore: 100,
        localisation1: '45.5887127 : 4.7729586',
        localisation2: '45.5887127 : 4.7729586',
        source1: 'Hinaura',
        source2: 'Res-in'
      }
    ];

    const readyToMerge: Groups = groupDuplicates(duplicates);

    expect(readyToMerge).toStrictEqual({
      mergeGroupsMap: new Map<string, string[]>([
        [
          '37618d226e9c0d41525ff640a416d481c41c04076032e9e21c43f4414720b5f5',
          [
            '036de1b2-3fc3-5f0f-9a2b-f5a692ce06d3',
            '102d5560-52c3-5494-bd30-2d4bb2f1a597',
            'ff24a3d1-e3cd-5f88-8ff9-95fe25fe5c0d'
          ]
        ]
      ]),
      itemGroupMap: new Map<string, string>([
        ['036de1b2-3fc3-5f0f-9a2b-f5a692ce06d3', '37618d226e9c0d41525ff640a416d481c41c04076032e9e21c43f4414720b5f5'],
        ['102d5560-52c3-5494-bd30-2d4bb2f1a597', '37618d226e9c0d41525ff640a416d481c41c04076032e9e21c43f4414720b5f5'],
        ['ff24a3d1-e3cd-5f88-8ff9-95fe25fe5c0d', '37618d226e9c0d41525ff640a416d481c41c04076032e9e21c43f4414720b5f5']
      ])
    });
  });

  it('should initiate merge replace maps for two duplication detection with overlap between 3 duplication comparisons', (): void => {
    const duplicates: DuplicationComparison[] = [
      {
        id1: 'A',
        id2: 'B',
        score: 100,
        adresseScore: 100,
        adresse1: '13 AVENUE MARECHAL LECLERC 69700 Givors',
        adresse2: '13 AVENUE MARECHAL LECLERC 69700 Givors',
        nomScore: 100,
        nom1: "Groupe d'insertion ICARE - Givors",
        nom2: "Groupe d'insertion ICARE (Givors)",
        distanceScore: 100,
        localisation1: '45.5887127 : 4.7729586',
        localisation2: '45.5887127 : 4.7729586',
        source1: 'Hinaura',
        source2: 'Res-in'
      },
      {
        id1: 'C',
        id2: 'D',
        score: 100,
        adresseScore: 100,
        adresse1: '13 AVENUE MARECHAL LECLERC 69700 Givors',
        adresse2: '13 AVENUE MARECHAL LECLERC 69700 Givors',
        nomScore: 100,
        nom1: "Groupe d'insertion ICARE - Givors",
        nom2: "Groupe d'insertion ICARE (Givors)",
        distanceScore: 100,
        localisation1: '45.5887127 : 4.7729586',
        localisation2: '45.5887127 : 4.7729586',
        source1: 'Hinaura',
        source2: 'Res-in'
      },
      {
        id1: 'C',
        id2: 'B',
        score: 100,
        adresseScore: 100,
        adresse1: '13 AVENUE MARECHAL LECLERC 69700 Givors',
        adresse2: '13 AVENUE MARECHAL LECLERC 69700 Givors',
        nomScore: 100,
        nom1: "Groupe d'insertion ICARE - Givors",
        nom2: "Groupe d'insertion ICARE (Givors)",
        distanceScore: 100,
        localisation1: '45.5887127 : 4.7729586',
        localisation2: '45.5887127 : 4.7729586',
        source1: 'Hinaura',
        source2: 'Res-in'
      }
    ];

    const readyToMerge: Groups = groupDuplicates(duplicates);

    expect(readyToMerge).toStrictEqual({
      mergeGroupsMap: new Map<string, string[]>([
        ['17f5f129f4c769967a884bc2c630677b4479d0a5858de30130b9727c6b335432', ['A', 'B', 'C', 'D']]
      ]),
      itemGroupMap: new Map<string, string>([
        ['A', '17f5f129f4c769967a884bc2c630677b4479d0a5858de30130b9727c6b335432'],
        ['B', '17f5f129f4c769967a884bc2c630677b4479d0a5858de30130b9727c6b335432'],
        ['D', '17f5f129f4c769967a884bc2c630677b4479d0a5858de30130b9727c6b335432'],
        ['C', '17f5f129f4c769967a884bc2c630677b4479d0a5858de30130b9727c6b335432']
      ])
    });
  });

  it('should merge 3 lieux together', (): void => {
    const duplicates: DuplicationComparison[] = [
      {
        id1: '05a12890-03e5-5abd-949c-cbaaf5b9afe5',
        id2: 'ad71ff4b-c21e-474c-96ee-ce9be12a973d',
        score: 100,
        adresseScore: 100,
        adresse1: 'Avenue de Haute Roche 69310 Pierre-Bénite',
        adresse2: 'Avenue de Haute Roche 69310 Pierre-Bénite',
        nomScore: 100,
        nom1: "Maison de l'emploi et du numérique",
        nom2: "Maison de l'emploi et du numérique",
        distanceScore: 100,
        localisation1: '45.7003476 : 4.8277535',
        localisation2: '45.7003476 : 4.8277535',
        source1: 'Hinaura',
        source2: 'Res-in',
        typologie1: 'MDE',
        typologie2: 'MDE'
      },
      {
        id1: '05a12890-03e5-5abd-949c-cbaaf5b9afe5',
        id2: '36cb4c7c-28d3-4f0b-ae50-d4a682a4b6f5',
        score: 100,
        adresseScore: 100,
        adresse1: 'Avenue de Haute Roche 69310 Pierre-Bénite',
        adresse2: 'Avenue de Haute Roche 69310 Pierre-Bénite',
        nomScore: 100,
        nom1: "Maison de l'emploi et du numérique",
        nom2: "Maison de l'emploi et du numérique",
        distanceScore: 100,
        localisation1: '45.7003476 : 4.8277535',
        localisation2: '45.7003476 : 4.8277535',
        source1: 'Hinaura',
        source2: 'Conseiller Numérique',
        typologie1: 'MDE',
        typologie2: 'MDE'
      },
      {
        id1: 'ad71ff4b-c21e-474c-96ee-ce9be12a973d',
        id2: '36cb4c7c-28d3-4f0b-ae50-d4a682a4b6f5',
        score: 100,
        adresseScore: 100,
        adresse1: 'Avenue de Haute Roche 69310 Pierre-Bénite',
        adresse2: 'Avenue de Haute Roche 69310 Pierre-Bénite',
        nomScore: 100,
        nom1: "Maison de l'emploi et du numérique",
        nom2: "Maison de l'emploi et du numérique",
        distanceScore: 100,
        localisation1: '45.7003476 : 4.8277535',
        localisation2: '45.7003476 : 4.8277535',
        source1: 'Res-in',
        source2: 'Conseiller Numérique',
        typologie1: 'MDE',
        typologie2: 'MDE'
      }
    ];

    const readyToMerge: Groups = groupDuplicates(duplicates);

    expect(readyToMerge).toStrictEqual({
      mergeGroupsMap: new Map<string, string[]>([
        [
          '594712d536a1cc22353e9a6191971dd29b0d4cedcab3cb70dfa9b1bfe40a7d00',
          [
            '05a12890-03e5-5abd-949c-cbaaf5b9afe5',
            '36cb4c7c-28d3-4f0b-ae50-d4a682a4b6f5',
            'ad71ff4b-c21e-474c-96ee-ce9be12a973d'
          ]
        ]
      ]),
      itemGroupMap: new Map<string, string>([
        ['05a12890-03e5-5abd-949c-cbaaf5b9afe5', '594712d536a1cc22353e9a6191971dd29b0d4cedcab3cb70dfa9b1bfe40a7d00'],
        ['36cb4c7c-28d3-4f0b-ae50-d4a682a4b6f5', '594712d536a1cc22353e9a6191971dd29b0d4cedcab3cb70dfa9b1bfe40a7d00'],
        ['ad71ff4b-c21e-474c-96ee-ce9be12a973d', '594712d536a1cc22353e9a6191971dd29b0d4cedcab3cb70dfa9b1bfe40a7d00']
      ])
    });
  });
});
