import { describe, it, expect } from 'vitest';
import { Adresse, VoieError } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { processAdresse } from './adresse.field';
import { Commune, findCommune } from './find-commune';

const BEGLES: Commune = {
  nom: 'Bègles',
  code: '33039',
  codeDepartement: '33',
  siren: '213300395',
  codeEpci: '243300316',
  codeRegion: '75',
  codesPostaux: ['33130']
};

const BLOIS: Commune = {
  nom: 'Blois',
  code: '41018',
  codeDepartement: '41',
  siren: '214100182',
  codeEpci: '200001519',
  codeRegion: '24',
  codesPostaux: ['41000']
};

const BONNEVILLE_74: Commune = {
  nom: 'Bonneville',
  code: '74042',
  codeDepartement: '74',
  siren: '217400423',
  codeEpci: '200000172',
  codeRegion: '84',
  codesPostaux: ['74130']
};

const BONNEVILLE_80: Commune = {
  nom: 'Bonneville',
  code: '80113',
  codeDepartement: '80',
  siren: '218001071',
  codeEpci: '200070951',
  codeRegion: '32',
  codesPostaux: ['80670']
};

const BRIZON: Commune = {
  nom: 'Brizon',
  code: '74049',
  codeDepartement: '74',
  siren: '217400498',
  codeEpci: '200000172',
  codeRegion: '84',
  codesPostaux: ['74130']
};

const CHALUS_63: Commune = {
  nom: 'Chalus',
  code: '63074',
  codeDepartement: '63',
  siren: '216300749',
  codeEpci: '200070407',
  codeRegion: '84',
  codesPostaux: ['63340']
};

const CHALUS_87: Commune = {
  nom: 'Châlus',
  code: '87032',
  codeDepartement: '87',
  siren: '218703205',
  codeEpci: '200070506',
  codeRegion: '75',
  codesPostaux: ['87230']
};

const ETREUX: Commune = {
  nom: 'Étreux',
  code: '02298',
  codeDepartement: '02',
  siren: '210202818',
  codeEpci: '200071983',
  codeRegion: '32',
  codesPostaux: ['02510']
};
const GANNAT: Commune = {
  nom: 'Gannat',
  code: '03118',
  codeDepartement: '03',
  siren: '210301180',
  codeEpci: '200071389',
  codeRegion: '84',
  codesPostaux: ['03800']
};

const GRENOBLE: Commune = {
  nom: 'Grenoble',
  code: '38185',
  codeDepartement: '38',
  siren: '213801855',
  codeEpci: '200040715',
  codeRegion: '84',
  codesPostaux: ['38000', '38100']
};

const LA_FERE: Commune = {
  nom: 'La Fère',
  code: '02304',
  codeDepartement: '02',
  siren: '210202867',
  codeEpci: '200071785',
  codeRegion: '32',
  codesPostaux: ['02800']
};

const LIMOGES: Commune = {
  nom: 'Limoges',
  code: '87085',
  codeDepartement: '87',
  siren: '218708501',
  codeEpci: '248719312',
  codeRegion: '75',
  codesPostaux: ['87000', '87100', '87280']
};

const MARSEILLE: Commune = {
  nom: 'Marseille',
  code: '13055',
  codeDepartement: '13',
  siren: '211300553',
  codeEpci: '200054807',
  codeRegion: '93',
  codesPostaux: [
    '13001',
    '13002',
    '13003',
    '13004',
    '13005',
    '13006',
    '13007',
    '13008',
    '13009',
    '13010',
    '13011',
    '13012',
    '13013',
    '13014',
    '13015',
    '13016'
  ]
};

const PIOBETTA: Commune = {
  nom: 'Piobetta',
  code: '2B234',
  codeDepartement: '2B',
  siren: '212002349',
  codeEpci: '200034205',
  codeRegion: '94',
  codesPostaux: ['20234']
};

const SAINT_EUSTACHE: Commune = {
  nom: 'Saint-Eustache',
  code: '74232',
  codeDepartement: '74',
  siren: '217402320',
  codeEpci: '200066793',
  codeRegion: '84',
  codesPostaux: ['74410']
};

const SAINT_ETIENNE: Commune = {
  nom: 'Saint-Étienne',
  code: '42218',
  codeDepartement: '42',
  siren: '214202186',
  codeEpci: '244200770',
  codeRegion: '84',
  codesPostaux: ['42000', '42100', '42230']
};

