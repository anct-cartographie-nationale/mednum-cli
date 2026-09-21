import { describe, it, expect } from 'vitest';
import type { EtablissementALAdresse } from '../../../../../libraries/annuaire-entreprises';
import { type AnnuaireIndex, denominationConcorde, etablissementDuLieu } from './determination';

const CLE = '49650|31|rue jean gallart';

const etablissement = (partiel: Partial<EtablissementALAdresse>): EtablissementALAdresse => ({
  siret: '40852636600039',
  denomination: 'ASSOCIATION LE CAMPUS ESPACES JEUNES',
  natureJuridique: '9220',
  adresse: '31 RUE JEAN GALLART 49650 ALLONNES',
  actif: true,
  ...partiel
});

const annuaire = (etablissements: EtablissementALAdresse[]): AnnuaireIndex => new Map([[CLE, etablissements]]);

describe('concordance de la dénomination', (): void => {
  it.each([
    ['Association Le Campus Espace Jeunes', 'ASSOCIATION LE CAMPUS ESPACES JEUNES'],
    ['Amitié partage', 'ASSOCIATION AMITIE PARTAGE'],
    ['Office Socio Educatif', 'OFFICE SOCIO EDUCATIF DE NALLIERS'],
    ['Médiathèque', 'MEDIATHEQUE']
  ])('reconnaît « %s » et « %s »', (nom, denomination): void => {
    expect(denominationConcorde(nom, 'Allonnes', denomination)).toBe(true);
  });

  it.each([
    ['Association Plaisir De Lire', 'ASSOCIATION ESPACE'],
    ['Médiathèque', 'BOULANGERIE MARTIN']
  ])('refuse « %s » et « %s »', (nom, denomination): void => {
    expect(denominationConcorde(nom, 'Allonnes', denomination)).toBe(false);
  });

  it('ne concorde pas sur le seul nom de la commune', (): void => {
    expect(denominationConcorde('Bibliothèque de Condé-en-Brie', 'Condé-en-Brie', 'COMMUNE DE CONDE EN BRIE')).toBe(false);
  });

  it('concorde encore quand la commune est retirée des deux côtés', (): void => {
    expect(denominationConcorde('Mairie de Condé-en-Brie', 'Condé-en-Brie', 'COMMUNE DE CONDE EN BRIE')).toBe(false);
    expect(denominationConcorde('Médiathèque de Condé-en-Brie', 'Condé-en-Brie', 'MEDIATHEQUE DE CONDE EN BRIE')).toBe(true);
  });

  it('refuse quand il ne reste rien après retrait de la commune', (): void => {
    expect(denominationConcorde('Allonnes', 'Allonnes', 'ALLONNES')).toBe(false);
  });
});

describe('établissement du lieu', (): void => {
  it('retient l’établissement dont la dénomination concorde', (): void => {
    const trouve = etablissementDuLieu(annuaire([etablissement({})]), CLE, 'Association Le Campus Espace Jeunes', 'Allonnes');

    expect(trouve?.siret).toBe('40852636600039');
  });

  it('écarte un établissement fermé', (): void => {
    expect(
      etablissementDuLieu(annuaire([etablissement({ actif: false })]), CLE, 'Association Le Campus Espace Jeunes', 'Allonnes')
    ).toBeUndefined();
  });

  it('écarte un établissement dont la dénomination ne concorde pas', (): void => {
    expect(
      etablissementDuLieu(annuaire([etablissement({ denomination: 'BOULANGERIE MARTIN' })]), CLE, 'Médiathèque', 'Allonnes')
    ).toBeUndefined();
  });

  it('ne rend rien pour une adresse absente de l’annuaire', (): void => {
    expect(
      etablissementDuLieu(annuaire([etablissement({})]), 'autre|1|rue inconnue', 'Peu importe', 'Allonnes')
    ).toBeUndefined();
  });

  it('préfère la dénomination la plus concordante', (): void => {
    const candidats = [
      etablissement({ siret: '11111111111111', denomination: 'ASSOCIATION DU PATRIMOINE ESPACES JEUNES' }),
      etablissement({ siret: '22222222222222', denomination: 'ASSOCIATION LE CAMPUS ESPACES JEUNES' })
    ];

    expect(etablissementDuLieu(annuaire(candidats), CLE, 'Association Le Campus Espace Jeunes', 'Allonnes')?.siret).toBe(
      '22222222222222'
    );
  });

  it('retient toujours le même établissement à concordance égale, quel que soit l’ordre', (): void => {
    const candidats = [
      etablissement({ siret: '22222222222222', denomination: 'ASSOCIATION LE CAMPUS' }),
      etablissement({ siret: '11111111111111', denomination: 'ASSOCIATION LE CAMPUS ESPACES JEUNES' })
    ];
    const nom = 'Association Le Campus Espace Jeunes';

    expect(etablissementDuLieu(annuaire(candidats), CLE, nom, 'Allonnes')?.siret).toBe(
      etablissementDuLieu(annuaire([...candidats].reverse()), CLE, nom, 'Allonnes')?.siret
    );
  });
});

