import {
  Commune,
  communeParCodePostal,
  communeParNom,
  communeParNomEtCodePostal,
  communesParCodePostalMap,
  communesParNomMap
} from './find-commune';

const BEGLES: Commune = {
  nom: 'Bègles',
  code: '33039',
  codeDepartement: '33',
  siren: '213300395',
  codeEpci: '243300316',
  codeRegion: '75',
  codesPostaux: ['33130'],
  population: 30543
};

const BONNE: Commune = {
  nom: 'BONNE',
  code: '74045',
  codeDepartement: '74',
  siren: '217400741',
  codeEpci: '200000188',
  codeRegion: '84',
  codesPostaux: ['74130'],
  population: 6364
};

const BONNEVILLE_74: Commune = {
  nom: 'Bonneville',
  code: '74042',
  codeDepartement: '74',
  siren: '217400423',
  codeEpci: '200000172',
  codeRegion: '84',
  codesPostaux: ['74130'],
  population: 12511
};

const BONNEVILLE_80: Commune = {
  nom: 'Bonneville',
  code: '80113',
  codeDepartement: '80',
  siren: '218001071',
  codeEpci: '200070951',
  codeRegion: '32',
  codesPostaux: ['80670'],
  population: 337
};

const BRIZON: Commune = {
  nom: 'Brizon',
  code: '74049',
  codeDepartement: '74',
  siren: '217400498',
  codeEpci: '200000172',
  codeRegion: '84',
  codesPostaux: ['74130'],
  population: 481
};

const CHALUS_63: Commune = {
  nom: 'Chalus',
  code: '63074',
  codeDepartement: '63',
  siren: '216300749',
  codeEpci: '200070407',
  codeRegion: '84',
  codesPostaux: ['63340'],
  population: 182
};

const CHALUS_87: Commune = {
  nom: 'Châlus',
  code: '87032',
  codeDepartement: '87',
  siren: '218703205',
  codeEpci: '200070506',
  codeRegion: '75',
  codesPostaux: ['87230'],
  population: 1647
};

const ETREUX: Commune = {
  nom: 'Étreux',
  code: '02298',
  codeDepartement: '02',
  siren: '210202818',
  codeEpci: '200071983',
  codeRegion: '32',
  codesPostaux: ['02510'],
  population: 1454
};

const GRENOBLE: Commune = {
  nom: 'Grenoble',
  code: '38185',
  codeDepartement: '38',
  siren: '213801855',
  codeEpci: '200040715',
  codeRegion: '84',
  codesPostaux: ['38000', '38100'],
  population: 158240
};

const L_ARBRESLE: Commune = {
  nom: "L'Arbresle",
  code: '69010',
  codeDepartement: '69',
  siren: '216900100',
  codeEpci: '246900625',
  codeRegion: '84',
  codesPostaux: ['69210'],
  population: 6437
};

const MARCQ_EN_BAROEUL: Commune = {
  nom: 'Marcq-en-Barœul',
  code: '59378',
  codeDepartement: '59',
  siren: '215903782',
  codeEpci: '200093201',
  codeRegion: '32',
  codesPostaux: ['59700'],
  population: 38604
};

const SAINT_CLEMENT_LES_PLACES: Commune = {
  nom: 'Saint-Clément-les-Places',
  code: '69187',
  codeDepartement: '69',
  siren: '216901876',
  codeEpci: '200066587',
  codeRegion: '84',
  codesPostaux: ['69930'],
  population: 653
};

const SAINT_LAURENT_DE_CHAMOUSSET: Commune = {
  nom: 'Saint-Laurent-de-Chamousset',
  code: '69220',
  codeDepartement: '69',
  siren: '216902205',
  codeEpci: '200066587',
  codeRegion: '84',
  codesPostaux: ['69930'],
  population: 1798
};