const SAINT_JORIOZ: Commune = {
  nom: 'Saint-Jorioz',
  code: '74242',
  codeDepartement: '74',
  siren: '217402429',
  codeEpci: '200066793',
  codeRegion: '84',
  codesPostaux: ['74410']
};

const SAINT_LEONARD_DE_NOBLAT: Commune = {
  nom: 'Saint-Léonard-de-Noblat',
  code: '87161',
  codeDepartement: '87',
  siren: '218716108',
  codeEpci: '248719361',
  codeRegion: '75',
  codesPostaux: ['87400']
};

const SAINT_LAURENT_DE_CHAMOUSSET: Commune = {
  nom: 'Saint-Laurent-de-Chamousset',
  code: '69220',
  codeDepartement: '69',
  siren: '216902205',
  codeEpci: '200066587',
  codeRegion: '84',
  codesPostaux: ['69930']
};

const SAINT_PAUL_TROIS_CHATEAUX: Commune = {
  nom: 'Saint-Paul-Trois-Châteaux',
  code: '26324',
  codeDepartement: '26',
  siren: '212603245',
  codeEpci: '200042901',
  codeRegion: '84',
  codesPostaux: ['26130']
};

const VERSAILLES: Commune = {
  nom: 'Versailles',
  code: '78646',
  codeDepartement: '78',
  siren: '217806462',
  codeEpci: '247800584',
  codeRegion: '11',
  codesPostaux: ['78000']
};

const VILLEFRANCE_DE_ROUERGUE: Commune = {
  nom: 'Villefranche-de-Rouergue',
  code: '12300',
  codeDepartement: '12',
  siren: '211203005',
  codeEpci: '200069383',
  codeRegion: '76',
  codesPostaux: ['12200']
};

const MOUSSY: Commune = {
  nom: 'Moussy',
  code: '51390',
  codeDepartement: '51',
  siren: '215103631',
  codeEpci: '200067684',
  codeRegion: '44',
  codesPostaux: ['51530']
};

const SAINT_MARTIN_SUR_LE_PRE: Commune = {
  nom: 'Saint-Martin-sur-le-Pré',
  code: '51504',
  codeDepartement: '51',
  siren: '215104670',
  codeEpci: '200066876',
  codeRegion: '44',
  codesPostaux: ['51520']
};

const VERNON_07: Commune = {
  nom: 'Vernon',
  code: '07336',
  codeDepartement: '07',
  siren: '210703369',
  codeEpci: '240700302',
  codeRegion: '84',
  codesPostaux: ['07260']
};

const VERNON_07_FAKE: Commune = {
  nom: 'Vernon',
  code: '07222',
  codeDepartement: '07',
  siren: '210705893',
  codeEpci: '240700999',
  codeRegion: '84',
  codesPostaux: ['07430']
};

const VERNON_27: Commune = {
  nom: 'Vernon',
  code: '27681',
  codeDepartement: '27',
  siren: '212706816',
  codeEpci: '200072312',
  codeRegion: '28',
  codesPostaux: ['27200']
};

const COMMUNES: Commune[] = [
  BEGLES,
  BLOIS,
  BONNEVILLE_74,
  BONNEVILLE_80,
  BRIZON,
  CHALUS_63,
  CHALUS_87,
  ETREUX,
  GANNAT,
  GRENOBLE,
  LA_FERE,
  LIMOGES,
  MARSEILLE,
  MOUSSY,
  PIOBETTA,
  SAINT_EUSTACHE,
  SAINT_ETIENNE,
  SAINT_JORIOZ,
  SAINT_LEONARD_DE_NOBLAT,
  SAINT_LAURENT_DE_CHAMOUSSET,
  SAINT_MARTIN_SUR_LE_PRE,
  SAINT_PAUL_TROIS_CHATEAUX,
  VERNON_07,
  VERNON_07_FAKE,
  VERNON_27,
  VERSAILLES,
  VILLEFRANCE_DE_ROUERGUE
];

const STANDARD_MATCHING: LieuxMediationNumeriqueMatching = {
  code_postal: {
    colonne: 'Code postal'
  },
  commune: {
    colonne: 'Ville *'
  },
  adresse: {
    colonne: 'Adresse postale *'
  },
  complement_adresse: {
    colonne: 'Complement adresse'
  },
  code_insee: {
    colonne: 'Code INSEE'
  }
} as LieuxMediationNumeriqueMatching;