describe('entités domiciliées chez leur hôte', (): void => {
  it.each([
    ['LA VILLE DE MULHOUSE', 'AMICALE DU PERSONNEL VILLE DE MULHOUSE', 'Mulhouse'],
    ['Mairie du 12e arrondissement', 'COMITE FETES 12E ARRONDISSEMENT PARIS', 'Paris'],
    ['Caf des Landes', 'CSE CAF DES LANDES', 'Mont-de-Marsan'],
    [
      'Mairie de Champigny sur Marne',
      'COMITE DE GESTION DES OEUVRES SOCIALES DE LA MAIRIE DE CHAMPIGNY',
      'Champigny-sur-Marne'
    ],
    ['Mairie du 8e arrondissement', 'CAISSE DES ECOLES DU 8E ARRONDISSEMENT', 'Paris'],
    ["Mairie d'Avroult", 'APE AVROULT', 'Avroult'],
    ['COLLEGE LES QUATRE SAISONS', 'ASSOCIATION SPORTIVE DU COLLEGE DES QUATRE SAISONS', 'Onet-le-Château'],
    ['CPAM', 'SOC MUTUALISTE DU PERSONNEL CPAM 17', 'La Rochelle'],
    ['UDAF', 'SCI UDAF LE MARTELET', 'Lyon'],
    ['CC TERRES DE CHALOSSE', 'OFFICE DE TOURISME TERRES DE CHALOSSE', 'Montfort-en-Chalosse']
  ])('refuse « %s » pour « %s »', (nom: string, denomination: string, commune: string): void => {
    expect(denominationConcorde(nom, commune, denomination)).toBe(false);
  });

  it('retient l’entité elle-même quand c’est elle que le lieu nomme', (): void => {
    expect(denominationConcorde("Amicale laïque d'Allonnes", 'Allonnes', 'AMICALE LAIQUE')).toBe(true);
  });

  it('retient l’office de tourisme quand le lieu est l’office de tourisme', (): void => {
    expect(
      denominationConcorde(
        'Office de tourisme Terres de Chalosse',
        'Montfort-en-Chalosse',
        'OFFICE DE TOURISME TERRES DE CHALOSSE'
      )
    ).toBe(true);
  });
});

describe('deux communes derrière un même code postal', (): void => {
  it('ne confond pas deux communes quand la clé les distingue', (): void => {
    const savignargues: AnnuaireIndex = new Map([
      [
        '30350|savignargues|1|place de la mairie',
        [etablissement({ siret: '21300068000016', denomination: 'COMMUNE DE SAVIGNARGUES' })]
      ],
      ['30350|cardet|1|place de la mairie', [etablissement({ siret: '21300063100017', denomination: 'COMMUNE DE CARDET' })]]
    ]);

    expect(
      etablissementDuLieu(savignargues, '30350|savignargues|1|place de la mairie', 'COMMUNE DE SAVIGNARGUES', 'Savignargues')
        ?.denomination
    ).toBe('COMMUNE DE SAVIGNARGUES');
  });
});
