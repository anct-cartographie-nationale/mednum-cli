import { Typologie, Typologies } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching } from '../../input';
import { processTypologies } from './typologies.field';

describe('typologies field', (): void => {
  it('should get none typologies for empty value', (): void => {
    const typologies: Typologies = processTypologies({}, {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching);

    expect(typologies).toStrictEqual([]);
  });

  it('should get BIB typologie for Médiathèque', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' },
      typologie: [{ colonnes: ['checkboxListeTypelieu'], termes: ['5'], cible: Typologie.BIB }]
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ checkboxListeTypelieu: '5' }, matching);

    expect(typologies).toStrictEqual([Typologie.BIB]);
  });

  it('should process algo research in name even if there is matching', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' },
      typologie: [{ colonnes: ['checkboxListeTypelieu'], termes: ['5'], cible: Typologie.BIB }]
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: 'médiathèque' }, matching);

    expect(typologies).toStrictEqual([Typologie.BIB]);
  });

  it.each([['bibliothéque'], ['médiathéque'], ['Bibiothèque'], ['Mediathquete'], ['Médiathqèue'], ['Médiatthèque']])(
    'should get BIB when name contains %s',
    (nom: string): void => {
      const matching: LieuxMediationNumeriqueMatching = {
        nom: { colonne: 'name' }
      } as LieuxMediationNumeriqueMatching;

      const typologies: Typologies = processTypologies({ name: nom }, matching);

      expect(typologies).toStrictEqual([Typologie.BIB]);
    }
  );

  it.each([['CAF'], ['Caf du Nord'], ['Caf@Arras'], ['Relais CAF'], ["Caisse d'Allocations Familiales"]])(
    'should get CAF when name contains %s',
    (nom: string): void => {
      const matching: LieuxMediationNumeriqueMatching = {
        nom: { colonne: 'name' }
      } as LieuxMediationNumeriqueMatching;

      const typologies: Typologies = processTypologies({ name: nom }, matching);

      expect(typologies).toStrictEqual([Typologie.CAF]);
    }
  );

  it('should get CADA when name starts with CADA', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: 'CADA / HUDA' }, matching);

    expect(typologies).toStrictEqual([Typologie.CADA]);
  });

  it.each([
    ['CCAS - Rochefort-sur-Loire'],
    ['C.C.A.S. ORCHIES'],
    ["Centre Communal d'Action Sociale"],
    ["Centre Communale d'Action Sociale de la ville de Chelles"],
    ['CTE COM ACTION SOCIALE'],
    ["CTRE COMMUNAL ACTION SOCIALE D'HOUPLINES"],
    ['CENTRE COMMUNAL ACTION SOCIALE MILLAS']
  ])('should get CCAS when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.CCAS]);
  });

  it.each([["CONSEIL DEP DE L'ACCES AU DROIT"], ['COSEIL DEPATEMENTAL DES YVELINES SERVICE MNA'], ['CDAD Ardennes']])(
    'should get CD when name contains %s',
    (nom: string): void => {
      const matching: LieuxMediationNumeriqueMatching = {
        nom: { colonne: 'name' }
      } as LieuxMediationNumeriqueMatching;

      const typologies: Typologies = processTypologies({ name: nom }, matching);

      expect(typologies).toStrictEqual([Typologie.CD]);
    }
  );

  it.each([['CIAS le phare', "Centre intercommunal d'actions sociales du Pays de Craon"]])(
    'should get CIAS when name contains %s',
    (nom: string): void => {
      const matching: LieuxMediationNumeriqueMatching = {
        nom: { colonne: 'name' }
      } as LieuxMediationNumeriqueMatching;

      const typologies: Typologies = processTypologies({ name: nom }, matching);

      expect(typologies).toStrictEqual([Typologie.CIAS]);
    }
  );

  it.each([['CIDFF'], ['CIDFF62']])('should get CIDFF when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.CIDFF]);
  });

  it.each([
    ["Cité de l'emploi de Limoges"],
    ['Cité de la Jeunesse & des Métiers (CJM)'],
    ['Cite des Metiers'],
    ['Cité des Métiers - Centre associé']
  ])('should get CITMET when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.CITMET]);
  });

  it.each([['Centre Médico Psychologique de Loudéac'], ['CMP Paul Guiraud']])(
    'should get CMP when name contains %s',
    (nom: string): void => {
      const matching: LieuxMediationNumeriqueMatching = {
        nom: { colonne: 'name' }
      } as LieuxMediationNumeriqueMatching;

      const typologies: Typologies = processTypologies({ name: nom }, matching);

      expect(typologies).toStrictEqual([Typologie.CMP]);
    }
  );

  it.each([
    ['CMS Agen Louis Vivent'],
    ['CMS'],
    ['Centre Médico Social'],
    ['CENTRE MEDICO SOCIAL BRIONNE'],
    ['Centre médico-social'],
    ['CMS- Centre Medicaux Sociaux'],
    ['PMS Cran-Gevrier'],
    ['POLE MEDICO-SOCIAL  DE CHAMONIX'],
    ['Pôle Médico-Social Balmettes'],
    ["Relais médico-social d'Alby-sur-Chéran"]
  ])('should get CMP when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.CMS]);
  });

  it.each([
    ["Accueil CAISSE PRIMAIRE D'ASSURANCE MALADIE DE LA LOIRE"],
    ['CAISSE PRIMAIRE ASSURANCE MALADIE'],
    ['CAISSE PRIMAIRE D ASSURANCE MALADIE - CPAM - DES LANDES'],
    ['CPAM'],
    ['CPAM - Agence de Cholet'],
    ["Point d'accueil CPAM Guémené-Penfao"]
  ])('should get CPAM when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.CPAM]);
  });

  it.each([['CPH - lab Fraternel']])('should get CPH when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.CPH]);
  });

  it.each([
    ['CENTRE SOC FAMILIAL ST GABRIEL'],
    ['CENTRE SOCIAL DE BAGATELLE'],
    ['CTRE SOCIAL ESPACE ST GILLES'],
    ['CS Capelette'],
    ['Espace Social Commun Blosne']
  ])('should get CS when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.CS]);
  });

  it.each([['CSAPA']])('should get CSAPA when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.CSAPA]);
  });

  it.each([
    ["amej centre d'animation socioculturel"],
    ['Artémis, centre socio-culturel'],
    ['Centre Animation Sociale et Culturelle'],
    ['Centre Culturel'],
    ['Centre socio culturel'],
    ['Centre Socioculturel'],
    ['Centre Sociocuturel Manu 4'],
    ['Centres Culturels Municipaux de Limoges'],
    ['CSC Europe - COLOMBES'],
    ['ESPACE SOCIAL CULTUREL CROIX DES OISEAUX'],
    ['Espace social et culturel AFEL'],
    ['FOYER CULTUREL ET SOCIAL JACQUES PELLETIER']
  ])('should get CSC when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toContain(Typologie.CSC);
  });

  it.each([
    ['Département'],
    ['Departement 64'],
    ['DEPARTEMENT DE COTE D OR'],
    ["DPT de la Vienne - Direction de l'Action Sociale"]
  ])('should get DEPT when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.DEPT]);
  });

  it('should get E2C when name contains Ecole deuxième chance', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: 'Ecole deuxième chance Grand Lille' }, matching);

    expect(typologies).toStrictEqual([Typologie.E2C]);
  });

  it('should get EI when name contains EI', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: 'EI Girard Hervé - mon assistant numérique' }, matching);

    expect(typologies).toStrictEqual([Typologie.EI]);
  });

  it('should get ENM when name contains Bus', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: "Bus It'In" }, matching);

    expect(typologies).toStrictEqual([Typologie.ENM]);
  });

  it.each([['EPI'], ['Espace Public Internet Gagarine'], ['Espace Public Informatique Monmousseau']])(
    'should get EPI when name contains %s',
    (nom: string): void => {
      const matching: LieuxMediationNumeriqueMatching = {
        nom: { colonne: 'name' }
      } as LieuxMediationNumeriqueMatching;

      const typologies: Typologies = processTypologies({ name: nom }, matching);

      expect(typologies).toStrictEqual([Typologie.EPI]);
    }
  );

  it('should get EPIDE when name contains EPIDE', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: 'EPIDE' }, matching);

    expect(typologies).toStrictEqual([Typologie.EPIDE]);
  });

  it.each([
    ['EPN'],
    ['Arobase Espace Public Multimédia'],
    ['Cyber base'],
    ['Cyber-base'],
    ['Cyberbase'],
    ['Cyber Centre'],
    ['Espace Multimédia'],
    ['Espace Numérique'],
    ['ESPACE NUMERIQUE DE LA PASSERELLE'],
    ['Espace Publique Numérique'],
    ['Espaces Numériques Ville de Fort de France'],
    ['Etablissement public numérique']
  ])('should get EPN when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.EPN]);
  });

  it.each([['Epicerie Bar'], ['Epicerie sociale'], ['Epicerie solidaire']])(
    'should get ES when name contains %s',
    (nom: string): void => {
      const matching: LieuxMediationNumeriqueMatching = {
        nom: { colonne: 'name' }
      } as LieuxMediationNumeriqueMatching;

      const typologies: Typologies = processTypologies({ name: nom }, matching);

      expect(typologies).toStrictEqual([Typologie.ES]);
    }
  );

  it.each([['ESAT']])('should get ESAT when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.ESAT]);
  });

  it('should get ESS when name contains Economique Social et Solidaire', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies(
      { name: 'La Belle Créole Fédération du Lien Economique Social et Solidaire' },
      matching
    );

    expect(typologies).toStrictEqual([Typologie.ESS]);
  });

  it.each([['EVS'], ['Espace de Vie Sociale']])('should get EVS when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.EVS]);
  });

  it.each([['Fablab'], ['Fab Lab'], ["FAB'AT"]])('should get FABLAB when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.FABLAB]);
  });

  it.each([['Pôle emploi'], ['Pole Emploi Blaye']])('should get FT when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.FT]);
  });

  it.each([
    ["GROUPEMENT D'EMPLOYEURS SIAE 30 GE SIAE 30"],
    ["Groupement Local Employeurs d'Agents de Médiation"],
    ["Groupement pour l'Insertion & l'Evolution Professionnelles - GIEP NC"]
  ])('should get GEIQ when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.GEIQ]);
  });

  it.each([['la poste'], ['Agence Communale Postale'], ['Agence Postale'], ['Bureau de poste']])(
    'should get LA_POSTE when name contains %s',
    (nom: string): void => {
      const matching: LieuxMediationNumeriqueMatching = {
        nom: { colonne: 'name' }
      } as LieuxMediationNumeriqueMatching;

      const typologies: Typologies = processTypologies({ name: nom }, matching);

      expect(typologies).toStrictEqual([Typologie.LA_POSTE]);
    }
  );

  it.each([["Maison de l'emploi"], ["Maison de l'économie"]])('should get MDE when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.MDE]);
  });

  it.each([['Maison des Habitants Abbaye'], ['Maison des Habitant.es Anatole France']])(
    'should get MDH when name contains %s',
    (nom: string): void => {
      const matching: LieuxMediationNumeriqueMatching = {
        nom: { colonne: 'name' }
      } as LieuxMediationNumeriqueMatching;

      const typologies: Typologies = processTypologies({ name: nom }, matching);

      expect(typologies).toStrictEqual([Typologie.MDH]);
    }
  );

  it.each([['MDPH 32'], ['GIP MAISON DEP PERSONNES HANDICAPEES'], ['Maison Départementale des Personnes Handicapées']])(
    'should get MDPH when name contains %s',
    (nom: string): void => {
      const matching: LieuxMediationNumeriqueMatching = {
        nom: { colonne: 'name' }
      } as LieuxMediationNumeriqueMatching;

      const typologies: Typologies = processTypologies({ name: nom }, matching);

      expect(typologies).toStrictEqual([Typologie.MDPH]);
    }
  );

  it.each([
    ['MDS'],
    ['Antenne MSD de Lalbenque'],
    ['MDSI CHAULNES'],
    ['Centre Départemental de la Solidarité Ambroise Paré'],
    ['CENTRE DEPARTEMENTAL DE LA SOLIDARITE'],
    ['Maison de la Solidarité Départementale de Mauriac'],
    ['Maison départementale de proximité de Cadours'],
    ['Maison Départementale de Solidarité de Blaye'],
    ['Maison Départementales des Solidarités de DECAZEVILLE'],
    ['Maison Des Solidarités Départementales']
  ])('should get MSD when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.MDS]);
  });

  it.each([
    ['MJC'],
    ['M.J.C'],
    ['MAISON DE JEUNES ET LA CULTURE pays de QUINTIN'],
    ["Maison des jeunes, de la culture et d'animation de la Vie Sociale de Saint-Lys"],
    ['MAISON JEUNES & CULTURE']
  ])('should get MJC when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.MJC]);
  });

  it.each([['Maison de quartier']])('should get MQ when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.MQ]);
  });

  it.each([
    ['Maison des Services'],
    ['Maison de Services'],
    ['La Maison des Services publics'],
    ['Maison de service au public - Guenrouët'],
    ['Maison de Services Au Public'],
    ['MSAP'],
    ['Relais de services au public']
  ])('should get MSAP when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.MSAP]);
  });

  it.each([
    ['Mairie de Saint Alban'],
    ['Maire'],
    ['Agglomération du Choletais'],
    ['Commune de Ventiseri'],
    ["CA D'EPINAL"],
    ['CARCASSONNE AGGLO'],
    ['Communauté Agglomération La Rochelle'],
    ["Communauté d'Agglomération Bergeracoise"],
    ['CONCARNEAU CORNOUAILLE AGGLOMERATION'],
    ["Municipalité d'Annay"]
  ])('should get MUNI when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.MUNI]);
  });

  it.each([["Point d'Accès au Droit"], ['Accès au Droit Nord Morbihan']])(
    'should get PAD when name contains %s',
    (nom: string): void => {
      const matching: LieuxMediationNumeriqueMatching = {
        nom: { colonne: 'name' }
      } as LieuxMediationNumeriqueMatching;

      const typologies: Typologies = processTypologies({ name: nom }, matching);

      expect(typologies).toStrictEqual([Typologie.PAD]);
    }
  );

  it.each([["Point d'information ISOLA", 'Point Info 14']])('should get PI when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.PI]);
  });

  it.each([['BIJ'], ['Bureau Information Jeunesse de Belfort'], ["Centre d'Information Jeunesse de Vesoul"], ['Espace jeune']])(
    'should get PIJ_BIJ when name contains %s',
    (nom: string): void => {
      const matching: LieuxMediationNumeriqueMatching = {
        nom: { colonne: 'name' }
      } as LieuxMediationNumeriqueMatching;

      const typologies: Typologies = processTypologies({ name: nom }, matching);

      expect(typologies).toStrictEqual([Typologie.PIJ_BIJ]);
    }
  );

  it('should get PIMMS when name contains PIMMS', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: 'PIMMS médiation Isère' }, matching);

    expect(typologies).toStrictEqual([Typologie.PIMMS]);
  });

  it('should get PLIE when name contains PLIE', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: 'PLIE de Colombes' }, matching);

    expect(typologies).toStrictEqual([Typologie.PLIE]);
  });

  it.each([['Préfecture'], ['Prefecture de la Vienne'], ["Sous-préfecture - Point d'accueil numérique"]])(
    'should get PREF when name contains %s',
    (nom: string): void => {
      const matching: LieuxMediationNumeriqueMatching = {
        nom: { colonne: 'name' }
      } as LieuxMediationNumeriqueMatching;

      const typologies: Typologies = processTypologies({ name: nom }, matching);

      expect(typologies).toStrictEqual([Typologie.PREF]);
    }
  );

  it('should get REG when name contains Région', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: 'Région Occitanie' }, matching);

    expect(typologies).toStrictEqual([Typologie.REG]);
  });

  it('should get RESSOURCERIE when name contains Ressourcerie', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: 'Ressourcerie' }, matching);

    expect(typologies).toStrictEqual([Typologie.RESSOURCERIE]);
  });

  it('should get UDAF when name contains UDAF', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: 'UDAF93' }, matching);

    expect(typologies).toStrictEqual([Typologie.UDAF]);
  });

  it.each([['CDAS de Combourg']])('should get CDAS when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.CDAS]);
  });

  it.each([
    ['Communauté de Commune de la Dombes'],
    ['Communauté de Communes Anjou Loir et Sarthe'],
    ["Communauté des Communes Rurales de l'Entre-2-Mers"]
  ])('should get CC when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.CC]);
  });

  it('should get CCONS when name contains CONSULAT', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: 'CONSULAT GENERAL DE FRANCE A LOS ANGELES' }, matching);

    expect(typologies).toStrictEqual([Typologie.CCONS]);
  });

  it.each([['Finances Publiques'], ['Centre des Finances Public de Cholet']])(
    'should get CFP when name contains %s',
    (nom: string): void => {
      const matching: LieuxMediationNumeriqueMatching = {
        nom: { colonne: 'name' }
      } as LieuxMediationNumeriqueMatching;

      const typologies: Typologies = processTypologies({ name: nom }, matching);

      expect(typologies).toStrictEqual([Typologie.CFP]);
    }
  );

  it('should get LA_POSTE when name contains LaPoste', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: 'laposte' }, matching);

    expect(typologies).toStrictEqual([Typologie.LA_POSTE]);
  });

  it('should get LA_POSTE when name contains poste', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: 'Poste Oyonnax' }, matching);

    expect(typologies).toStrictEqual([Typologie.LA_POSTE]);
  });

  it('should get ACI when name starts with ACI', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: 'ACI du Vallespir' }, matching);

    expect(typologies).toStrictEqual([Typologie.ACI]);
  });

  it("should get ACI when name contains Chantier d'Insertion", (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: "Chantier d'Insertion" }, matching);

    expect(typologies).toStrictEqual([Typologie.ACI]);
  });

  it.each([
    ['LIGUE DE L ENSEIGNEMENT'],
    ["LIGUE DE L'ENSEIGNEMENT"],
    ["LIGUE D'ENSEIGNEMENT"],
    ['Konexio'],
    ['Groupe SOS'],
    ['APF France handicap'],
    ['Familles Rurales'],
    ['ASSO DU PAYS DES SEPT RIVIERES'],
    ['Association Osez'],
    ['Blue Fox Coffee - café associatif'],
    ['Coallia'],
    ['FAMILLE RURALE'],
    ['LIGUE ENSEIGNEMENT TARN GARONNE']
  ])('should get ASSO when name contains %s', (nom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: nom }, matching);

    expect(typologies).toStrictEqual([Typologie.ASSO]);
  });

  it('should find multiple typologies from name', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: { colonne: 'name' }
    } as LieuxMediationNumeriqueMatching;

    const typologies: Typologies = processTypologies({ name: 'CPAM / CAF du Gers' }, matching);

    expect(typologies).toStrictEqual([Typologie.CAF, Typologie.CPAM]);
  });
});
