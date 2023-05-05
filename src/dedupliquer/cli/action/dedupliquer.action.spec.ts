import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { CommuneDuplications, findDuplicates, removeDuplicates } from './dedupliquer.action';

describe('dédupliquer action', (): void => {
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

    const duplicates: any = findDuplicates(lieux);

    expect(duplicates).toStrictEqual([]);
  });

  it('should not need to deduplicate when lieux are in  different communes', (): void => {
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

    const duplicates: any = findDuplicates(lieux);

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
        longitude: 5.716962
      } as SchemaLieuMediationNumerique,
      {
        id: '537-mediation-numerique-hinaura',
        nom: 'La Turbine.Coop',
        adresse: '5 esplanade Andry Farcy 38000 Grenoble',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953
      } as SchemaLieuMediationNumerique
    ];

    const duplicates: any = findDuplicates(lieux);

    expect(duplicates).toStrictEqual<CommuneDuplications[]>([
      {
        codePostal: '38000',
        lieux: [
          {
            id: '574-mediation-numerique-hinaura',
            duplicates: [
              {
                id: '537-mediation-numerique-hinaura',
                distanceScore: 82,
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
                distanceScore: 82,
                nomFuzzyScore: 38,
                voieFuzzyScore: 33
              }
            ]
          }
        ]
      }
    ]);
  });

  it('should not remove lieux when there is no duplicates', (): void => {
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
        adresse: '5 esplanade Andry Farcy 38000 Grenoble',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
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
        adresse: '5 esplanade Andry Farcy 38000 Grenoble',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953
      } as SchemaLieuMediationNumerique
    ]);
  });

  // it('should remove lieux when there is duplicates', (): void => {
  //   const lieux: SchemaLieuMediationNumerique[] = [
  //     {
  //       id: '62ac57108255a806e299d5cc-mediation-numerique-conseiller-numerique',
  //       nom: 'Pimms médiation de Vaise',
  //       adresse: '5 place ferber',
  //       code_postal: '69009',
  //       commune: 'Lyon',
  //       latitude: 45.773805,
  //       longitude: 4.804597,
  //       date_maj: '2022-06-17'
  //     } as SchemaLieuMediationNumerique,
  //     {
  //       id: '658-mediation-numerique-france-services/details',
  //       nom: 'France services Pimms Médiation Lyon Métropole - Vaise',
  //       adresse: '5 Place Dumas de Loire',
  //       code_postal: '69009',
  //       commune: 'Lyon 9e',
  //       latitude: 45.77267,
  //       longitude: 4.805198,
  //       date_maj: '2020-02-01'
  //     } as SchemaLieuMediationNumerique
  //   ];
  //
  //   const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(lieux);
  //
  //   expect(lieuxWithoutDuplicates).toStrictEqual([
  //     {
  //       id: '62ac57108255a806e299d5cc-mediation-numerique-conseiller-numerique',
  //       nom: 'Pimms médiation de Vaise',
  //       adresse: '5 place ferber',
  //       code_postal: '69009',
  //       commune: 'Lyon',
  //       latitude: 45.773805,
  //       longitude: 4.804597,
  //       date_maj: '2022-06-17'
  //     } as SchemaLieuMediationNumerique
  //   ]);
  // });

  // it('should have 0 lieux with same name and same address', (): void => {
  //   const lieux: SchemaLieuMediationNumerique[] = [
  //     {
  //       id: '9b03b089-1137-420e-8ef8-68f75a97b71c',
  //       nom: 'ASI num Grenoble',
  //       adresse: '54 rue des lanternes',
  //       code_postal: '38000',
  //       commune: 'Grenoble',
  //       latitude: 43.527,
  //       longitude: 5.412
  //     } as SchemaLieuMediationNumerique,
  //     {
  //       id: '818b7831-3a6c-4a10-bf90-12150371562b',
  //       nom: 'Mairie de Grenoble',
  //       adresse: '1 place de la mairie',
  //       code_postal: '38000',
  //       commune: 'Grenoble',
  //       latitude: 43.533,
  //       longitude: 5.426
  //     } as SchemaLieuMediationNumerique
  //   ];
  //
  //   const duplicatesCount: string[] = findDuplicates(lieux);
  //
  //   expect(duplicatesCount).toStrictEqual([]);
  // });
  //
  // it('should have 1 lieux with same name and same address when there 1 duplication', (): void => {
  //   const lieux: SchemaLieuMediationNumerique[] = [
  //     {
  //       id: '9b03b089-1137-420e-8ef8-68f75a97b71c',
  //       nom: 'ASI num Grenoble',
  //       adresse: '54 rue des lanternes',
  //       code_postal: '38000',
  //       commune: 'Grenoble',
  //       latitude: 43.527,
  //       longitude: 5.412
  //     } as SchemaLieuMediationNumerique,
  //     {
  //       id: '8194d60c-30b1-49b3-998e-41a160a57bbe',
  //       nom: 'ASI num Grenoble',
  //       adresse: '54 rue des lanternes',
  //       code_postal: '38000',
  //       commune: 'Grenoble',
  //       latitude: 43.533,
  //       longitude: 5.426
  //     } as SchemaLieuMediationNumerique
  //   ];
  //
  //   const duplicatesCount: string[] = findDuplicates(lieux);
  //
  //   expect(duplicatesCount).toStrictEqual(['9b03b089-1137-420e-8ef8-68f75a97b71c']);
  // });
  //
  // it('should have 0 lieux with same name when addresses are different', (): void => {
  //   const lieux: SchemaLieuMediationNumerique[] = [
  //     {
  //       id: '9b03b089-1137-420e-8ef8-68f75a97b71c',
  //       nom: 'ASI num Grenoble',
  //       adresse: '54 rue des lanternes',
  //       code_postal: '38000',
  //       commune: 'Grenoble',
  //       latitude: 43.527,
  //       longitude: 5.412
  //     } as SchemaLieuMediationNumerique,
  //     {
  //       id: '8194d60c-30b1-49b3-998e-41a160a57bbe',
  //       nom: 'ASI num Grenoble',
  //       adresse: '1 place de la mairie',
  //       code_postal: '38000',
  //       commune: 'Grenoble',
  //       latitude: 43.533,
  //       longitude: 5.426
  //     } as SchemaLieuMediationNumerique
  //   ];
  //
  //   const duplicatesCount: string[] = findDuplicates(lieux);
  //
  //   expect(duplicatesCount).toStrictEqual([]);
  // });
  //
  // it('should have 0 lieux with same address when names are different', (): void => {
  //   const lieux: SchemaLieuMediationNumerique[] = [
  //     {
  //       id: '9b03b089-1137-420e-8ef8-68f75a97b71c',
  //       nom: 'ASI num Grenoble',
  //       adresse: '54 rue des lanternes',
  //       code_postal: '38000',
  //       commune: 'Grenoble',
  //       latitude: 43.527,
  //       longitude: 5.412
  //     } as SchemaLieuMediationNumerique,
  //     {
  //       id: '8194d60c-30b1-49b3-998e-41a160a57bbe',
  //       nom: 'Médiathèque',
  //       adresse: '54 rue des lanternes',
  //       code_postal: '38000',
  //       commune: 'Grenoble',
  //       latitude: 43.533,
  //       longitude: 5.426
  //     } as SchemaLieuMediationNumerique
  //   ];
  //
  //   const duplicatesCount: string[] = findDuplicates(lieux);
  //
  //   expect(duplicatesCount).toStrictEqual([]);
  // });
  //
  // it('should have 1 lieu with geographic proximity', (): void => {
  //   const lieux: SchemaLieuMediationNumerique[] = [
  //     {
  //       id: '9b03b089-1137-420e-8ef8-68f75a97b71c',
  //       nom: 'ASI num Grenoble',
  //       adresse: '54 rue des lanternes',
  //       code_postal: '38000',
  //       commune: 'Grenoble',
  //       latitude: 43.527032,
  //       longitude: 5.412059
  //     } as SchemaLieuMediationNumerique,
  //     {
  //       id: '818b7831-3a6c-4a10-bf90-12150371562b',
  //       nom: 'Mairie de Grenoble',
  //       adresse: '1 place de la mairie',
  //       code_postal: '38000',
  //       commune: 'Grenoble',
  //       latitude: 43.527963,
  //       longitude: 5.412914
  //     } as SchemaLieuMediationNumerique
  //   ];
  //
  //   const duplicatesCount: string[] = findDuplicates(lieux);
  //
  //   expect(duplicatesCount).toStrictEqual([
  //     {
  //       id: '9b03b089-1137-420e-8ef8-68f75a97b71c',
  //       duplicate: '818b7831-3a6c-4a10-bf90-12150371562b',
  //       distance: 0,
  //       nomFuzzyScore: 70,
  //       voieFuzzyScore: 70
  //     },
  //     {
  //       id: '818b7831-3a6c-4a10-bf90-12150371562b',
  //       duplicate: '9b03b089-1137-420e-8ef8-68f75a97b71c',
  //       distance: 0,
  //       nomFuzzyScore: 70,
  //       voieFuzzyScore: 70
  //     }
  //   ]);
  // });
});
