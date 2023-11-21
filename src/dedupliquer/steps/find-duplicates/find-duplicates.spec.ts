/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { SchemaLieuMediationNumerique, Service, Typologie } from '@gouvfr-anct/lieux-de-mediation-numerique';
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

    const duplicates: CommuneDuplications[] = findDuplicates(lieux, false);

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

    const duplicates: CommuneDuplications[] = findDuplicates(lieux, false);

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

    const duplicates: CommuneDuplications[] = findDuplicates(lieux, false);

    expect(duplicates).toStrictEqual([]);
  });

  it('should deduplicate lieux with the same source, when explicitly allowed', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '574-mediation-numerique-conseiller-numerique',
        pivot: '00000000000000',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey (chez Aconit)',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962,
        source: 'conseiller-numerique',
        date_maj: '2023-07-12',
        services: `${Service.AccederADuMateriel}`
      },
      {
        id: '2848-mediation-numerique-hinaura',
        pivot: '00000000000000',
        nom: 'numerinaute',
        adresse: '12 Rue Joseph Rey',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.186117,
        longitude: 5.716961,
        source: 'hinaura',
        date_maj: '2023-09-05',
        services: `${Service.CreerAvecLeNumerique}`
      }
    ];

    const duplicates: CommuneDuplications[] = findDuplicates(lieux, true);

    expect(duplicates).toStrictEqual([
      {
        codePostal: '38000',
        lieux: [
          {
            id: '574-mediation-numerique-conseiller-numerique',
            duplicates: [
              {
                id: '2848-mediation-numerique-hinaura',
                distanceScore: 100,
                nomFuzzyScore: 100,
                voieFuzzyScore: 74
              }
            ]
          },
          {
            id: '2848-mediation-numerique-hinaura',
            duplicates: [
              {
                id: '574-mediation-numerique-conseiller-numerique',
                distanceScore: 100,
                nomFuzzyScore: 100,
                voieFuzzyScore: 74
              }
            ]
          }
        ]
      }
    ]);
  });

  it('should not need to deduplicate when only lieu 1 has RFS typologie', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '574-mediation-numerique-hinaura',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey (chez Aconit)',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962,
        source: 'conseiller-numerique',
        typologie: Typologie.RFS
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

    const duplicates: CommuneDuplications[] = findDuplicates(lieux, false);

    expect(duplicates).toStrictEqual([]);
  });

  it('should not need to deduplicate when only lieu 1 has RFS typologie in lieux to deduplicate', (): void => {
    const lieuxToDeduplicate: SchemaLieuMediationNumerique[] = [
      {
        id: 'd490fc66-6a42-5001-ba98-d3fc9eb01006',
        nom: 'Maison des Services (Saint-Laurent-de-Chamousset)',
        services:
          'Devenir autonome dans les démarches administratives;Réaliser des démarches administratives avec un accompagnement;Prendre en main un ordinateur;Accéder à une connexion internet;Accéder à du matériel;Accompagner les démarches de santé',
        pivot: '00000000000000',
        commune: 'Saint-Laurent-de-Chamousset',
        code_postal: '69930',
        adresse: '122 avenue des 4 cantons',
        code_insee: '69220',
        latitude: 45.7393306125,
        longitude: 4.4679915905,
        telephone: '+33474265078',
        courriel: 'mds@cc-mdl.fr',
        presentation_detail: '',
        publics_accueillis: 'Adultes;Seniors (+ 65 ans)',
        conditions_acces: 'Gratuit : Je peux accéder gratuitement au lieu et à ses services',
        source: 'Res-in',
        date_maj: '2023-09-05'
      }
    ];

    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'e265f967-a340-54a6-ab7d-6753cbb97fcc',
        nom: 'Maison des Services saint Laurent de chamousset',
        services: 'Accéder à une connexion internet;Accéder à du matériel',
        pivot: '00000000000000',
        typologie: 'RFS',
        commune: 'Saint-Laurent-de-Chamousset',
        code_postal: '69930',
        adresse: '122 avenue des 4 cantons',
        code_insee: '69220',
        latitude: 45.739330612470766,
        longitude: 4.467991590499879,
        telephone: '+33474265078',
        presentation_resume: '',
        presentation_detail: '',
        publics_accueillis: 'Adultes;Seniors (+ 65 ans)',
        conditions_acces: 'Gratuit : Je peux accéder gratuitement au lieu et à ses services',
        labels_nationaux: 'CNFS;France Services',
        source: 'Hinaura',
        date_maj: '2022-08-17'
      }
    ];

    const duplicates: CommuneDuplications[] = findDuplicates(lieux, false, lieuxToDeduplicate);

    expect(duplicates).toStrictEqual([]);
  });

  it('should get deduplication data for lieu 1 with RFS typologie and lieu 2 with PIMMS typologie', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '574-mediation-numerique-hinaura',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey (chez Aconit)',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962,
        source: 'hinaura',
        typologie: Typologie.PIMMS
      } as SchemaLieuMediationNumerique,
      {
        id: '537-mediation-numerique-hinaura',
        nom: 'La Turbine.Coop',
        adresse: '5 esplanade Andry Farcy 38000 Grenoble',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953,
        source: 'francil-in',
        typologie: Typologie.RFS
      } as SchemaLieuMediationNumerique
    ];

    const duplicates: CommuneDuplications[] = findDuplicates(lieux, false);

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

  it('should get deduplication data for two lieux with RFS typologie', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '574-mediation-numerique-hinaura',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey (chez Aconit)',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962,
        source: 'hinaura',
        typologie: Typologie.RFS
      } as SchemaLieuMediationNumerique,
      {
        id: '537-mediation-numerique-hinaura',
        nom: 'La Turbine.Coop',
        adresse: '5 esplanade Andry Farcy 38000 Grenoble',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953,
        source: 'francil-in',
        typologie: Typologie.RFS
      } as SchemaLieuMediationNumerique
    ];

    const duplicates: CommuneDuplications[] = findDuplicates(lieux, false);

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

    const duplicates: CommuneDuplications[] = findDuplicates(lieux, false);

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

    const duplicates: CommuneDuplications[] = findDuplicates(lieux, false);

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

    const duplicates: CommuneDuplications[] = findDuplicates(lieux, false);

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

  it('should get duplications even if there is a lieu with RFS typologie with the same code postal', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MaisonDesSolidaritesDeCournon-mediation-numerique',
        nom: 'Maison des Solidarités de Cournon',
        commune: "Cournon d'Auvergne",
        code_postal: '63800',
        adresse: '34 place Jean Jaurès',
        latitude: 45.729599225,
        longitude: 3.1899082661,
        labels_nationaux: 'CNFS;Aidants Connect',
        source: 'hinaura'
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-aidants-connect-318-mediation-numerique',
        nom: 'MDS Cournon',
        commune: "Cournon-d'Auvergne",
        code_postal: '63800',
        adresse: '34 place Jean Jaurès',
        latitude: 45.729544,
        longitude: 3.190005,
        labels_nationaux: 'Aidants Connect',
        source: 'aidants-connect'
      } as SchemaLieuMediationNumerique,
      {
        id: '8eeeafab-4de8-4829-b042-52a94177411d',
        nom: 'DEPARTEMENT DU PUY DE DOME',
        commune: "Cournon-d'Auvergne",
        code_postal: '63800',
        adresse: '34 Place Jean Jaurès',
        latitude: 45.728941,
        longitude: 3.188564,
        labels_nationaux: 'CNFS;Aidants Connect',
        source: 'dora'
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-conseiller-numerique-62ab1e578255a806e299c93e-mediation-numerique',
        nom: 'Maison des Solidarités',
        commune: "COURNON D'AUVERGNE",
        code_postal: '63800',
        adresse: '34 Place Jean Jaurès',
        latitude: 45.728941,
        longitude: 3.188564,
        labels_nationaux: 'CNFS;Aidants Connect',
        source: 'conseiller-numerique'
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-france-services-2234-mediation-numerique',
        nom: 'France services Maison des citoyens de Cournon d’Auvergne',
        typologie: 'RFS',
        commune: "Cournon-d'Auvergne",
        code_postal: '63800',
        adresse: '15 Impasse des Dômes',
        code_insee: '63124',
        latitude: 45.73156,
        longitude: 3.192711,
        labels_nationaux: 'France Services',
        source: 'france-services'
      } as SchemaLieuMediationNumerique
    ];

    const duplicates: CommuneDuplications[] = findDuplicates(lieux, false);

    expect(duplicates).toStrictEqual([
      {
        codePostal: '63800',
        lieux: [
          {
            duplicates: [
              {
                distanceScore: 100,
                id: 'mediation-numerique-aidants-connect-318-mediation-numerique',
                nomFuzzyScore: 50,
                voieFuzzyScore: 100
              },
              {
                distanceScore: 40,
                id: '8eeeafab-4de8-4829-b042-52a94177411d',
                nomFuzzyScore: 34,
                voieFuzzyScore: 100
              },
              {
                distanceScore: 40,
                id: 'mediation-numerique-conseiller-numerique-62ab1e578255a806e299c93e-mediation-numerique',
                nomFuzzyScore: 80,
                voieFuzzyScore: 100
              }
            ],
            id: 'mediation-numerique-hinaura-MaisonDesSolidaritesDeCournon-mediation-numerique'
          },
          {
            duplicates: [
              {
                distanceScore: 100,
                id: 'mediation-numerique-hinaura-MaisonDesSolidaritesDeCournon-mediation-numerique',
                nomFuzzyScore: 50,
                voieFuzzyScore: 100
              },
              {
                distanceScore: 39,
                id: '8eeeafab-4de8-4829-b042-52a94177411d',
                nomFuzzyScore: 27,
                voieFuzzyScore: 100
              },
              {
                distanceScore: 39,
                id: 'mediation-numerique-conseiller-numerique-62ab1e578255a806e299c93e-mediation-numerique',
                nomFuzzyScore: 36,
                voieFuzzyScore: 100
              }
            ],
            id: 'mediation-numerique-aidants-connect-318-mediation-numerique'
          },
          {
            duplicates: [
              {
                distanceScore: 40,
                id: 'mediation-numerique-hinaura-MaisonDesSolidaritesDeCournon-mediation-numerique',
                nomFuzzyScore: 34,
                voieFuzzyScore: 100
              },
              {
                distanceScore: 39,
                id: 'mediation-numerique-aidants-connect-318-mediation-numerique',
                nomFuzzyScore: 27,
                voieFuzzyScore: 100
              },
              {
                distanceScore: 100,
                id: 'mediation-numerique-conseiller-numerique-62ab1e578255a806e299c93e-mediation-numerique',
                nomFuzzyScore: 29,
                voieFuzzyScore: 100
              }
            ],
            id: '8eeeafab-4de8-4829-b042-52a94177411d'
          },
          {
            duplicates: [
              {
                distanceScore: 40,
                id: 'mediation-numerique-hinaura-MaisonDesSolidaritesDeCournon-mediation-numerique',
                nomFuzzyScore: 80,
                voieFuzzyScore: 100
              },
              {
                distanceScore: 39,
                id: 'mediation-numerique-aidants-connect-318-mediation-numerique',
                nomFuzzyScore: 36,
                voieFuzzyScore: 100
              },
              {
                distanceScore: 100,
                id: '8eeeafab-4de8-4829-b042-52a94177411d',
                nomFuzzyScore: 29,
                voieFuzzyScore: 100
              }
            ],
            id: 'mediation-numerique-conseiller-numerique-62ab1e578255a806e299c93e-mediation-numerique'
          }
        ]
      }
    ]);
  });
});
