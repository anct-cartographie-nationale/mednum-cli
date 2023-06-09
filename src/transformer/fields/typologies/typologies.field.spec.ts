import { LabelNational, Typologie, Typologies } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { processTypologies } from './typologies.field';
import { DataSource, LieuxMediationNumeriqueMatching } from '../../input';

describe('typologie field', (): void => {
  it('should not get ant typologie when name do not match anything', (): void => {
    const source: DataSource = {
      name: 'Les bricodeurs'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBeUndefined();
  });

  it('should always get RFS as typologie', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      typologies: [{ cible: Typologie.RFS }]
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {};

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.RFS);
  });

  it('should always get RFS as typologie even if name could match something else', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' },
      typologies: [{ cible: Typologie.RFS }]
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      name: 'Mairie de Lyon'
    };
    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.RFS);
  });

  it('should always get TIERS_LIEUX as typologie', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      typologies: [{ cible: Typologie.TIERS_LIEUX }]
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {};

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.TIERS_LIEUX);
  });

  it('should get MUNI as typologie when name contains mairie', (): void => {
    const source: DataSource = {
      name: 'Mairie de Lyon'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.MUNI);
  });

  it('should get MUNI as typologie when name is hôtel de ville', (): void => {
    const source: DataSource = {
      name: 'Hôtel de ville de Brignais'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.MUNI);
  });

  it('should get MUNI as typologie when name is Commune de Maclas', (): void => {
    const source: DataSource = {
      name: 'Commune de Maclas'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.MUNI);
  });

  it('should get MUNI as typologie when name start with ville de', (): void => {
    const source: DataSource = {
      name: 'VILLE DE SAINTE-LUCE'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.MUNI);
  });

  it('should get MUNI as typologie when name start with ville du', (): void => {
    const source: DataSource = {
      name: 'VILLE DU ROBERT'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.MUNI);
  });

  it('should get ASSO as typologie when name contains association', (): void => {
    const source: DataSource = {
      name: 'Association Familles Rurales de Verrières en Forez'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.ASSO);
  });

  it('should get ASSO as typologie when name contains ASS', (): void => {
    const source: DataSource = {
      name: 'ASS QUERCY PAYS DE SERRES'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.ASSO);
  });

  it('should get ASSO as typologie when name contains ASSOC', (): void => {
    const source: DataSource = {
      name: 'ASSOC INTER DE RESSOURCES ACTION SOCIALE'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.ASSO);
  });

  it('should get ASSO as typologie when name contains emmaüs', (): void => {
    const source: DataSource = {
      name: 'Emmaüs Connect Lyon'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.ASSO);
  });

  it('should get ASSO as typologie when name contains secours populaire', (): void => {
    const source: DataSource = {
      name: 'SECOURS POPULAIRE FRANCAIS'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.ASSO);
  });

  it('should get ASSO as typologie when name contains croix-rouge', (): void => {
    const source: DataSource = {
      name: 'Croix-Rouge (Antenne de Villeurbanne)'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.ASSO);
  });

  it('should get ASSO as typologie when name contains secours catholique', (): void => {
    const source: DataSource = {
      name: 'Secours Catholique'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.ASSO);
  });

  it('should get ASSO as typologie when name contains restos du coeur', (): void => {
    const source: DataSource = {
      name: 'Restos du Cœur'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.ASSO);
  });

  it('should get ASSO as typologie when name contains AFR', (): void => {
    const source: DataSource = {
      name: 'AFR'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.ASSO);
  });

  it('should get ASSO as typologie when name contains familles rurales', (): void => {
    const source: DataSource = {
      name: "FAMILLES RURALES-FEDERATION DEPARTEMENTALE DE L'AVEYRON"
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.ASSO);
  });

  it('should get CS as typologie when name contains centre social', (): void => {
    const source: DataSource = {
      name: 'ASS CENTRE SOCIAL VIVARAIZE'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CS);
  });

  it('should get CS as typologie when name contains Centres sociaux', (): void => {
    const source: DataSource = {
      name: 'Centres sociaux Fidésiens Neyrard\n'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CS);
  });

  it('should get RFS as typologie when name contains france service', (): void => {
    const source: DataSource = {
      name: 'maison france service'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.RFS);
  });

  it('should get RFS as typologie when name contains EFS', (): void => {
    const source: DataSource = {
      name: 'EFS SAINT SYMPHORIEN'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.RFS);
  });

  it('should get RFS as typologie when name contains france-services', (): void => {
    const source: DataSource = {
      name: 'FRANCE-SERVICES Bédarieux'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.RFS);
  });

  it("should get RFS as typologie for exception Fixe Bruay-sur-l'Escaut  ( Département du Nord)", (): void => {
    const source: DataSource = {
      name: "Fixe Bruay-sur-l'Escaut  ( Département du Nord)"
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.RFS);
  });

  it("should get RFS as typologie for exception Folschviller - Antenne de L'Hôpital", (): void => {
    const source: DataSource = {
      name: "Folschviller - Antenne de L'Hôpital"
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.RFS);
  });

  it('should get RFS as typologie for exception Communauté de communes Vaison Ventoux', (): void => {
    const source: DataSource = {
      name: 'Communauté de communes Vaison Ventoux'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.RFS);
  });

  it('should get RFS as typologie when France Services label is present', (): void => {
    const source: DataSource = {
      name: 'Mairie de meudon',
      estFranceServices: 'OUI'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' },
      labels_nationaux: [
        {
          colonnes: ['estFranceServices'],
          termes: ['OUI'],
          cible: LabelNational.FranceServices
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.RFS);
  });

  it('should get BIB as typologie when name contains médiathèque', (): void => {
    const source: DataSource = {
      name: 'MÉDIATHÈQUE DE SAINTE-LUCE'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.BIB);
  });

  it('should get BIB as typologie when name contains mediatheque', (): void => {
    const source: DataSource = {
      name: 'Mediatheque de chateaudun'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.BIB);
  });

  it('should get BIB as typologie when name contains bibliothèque', (): void => {
    const source: DataSource = {
      name: 'Bibliothèque Municipale de Caudry'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.BIB);
  });

  it('should get BIB as typologie when name contains bibliotheque', (): void => {
    const source: DataSource = {
      name: 'Bibliotheque'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.BIB);
  });

  it('should get TIERS_LIEUX as typologie when name contains tiers-lieu', (): void => {
    const source: DataSource = {
      name: 'TIERS-LIEU NUMERIQUE'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.TIERS_LIEUX);
  });

  it('should get TIERS_LIEUX as typologie when name contains cowork', (): void => {
    const source: DataSource = {
      name: 'HUB 36 COWORKING'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.TIERS_LIEUX);
  });

  it('should get TIERS_LIEUX as typologie when name contains tiers lieu', (): void => {
    const source: DataSource = {
      name: 'LE TIERS LIEU DE CARPENTRAS'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.TIERS_LIEUX);
  });

  it('should get CCAS as typologie when name contains ccas', (): void => {
    const source: DataSource = {
      name: 'CCAS de Seyssins'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CCAS);
  });

  it('should get CCAS as typologie when name contains centre communal d’action social', (): void => {
    const source: DataSource = {
      name: 'Centre Communal d’Action Social - Nantes'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CCAS);
  });

  it('should get CCAS as typologie when name contains ctre com action social', (): void => {
    const source: DataSource = {
      name: 'CTRE COM ACTION SOCIALE CASTELSARRASIN\n'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CCAS);
  });

  it('should get ML as typologie when name contains mission locale', (): void => {
    const source: DataSource = {
      name: 'MISSION LOCALE DU CENTRE DE LA MARTINIQUE'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.ML);
  });

  it('should get ML as typologie when name contains mis local', (): void => {
    const source: DataSource = {
      name: 'MIS LOCAL INSERTION PROF JEUNES TARN GNE'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.ML);
  });

  it('should get MQ as typologie when name contains maison de quartier', (): void => {
    const source: DataSource = {
      name: 'Maison de Quartier - Le Trois-Mâts'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.MQ);
  });

  it('should get CHRS as typologie when name contains CHRS', (): void => {
    const source: DataSource = {
      name: 'CHRS de Fages'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CHRS);
  });

  it('should get CHU as typologie when name contains CHU', (): void => {
    const source: DataSource = {
      name: 'CHU du Pré'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CHU);
  });

  it('should get MDS as typologie when name contains maison départementale des solidarités', (): void => {
    const source: DataSource = {
      name: "Maison Départementale des Solidarités de l'Anjou Bleu"
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.MDS);
  });

  it('should get MDS as typologie when name contains maison de la solidarité départementale', (): void => {
    const source: DataSource = {
      name: 'Maison de la Solidarité Départementale de MAURIAC'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.MDS);
  });

  it('should get MDS as typologie when name contains maison départementale de la solidarité', (): void => {
    const source: DataSource = {
      name: "Maison Départementale de la Solidarité du Val d'Adour"
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.MDS);
  });

  it('should get MDS as typologie when name contains espace départementale de la solidarité', (): void => {
    const source: DataSource = {
      name: 'Espace Départemental des Solidarités'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.MDS);
  });

  it('should get PE as typologie when name contains pôle emploi', (): void => {
    const source: DataSource = {
      name: 'Pôle Emploi Oullins'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.PE);
  });

  it('should get PE as typologie when name contains pole emploi', (): void => {
    const source: DataSource = {
      name: 'Pole emploi La plaine'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.PE);
  });

  it('should get MJC as typologie when name contains MJC', (): void => {
    const source: DataSource = {
      name: 'MJC Louis Aragon'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.MJC);
  });

  it('should get MJC as typologie when name contains maison des jeunes de la culture', (): void => {
    const source: DataSource = {
      name: 'MAISON DES JEUNES DE LA CULTURE'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.MJC);
  });

  it('should get MJC as typologie when name contains Maison des Jeunes et de la Culture', (): void => {
    const source: DataSource = {
      name: 'Maison des Jeunes et de la Culture'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.MJC);
  });

  it('should get MDE as typologie when name contains MDE', (): void => {
    const source: DataSource = {
      name: 'MDE CONVERGENCE ENTREPRENEURS'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.MDE);
  });

  it("should get MDE as typologie when name contains maison de l'emploi", (): void => {
    const source: DataSource = {
      name: "MAISON DE L'INSERTION, DE L'EMPLOI ET DE L'ENTREPRISE - MIFE ISERE"
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.MDE);
  });

  it('should get CC as typologie when name contains communauté de communes', (): void => {
    const source: DataSource = {
      name: 'Communauté de communes du Plateau Picard'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CC);
  });

  it('should get CC as typologie when name contains communaute com', (): void => {
    const source: DataSource = {
      name: 'COMMUNAUTE COM DU QUERCY CAUSSADAIS'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CC);
  });

  it('should get CC as typologie when name contains COMMUNAUTE DE COMMUNES', (): void => {
    const source: DataSource = {
      name: 'COMMUNAUTE DE COMMUNES DES RIVES DU HAUT ALLIER\n'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CC);
  });

  it('should get CC as typologie when name contains cdc', (): void => {
    const source: DataSource = {
      name: 'Cdc des collines du Perche Normand\n'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CC);
  });

  it('should get CC as typologie when name contains CC', (): void => {
    const source: DataSource = {
      name: "CC PAYS D'ORTHE ET ARRIGANS"
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CC);
  });

  it("should get CHRS as typologie when name contains centre d'hébergement et de réinsertion sociale", (): void => {
    const source: DataSource = {
      name: "Centre d'Hébergement et de Réinsertion Sociale (CHRS)"
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CHRS);
  });

  it('should get UDAF as typologie when name contains UDAF', (): void => {
    const source: DataSource = {
      name: 'Maison de la Famille - UDAF'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.UDAF);
  });

  it('should get UDAF as typologie when name contains union des associations familiales', (): void => {
    const source: DataSource = {
      name: 'UNION DES ASSOCIATIONS FAMILIALES'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.UDAF);
  });

  it('should get PIMMS as typologie when name contains PIMMS', (): void => {
    const source: DataSource = {
      name: 'PIMMS PORTES DE PROVENCE'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.PIMMS);
  });

  it('should get PIMMS as typologie when name contains point information mediation multi services', (): void => {
    const source: DataSource = {
      name: 'POINT INFORMATION MEDIATION MULTI SERVICES DE NIMES'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.PIMMS);
  });

  it('should get PIMMS as typologie even when name contains France Services', (): void => {
    const source: DataSource = {
      name: 'France Services - PIMMS de Libercourt'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.PIMMS);
  });

  it('should get CIAS as typologie when name contains CIAS', (): void => {
    const source: DataSource = {
      name: 'CIAS des Vallées du Haut-Anjou'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CIAS);
  });
  it("should get CIAS as typologie when name contains centre intercommunal d'action sociale", (): void => {
    const source: DataSource = {
      name: "CENTRE INTERCOMMUNAL D'ACTION SOCIALE"
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CIAS);
  });

  it('should get AFPA as typologie when name contains AFPA', (): void => {
    const source: DataSource = {
      name: 'AFPA'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.AFPA);
  });

  it('should get CIAS as typologie when name contains sous-prefecture', (): void => {
    const source: DataSource = {
      name: 'SOUS-PREFECTURE DE BRIOUDE'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.PREF);
  });

  it('should get CD as typologie when name contains conseil départemental', (): void => {
    const source: DataSource = {
      name: "Conseillers numériques Conseil Départemental de l'Allier"
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CD);
  });

  it("should get CAF as typologie when name contains caisse d'allocations familiales", (): void => {
    const source: DataSource = {
      name: "Caisse d'Allocations Familiales de l'Ain - Antenne"
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CAF);
  });

  it('should get RS_FJT as typologie when name contains FJT', (): void => {
    const source: DataSource = {
      name: 'FJT La Clairière FOL73'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.RS_FJT);
  });

  it('should get PIJ_BIJ as typologie when name contains information jeunesse', (): void => {
    const source: DataSource = {
      name: 'Savoie Information Jeunesse'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.PIJ_BIJ);
  });

  it('should get PIJ_BIJ as typologie when name point accueil jeunesse', (): void => {
    const source: DataSource = {
      name: 'Point Accueil Jeunesse'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.PIJ_BIJ);
  });

  it('should get PIJ as typologie when name contains PIJ', (): void => {
    const source: DataSource = {
      name: 'PIJ Valence Romans Agglo'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.PIJ_BIJ);
  });

  it('should get PIJ as typologie when name contains info jeunes', (): void => {
    const source: DataSource = {
      name: "Info Jeunes Annecy (IJ'Annecy)"
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.PIJ_BIJ);
  });

  it('should get PIJ as typologie when name contains CRIJ', (): void => {
    const source: DataSource = {
      name: 'CRIJ Auvergne Rhône-Alpes'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.PIJ_BIJ);
  });

  it('should get CAP_EMPLOI as typologie when name contains cap emploi', (): void => {
    const source: DataSource = {
      name: 'CAP EMPLOI TARN'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CAP_EMPLOI);
  });

  it("should get PCCONSIJ as typologie when name contains chambre d'agriculture", (): void => {
    const source: DataSource = {
      name: "Chambre d'Agriculture de Loir-et-Cher"
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CCONS);
  });

  it("should get CCONS as typologie when name contains chambre départementale d'agriculture", (): void => {
    const source: DataSource = {
      name: "CHAMBRE DEPARTEMENTALE D'AGRICULTURE"
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CCONS);
  });

  it('should get CCONS as typologie when name contains chambre commerce industrie', (): void => {
    const source: DataSource = {
      name: 'CHAMBRE COMMERCE INDUSTRIE AVEYRON'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CCONS);
  });

  it('should get CCONS as typologie when name contains cci', (): void => {
    const source: DataSource = {
      name: "Cci Nice Côte D'Azur"
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CCONS);
  });

  it('should get CCONS as typologie when name contains chambre metiers artisanat', (): void => {
    const source: DataSource = {
      name: 'CHAMBRE METIERS ARTISANAT DE MOSELLE'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.CCONS);
  });

  it('should get MDS as typologie when name contains maison du département', (): void => {
    const source: DataSource = {
      name: 'Maison du Département de Saint Sauveur sur Tinée'
    };

    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const [typologie]: Typologies = processTypologies(source, matching);

    expect(typologie).toBe(Typologie.MDS);
  });
});