const SPLIT_VOIE_MATCHING: LieuxMediationNumeriqueMatching = {
  code_postal: {
    colonne: 'CP'
  },
  commune: {
    colonne: 'Commune'
  },
  adresse: {
    joindre: {
      colonnes: ['Numéro', 'Adresse'],
      séparateur: ' '
    }
  }
} as LieuxMediationNumeriqueMatching;

const CODE_POSTAL_IS_IN_ADRESSE_MATCHING: LieuxMediationNumeriqueMatching = {
  code_postal: {
    colonne: ''
  },
  commune: {
    colonne: 'commune'
  },
  adresse: {
    colonne: 'adresse'
  }
} as LieuxMediationNumeriqueMatching;

describe('adresse field', (): void => {
  it('should process a valid address', (): void => {
    const source: DataSource = {
      'Code postal': '38000',
      'Ville *': 'Grenoble',
      'Adresse postale *': '5 rue Malakoff'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '38185',
      code_postal: '38000',
      commune: 'Grenoble',
      voie: '5 rue Malakoff'
    });
  });

  it('should process a valid address with complement adresse', (): void => {
    const source: DataSource = {
      'Code postal': '38000',
      'Ville *': 'Grenoble',
      'Adresse postale *': '5 rue Malakoff',
      'Complement adresse': 'Allée 5'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '38185',
      code_postal: '38000',
      commune: 'Grenoble',
      voie: '5 rue Malakoff',
      complement_adresse: 'Allée 5'
    });
  });

  it('should process a valid address with code insee', (): void => {
    const source: DataSource = {
      'Code postal': '38000',
      'Ville *': 'Grenoble',
      'Adresse postale *': '5 rue Malakoff',
      'Code INSEE': '38110'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '38185',
      code_postal: '38000',
      commune: 'Grenoble',
      voie: '5 rue Malakoff'
    });
  });

  it('should not process empty address', (): void => {
    const source: DataSource = {
      'Code postal': '',
      'Ville *': '',
      'Adresse postale *': '',
      nom: 'test'
    };

    expect((): void => {
      processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);
    }).toThrow(new VoieError(''));
  });

  it('should fix value with code postal in adresse postale field instead of Code postal field', (): void => {
    const source: DataSource = {
      'Adresse postale *': '5, rue Malakoff,\n38000 Grenoble \n\n-\n\\n29, bis rue Colonel Bougault, 38100 Grenoble',
      'Code postal': '',
      'Ville *': 'grenoble'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '38185',
      code_postal: '38000',
      commune: 'Grenoble',
      voie: '5 rue Malakoff'
    });
  });

  it('should fix commune with invalid â character', (): void => {
    const source: DataSource = {
      'Adresse postale *': '10 rue du Serre Blanc',
      'Code postal': '26130',
      'Ville *': 'SAINT PAUL TROIS CH╢TEAUX'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '26324',
      code_postal: '26130',
      commune: 'Saint-Paul-Trois-Châteaux',
      voie: '10 rue du Serre Blanc'
    });
  });

  it('should fix code postal with extra . and digit', (): void => {
    const source: DataSource = {
      'Adresse postale *': '10 rue du Serre Blanc',
      'Code postal': '26130.0',
      'Ville *': 'SAINT PAUL TROIS CH╢TEAUX'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '26324',
      code_postal: '26130',
      commune: 'Saint-Paul-Trois-Châteaux',
      voie: '10 rue du Serre Blanc'
    });
  });

  it('should fix commune Saint Laurent de Chamousset with no code postal', (): void => {
    const source: DataSource = {
      'Adresse postale *': '122, avenue des 4 cantons',
      'Code postal': '',
      'Ville *': 'Saint Laurent de Chamousset'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '69220',
      code_postal: '69930',
      commune: 'Saint-Laurent-de-Chamousset',
      voie: '122 avenue des 4 cantons'
    });
  });

  it('should fix commune Gannat with no code postal', (): void => {
    const source: DataSource = {
      'Adresse postale *': '12 Allée des tilleuls',
      'Code postal': '',
      'Ville *': 'Gannat'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '03118',
      code_postal: '03800',
      commune: 'Gannat',
      voie: '12 Allée des tilleuls'
    });
  });

  it('should process an address with a split voie', (): void => {
    const source: DataSource = {
      CP: '38000',
      Commune: 'Grenoble',
      Adresse: 'rue Malakoff',
      Numéro: '5'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, SPLIT_VOIE_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '38185',
      code_postal: '38000',
      commune: 'Grenoble',
      voie: '5 rue Malakoff'
    });
  });

  it('should process an address with a number code postal', (): void => {
    const source: DataSource = {
      CP: 38000 as unknown as string,
      Commune: 'Grenoble',
      Adresse: 'rue Malakoff',
      Numéro: '5'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, SPLIT_VOIE_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '38185',
      code_postal: '38000',
      commune: 'Grenoble',
      voie: '5 rue Malakoff'
    });
  });

  it('should process an address with a number code postal with 4 digits', (): void => {
    const source: DataSource = {
      CP: '2800',
      Commune: 'La Fère',
      Adresse: 'rue Henri Martin',
      Numéro: '17'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, SPLIT_VOIE_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '02304',
      code_postal: '02800',
      commune: 'La Fère',
      voie: '17 rue Henri Martin'
    });
  });

  it('should process an address with a commune with details', (): void => {
    const source: DataSource = {
      CP: '02510',
      Commune: 'Etreux (Le Gard)',
      Adresse: 'rue Henri Martin',
      Numéro: '17'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, SPLIT_VOIE_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '02298',
      code_postal: '02510',
      commune: 'Étreux',
      voie: '17 rue Henri Martin'
    });
  });

  it('should process a voie with extra spaces in Adresse', (): void => {
    const source: DataSource = {
      CP: '78000',
      Commune: 'Versailles',
      Adresse: '    rue Saint     Louis  ',
      Numéro: '13'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, SPLIT_VOIE_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '78646',
      code_postal: '78000',
      commune: 'Versailles',
      voie: '13 rue Saint Louis'
    });
  });

  it('should process a commune with extra spaces in Commune and Adresse', (): void => {
    const source: DataSource = {
      CP: '78000',
      Commune: '    Versailles     ',
      Adresse: '    rue Saint     Louis  ',
      Numéro: '13'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, SPLIT_VOIE_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '78646',
      code_postal: '78000',
      commune: 'Versailles',
      voie: '13 rue Saint Louis'
    });
  });

  it('should process a complement adresse with extra spaces in Complement adresse', (): void => {
    const source: DataSource = {
      'Code postal': '78000',
      'Ville *': 'Versailles',
      'Adresse postale *': '13   rue Saint     Louis  ',
      'Complement adresse': '     Allée    5     '
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '78646',
      code_postal: '78000',
      commune: 'Versailles',
      voie: '13 rue Saint Louis',
      complement_adresse: 'Allée 5'
    });
  });

  it('should get code postal from Avenue François Mitterrand , 87230 Châlus', (): void => {
    const source: DataSource = {
      adresse: '28   Avenue François Mitterrand, 87230 Châlus',
      commune: 'Châlus'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, CODE_POSTAL_IS_IN_ADRESSE_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '87032',
      code_postal: '87230',
      commune: 'Châlus',
      voie: '28 Avenue François Mitterrand'
    });
  });

  it('should get code postal from Place Gay-Lussac, 87400 Saint-Léonard-de-Noblat', (): void => {
    const source: DataSource = {
      adresse: '3   Place Gay-Lussac, 87400 Saint-Léonard-de-Noblat',
      commune: 'Saint-Léonard-de-Noblat'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, CODE_POSTAL_IS_IN_ADRESSE_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '87161',
      code_postal: '87400',
      commune: 'Saint-Léonard-de-Noblat',
      voie: '3 Place Gay-Lussac'
    });
  });

  it('should remove invalid character ² in voie', (): void => {
    const source: DataSource = {
      'Code postal': '78000',
      'Ville *': 'Versailles',
      'Adresse postale *': "52 Route des Duc²s d'Anjou"
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '78646',
      code_postal: '78000',
      commune: 'Versailles',
      voie: "52 Route des Ducs d'Anjou"
    });
  });

  it('should replace unicode apostrophe by correct one', (): void => {
    const source: DataSource = {
      'Code postal': '78000',
      'Ville *': 'Versailles',
      'Adresse postale *': '52 Route des Ducs dAnjou'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '78646',
      code_postal: '78000',
      commune: 'Versailles',
      voie: "52 Route des Ducs d'Anjou"
    });
  });

  it('should retrieve code postal even with accent on commune', (): void => {
    const source: DataSource = {
      commune: 'Bègles',
      adresse: '1 avenue Pasteur'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, CODE_POSTAL_IS_IN_ADRESSE_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '33039',
      code_postal: '33130',
      commune: 'Bègles',
      voie: '1 avenue Pasteur'
    });
  });

  it('should retrieve code postal and commune from voie', (): void => {
    const CODE_POSTAL_AND_COMMUNE_ARE_IN_ADRESSE_MATCHING: LieuxMediationNumeriqueMatching = {
      code_postal: {
        colonne: ''
      },
      commune: {
        colonne: ''
      },
      adresse: {
        colonne: 'adresse'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      adresse: 'Mairie de Piobetta 20234 PIOBETTA'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, CODE_POSTAL_AND_COMMUNE_ARE_IN_ADRESSE_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '2B234',
      code_postal: '20234',
      commune: 'Piobetta',
      voie: 'Mairie de Piobetta'
    });
  });

  it('should retrieve code insee with multiple code postal in code insee data base', (): void => {
    const source: DataSource = {
      'Code postal': '87000',
      'Ville *': 'Limoges',
      'Adresse postale *': '5 rue Malakoff'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '87000',
      code_insee: '87085',
      commune: 'Limoges',
      voie: '5 rue Malakoff'
    });
  });

  it('should retrieve code insee with commune name with arrondissement', (): void => {
    const source: DataSource = {
      'Code postal': '13006',
      'Ville *': 'Marseille',
      'Adresse postale *': '5 rue Malakoff'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '13006',
      code_insee: '13055',
      commune: 'Marseille',
      voie: '5 rue Malakoff'
    });
  });

  it('should find code insee for commune that share name and code postal with other communes', (): void => {
    const source: DataSource = {
      'Code postal': '74130',
      'Ville *': 'Bonneville',
      'Adresse postale *': 'Place de la mairie'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '74130',
      code_insee: '74042',
      commune: 'Bonneville',
      voie: 'Place de la mairie'
    });
  });

  it('should find commune in voie with space and no comma', (): void => {
    const source: DataSource = {
      'Adresse postale *': '9, Place de la paix 51530 MOUSSY'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '51390',
      code_postal: '51530',
      commune: 'Moussy',
      voie: '9 Place de la paix'
    });
  });

  it('should find commune in voie with comma', (): void => {
    const source: DataSource = {
      'Adresse postale *': '38 Rue des Dats, 51520, Saint-Martin-sur-le-Pré, Marne, Grand Est'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_insee: '51504',
      code_postal: '51520',
      commune: 'Saint-Martin-sur-le-Pré',
      voie: '38 Rue des Dats'
    });
  });

  it('should check if code postal is the good one', (): void => {
    const source: DataSource = {
      'Code postal': '12204',
      'Ville *': 'Villefranche-de-Rouergue',
      'Adresse postale *': 'Chemin de 13 pierres - BP 421'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '12200',
      code_insee: '12300',
      commune: 'Villefranche-de-Rouergue',
      voie: 'Chemin de 13 pierres - BP 421'
    });
  });

  it('should get Saint-Barbant old commune', (): void => {
    const source: DataSource = {
      'Code postal': '87330',
      'Ville *': 'Saint-Barbant',
      'Adresse postale *': '12 rue des lilas'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '87330',
      code_insee: '87028',
      commune: "Val-d'Oire-et-Gartempe",
      voie: '12 rue des lilas'
    });
  });

  it('should find code postal matching code departement when there is multiple communes with the same name and wrong code postal', (): void => {
    const source: DataSource = {
      'Code postal': '27220',
      'Ville *': 'Vernon',
      'Adresse postale *': '3 place de la Mairie'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '27200',
      code_insee: '27681',
      commune: 'Vernon',
      voie: '3 place de la Mairie'
    });
  });

  it('should not find code postal matching code departement when there is multiple communes with the same iname in the same departement', (): void => {
    const source: DataSource = {
      'Code postal': '07330',
      'Ville *': 'Vernon',
      'Adresse postale *': '3 place de la Mairie'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '07330',
      commune: 'Vernon',
      voie: '3 place de la Mairie'
    });
  });

  it('should find commune by check name before checking code postal', (): void => {
    const source: DataSource = {
      'Code postal': '42000',
      'Code INSEE': '42218',
      'Ville *': 'Blois',
      'Adresse postale *': '11 place René Coty 42000 Blois'
    };

    const adresse: Adresse = processAdresse(findCommune(COMMUNES))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '41000',
      code_insee: '41018',
      commune: 'Blois',
      voie: '11 place René Coty'
    });
  });
});
