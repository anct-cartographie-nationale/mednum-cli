/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Adresse, CommuneError } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Report } from '../../report';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { processAdresse } from './adresse.field';

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
    colonne: 'inAdresse'
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

    const adresse: Adresse = processAdresse(Report().entry(0))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
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

    const adresse: Adresse = processAdresse(Report().entry(0))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
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

    const adresse: Adresse = processAdresse(Report().entry(0))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '38000',
      commune: 'Grenoble',
      voie: '5 rue Malakoff',
      code_insee: '38110'
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
      processAdresse(Report().entry(0))(source, STANDARD_MATCHING);
    }).toThrow(new CommuneError(''));
  });

  it('should fix value with code postal in adresse postale field instead of Code postal field', (): void => {
    const source: DataSource = {
      'Adresse postale *': '5, rue Malakoff,\n38000 Grenoble \n\n-\n\\n29, bis rue Colonel Bougault, 38100 Grenoble',
      'Code postal': '',
      'Ville *': 'grenoble'
    };

    const adresse: Adresse = processAdresse(Report().entry(0))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '38100',
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

    const adresse: Adresse = processAdresse(Report().entry(0))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '26130',
      commune: 'SAINT PAUL TROIS CHÂTEAUX',
      voie: '10 rue du Serre Blanc'
    });
  });

  it('should fix code postal with extra . and digit', (): void => {
    const source: DataSource = {
      'Adresse postale *': '10 rue du Serre Blanc',
      'Code postal': '68100.0',
      'Ville *': 'SAINT PAUL TROIS CH╢TEAUX'
    };

    const adresse: Adresse = processAdresse(Report().entry(0))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '68100',
      commune: 'SAINT PAUL TROIS CHÂTEAUX',
      voie: '10 rue du Serre Blanc'
    });
  });

  it('should fix commune Saint Laurent de Chamousset with no code postal', (): void => {
    const source: DataSource = {
      'Adresse postale *': '122, avenue des 4 cantons',
      'Code postal': '',
      'Ville *': 'Saint Laurent de Chamousset'
    };

    const adresse: Adresse = processAdresse(Report().entry(0))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '69930',
      commune: 'Saint Laurent de Chamousset',
      voie: '122 avenue des 4 cantons'
    });
  });

  it('should fix commune Gannat with no code postal', (): void => {
    const source: DataSource = {
      'Adresse postale *': '12 Allée des tilleuls',
      'Code postal': '',
      'Ville *': 'Gannat'
    };

    const adresse: Adresse = processAdresse(Report().entry(0))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
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

    const adresse: Adresse = processAdresse(Report().entry(0))(source, SPLIT_VOIE_MATCHING);

    expect(adresse).toStrictEqual({
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

    const adresse: Adresse = processAdresse(Report().entry(0))(source, SPLIT_VOIE_MATCHING);

    expect(adresse).toStrictEqual({
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

    const adresse: Adresse = processAdresse(Report().entry(0))(source, SPLIT_VOIE_MATCHING);

    expect(adresse).toStrictEqual({
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

    const adresse: Adresse = processAdresse(Report().entry(0))(source, SPLIT_VOIE_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '02510',
      commune: 'Etreux',
      voie: '17 rue Henri Martin'
    });
  });

  it('should process a voie with extra spaces in', (): void => {
    const source: DataSource = {
      CP: '78000',
      Commune: 'Versailles',
      Adresse: '    rue Saint     Louis  ',
      Numéro: '13'
    };

    const adresse: Adresse = processAdresse(Report().entry(0))(source, SPLIT_VOIE_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '78000',
      commune: 'Versailles',
      voie: '13 rue Saint Louis'
    });
  });

  it('should process a commune with extra spaces in', (): void => {
    const source: DataSource = {
      CP: '78000',
      Commune: '   Versailles     ',
      Adresse: '    rue Saint     Louis  ',
      Numéro: '13'
    };

    const adresse: Adresse = processAdresse(Report().entry(0))(source, SPLIT_VOIE_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '78000',
      commune: 'Versailles',
      voie: '13 rue Saint Louis'
    });
  });

  it('should process a complement adresse with extra spaces in', (): void => {
    const source: DataSource = {
      'Code postal': '78000',
      'Ville *': 'Versailles',
      'Adresse postale *': '13   rue Saint     Louis  ',
      'Complement adresse': '     Allée    5     '
    };

    const adresse: Adresse = processAdresse(Report().entry(0))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
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

    const adresse: Adresse = processAdresse(Report().entry(0))(source, CODE_POSTAL_IS_IN_ADRESSE_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '87230',
      commune: 'Châlus',
      voie: '28 Avenue François Mitterrand 87230 Châlus'
    });
  });

  it('should get code postal from Place Gay-Lussac, 87400 Saint-Léonard-de-Noblat', (): void => {
    const source: DataSource = {
      adresse: '3   Place Gay-Lussac, 87400 Saint-Léonard-de-Noblat',
      commune: 'Saint-Léonard-de-Noblat'
    };

    const adresse: Adresse = processAdresse(Report().entry(0))(source, CODE_POSTAL_IS_IN_ADRESSE_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '87400',
      commune: 'Saint-Léonard-de-Noblat',
      voie: '3 Place Gay-Lussac 87400 Saint-Léonard-de-Noblat'
    });
  });

  it('should replace unicode apostrophe by correct one', (): void => {
    const source: DataSource = {
      'Code postal': '78000',
      'Ville *': 'Versailles',
      'Adresse postale *': '52 Route des Ducs dAnjou'
    };

    const adresse: Adresse = processAdresse(Report().entry(0))(source, STANDARD_MATCHING);

    expect(adresse).toStrictEqual({
      code_postal: '78000',
      commune: 'Versailles',
      voie: "52 Route des Ducs d'Anjou"
    });
  });
});
