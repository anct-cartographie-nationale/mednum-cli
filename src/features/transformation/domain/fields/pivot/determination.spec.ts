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