describe('find commune', (): void => {
  it('should get communes indexed by name', (): void => {
    const communes: Commune[] = [BEGLES, CHALUS_63, ETREUX];

    expect(communesParNomMap(communes)).toStrictEqual<Map<string, Commune>>(
      new Map<string, Commune>([
        ['begles', BEGLES],
        ['chalus', CHALUS_63],
        ['etreux', ETREUX]
      ])
    );
  });

  it('should get communes indexed by name only for communes that have different names', (): void => {
    const communes: Commune[] = [CHALUS_63, CHALUS_87];

    expect(communesParNomMap(communes)).toStrictEqual<Map<string, Commune>>(new Map<string, Commune>());
  });

  it('should get communes indexed by code postal', (): void => {
    const communes: Commune[] = [BEGLES, CHALUS_63, ETREUX];

    expect(communesParCodePostalMap(communes)).toStrictEqual<Map<string, Commune>>(
      new Map<string, Commune>([
        ['33130', BEGLES],
        ['63340', CHALUS_63],
        ['02510', ETREUX]
      ])
    );
  });

  it('should get multiple times the same commune when it has multiple code postal', (): void => {
    const communes: Commune[] = [GRENOBLE, BEGLES, CHALUS_63, ETREUX];

    expect(communesParCodePostalMap(communes)).toStrictEqual<Map<string, Commune>>(
      new Map<string, Commune>([
        ['38000', GRENOBLE],
        ['38100', GRENOBLE],
        ['33130', BEGLES],
        ['63340', CHALUS_63],
        ['02510', ETREUX]
      ])
    );
  });

  it('should get communes indexed by code postal only for communes that have different code postal', (): void => {
    const communes: Commune[] = [SAINT_CLEMENT_LES_PLACES, SAINT_LAURENT_DE_CHAMOUSSET];

    expect(communesParCodePostalMap(communes)).toStrictEqual<Map<string, Commune>>(new Map<string, Commune>());
  });

  it('should get commune by code postal', (): void => {
    const communes: Commune[] = [GRENOBLE, BEGLES, CHALUS_63, ETREUX];

    const commune: Commune | undefined = communeParCodePostal(communesParCodePostalMap(communes))('63340');

    expect(commune).toStrictEqual<Commune>(CHALUS_63);
  });

  it('should get commune by name', (): void => {
    const communes: Commune[] = [GRENOBLE, BEGLES, CHALUS_63, ETREUX];

    const commune: Commune | undefined = communeParNom(communesParNomMap(communes))(CHALUS_63.nom);

    expect(commune).toStrictEqual<Commune>(CHALUS_63);
  });

  it('should get commune by name and by code postal', (): void => {
    const communes: Commune[] = [BRIZON, BONNEVILLE_80, BONNEVILLE_74];

    const commune: Commune | undefined = communeParNomEtCodePostal(communes)(BONNEVILLE_74.nom, '74130');

    expect(commune).toStrictEqual<Commune>(BONNEVILLE_74);
  });

  it('should get commune by name and by code postal event if nom is a shorten version of official commune name', (): void => {
    const communes: Commune[] = [BRIZON, BONNEVILLE_80, BONNEVILLE_74];

    const commune: Commune | undefined = communeParNomEtCodePostal(communes)('bonnevill', '74130');

    expect(commune).toStrictEqual<Commune>(BONNEVILLE_74);
  });

  it('should not get commune by short name and by code postal if there is another commune with the same short name ans the same code postal', (): void => {
    const communes: Commune[] = [BRIZON, BONNEVILLE_80, BONNEVILLE_74, BONNE];

    const commune: Commune | undefined = communeParNomEtCodePostal(communes)('bonne', '74130');

    expect(commune).toStrictEqual<Commune>(BONNE);
  });

  it('should get commune by name and by code postal event if nom is an expanded version of official commune name', (): void => {
    const communes: Commune[] = [BRIZON, BONNEVILLE_80, BONNEVILLE_74];

    const commune: Commune | undefined = communeParNomEtCodePostal(communes)('bonneville-trois-monts', '74130');

    expect(commune).toStrictEqual<Commune>(BONNEVILLE_74);
  });

  it('should get commune by name when apostrophe is missing', (): void => {
    const communes: Commune[] = [L_ARBRESLE];

    const commune: Commune | undefined = communeParNom(communesParNomMap(communes))('L ARBRESLE');

    expect(commune).toStrictEqual<Commune>(L_ARBRESLE);
  });

  it('should get commune by name when it constains œ', (): void => {
    const communes: Commune[] = [MARCQ_EN_BAROEUL];

    const commune: Commune | undefined = communeParNom(communesParNomMap(communes))('Marcq-en-Baroeul');

    expect(commune).toStrictEqual<Commune>(MARCQ_EN_BAROEUL);
  });
});
