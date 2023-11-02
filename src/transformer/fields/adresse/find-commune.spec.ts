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

const BONNE: Commune = {
  nom: 'BONNE',
  code: '74045',
  codeDepartement: '74',
  siren: '217400741',
  codeEpci: '200000188',
  codeRegion: '84',
  codesPostaux: ['74130']
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

const ETREUX: Commune = {
  nom: 'Étreux',
  code: '02298',
  codeDepartement: '02',
  siren: '210202818',
  codeEpci: '200071983',
  codeRegion: '32',
  codesPostaux: ['02510']
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

const L_ARBRESLE: Commune = {
  nom: "L'Arbresle",
  code: '69010',
  codeDepartement: '69',
  siren: '216900100',
  codeEpci: '246900625',
  codeRegion: '84',
  codesPostaux: ['69210']
};

const MARCQ_EN_BAROEUL: Commune = {
  nom: 'Marcq-en-Barœul',
  code: '59378',
  codeDepartement: '59',
  siren: '215903782',
  codeEpci: '200093201',
  codeRegion: '32',
  codesPostaux: ['59700']
};

describe('find commune', (): void => {
  it('should get commune by code postal', (): void => {
    const communes: Commune[] = [GRENOBLE, BEGLES, CHALUS_63, ETREUX];

    const commune: Commune | undefined = findCommune(communes).parCodePostal('63340');

    expect(commune).toStrictEqual<Commune>(CHALUS_63);
  });

  it('should get commune by name', (): void => {
    const communes: Commune[] = [GRENOBLE, BEGLES, CHALUS_63, ETREUX];

    const commune: Commune | undefined = findCommune(communes).parNom(CHALUS_63.nom);

    expect(commune).toStrictEqual<Commune>(CHALUS_63);
  });

  it('should get commune by name and by code postal', (): void => {
    const communes: Commune[] = [BRIZON, BONNEVILLE_80, BONNEVILLE_74];

    const commune: Commune | undefined = findCommune(communes).parNomEtCodePostal(BONNEVILLE_74.nom, '74130');

    expect(commune).toStrictEqual<Commune>(BONNEVILLE_74);
  });

  it('should get commune by name and by code postal event if nom is a shorten version of official commune name', (): void => {
    const communes: Commune[] = [BRIZON, BONNEVILLE_80, BONNEVILLE_74];

    const commune: Commune | undefined = findCommune(communes).parNomEtCodePostal('bonnevill', '74130');

    expect(commune).toStrictEqual<Commune>(BONNEVILLE_74);
  });

  it('should not get commune by short name and by code postal if there is another commune with the same short name ans the same code postal', (): void => {
    const communes: Commune[] = [BRIZON, BONNEVILLE_80, BONNEVILLE_74, BONNE];

    const commune: Commune | undefined = findCommune(communes).parNomEtCodePostal('bonne', '74130');

    expect(commune).toStrictEqual<Commune>(BONNE);
  });

  it('should get commune by name and by code postal event if nom is an expanded version of official commune name', (): void => {
    const communes: Commune[] = [BRIZON, BONNEVILLE_80, BONNEVILLE_74];

    const commune: Commune | undefined = findCommune(communes).parNomEtCodePostal('bonneville-trois-monts', '74130');

    expect(commune).toStrictEqual<Commune>(BONNEVILLE_74);
  });

  it('should get commune by name when apostrophe is missing', (): void => {
    const communes: Commune[] = [L_ARBRESLE];

    const commune: Commune | undefined = findCommune(communes).parNom('L ARBRESLE');

    expect(commune).toStrictEqual<Commune>(L_ARBRESLE);
  });

  it('should get commune by name when it constains œ', (): void => {
    const communes: Commune[] = [MARCQ_EN_BAROEUL];

    const commune: Commune | undefined = findCommune(communes).parNom('Marcq-en-Baroeul');

    expect(commune).toStrictEqual<Commune>(MARCQ_EN_BAROEUL);
  });
});
