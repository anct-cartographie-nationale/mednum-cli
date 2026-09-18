import type { Adresse, Typologies } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { describe, it, expect } from 'vitest';
import type { AccesLibreErp } from '../../../../../libraries/acces-libre';
import type { DataSource, LieuxMediationNumeriqueMatching } from '../../matching';
import { accesLibreIndex, processFicheAccesLibre } from './fiche-acces-libre.field';

const MATCHING: LieuxMediationNumeriqueMatching = { nom: { colonne: 'nom' } } as LieuxMediationNumeriqueMatching;
const SOURCE: DataSource = { nom: 'Un lieu' };

const FICHE_MAIRIE = 'https://acceslibre.beta.gouv.fr/app/49-allonnes/a/mairie/erp/mairie/';

const erp = (partiel: Partial<AccesLibreErp>): AccesLibreErp => ({
  nom: 'Mairie',
  activite: 'Mairie',
  codeInsee: '49003',
  numero: '31',
  voie: 'Rue Jean Gallart',
  codePostal: '49650',
  ficheUrl: FICHE_MAIRIE,
  ...partiel
});

const lieu = (voie: string, codeInsee = '49003'): Adresse =>
  ({ voie, code_postal: '49650', code_insee: codeInsee, commune: 'Allonnes' }) as Adresse;

const typologies = (...valeurs: string[]): Typologies => valeurs as unknown as Typologies;

const MUNI: Typologies = typologies('MUNI');

const rattacher = (
  adresse: Adresse,
  erps: AccesLibreErp[],
  nom: string,
  typologiesDuLieu: Typologies | undefined
): string | undefined => processFicheAccesLibre(SOURCE, MATCHING, accesLibreIndex(erps), adresse, nom, typologiesDuLieu);

const fiche = (adresse: Adresse, erps: AccesLibreErp[]): string | undefined =>
  rattacher(adresse, erps, 'Mairie d’Allonnes', MUNI);

describe('identité de l’adresse', (): void => {
  it('rattache quand la commune, le numéro et la voie sont identiques', (): void => {
    expect(fiche(lieu('31 Rue Jean Gallart'), [erp({})])).toBe(FICHE_MAIRIE);
  });

  it('ignore la casse, les accents et la ponctuation de la voie', (): void => {
    expect(fiche(lieu('31 rue Jean-Gallart'), [erp({ voie: 'RUE JEAN GALLART' })])).toBe(FICHE_MAIRIE);
  });

  it('rattache un arrondissement à la fiche portée par sa commune', (): void => {
    expect(fiche(lieu('31 Rue Jean Gallart', '75118'), [erp({ codeInsee: '75056' })])).toBe(FICHE_MAIRIE);
  });

  it.each([
    ['le numéro diffère d’une unité', '33 Rue Jean Gallart'],
    ['le numéro n’est qu’un préfixe', '3 Rue Jean Gallart'],
    ['le numéro porte un bis absent de la fiche', '31 bis Rue Jean Gallart'],
    ['la voie diffère', '31 Rue des Lilas']
  ])('ne rattache rien quand %s', (_, voie): void => {
    expect(fiche(lieu(voie), [erp({})])).toBeUndefined();
  });

  it('ne rattache rien quand la commune diffère, à voie et numéro identiques', (): void => {
    expect(fiche(lieu('31 Rue Jean Gallart', '49004'), [erp({})])).toBeUndefined();
  });

  it.each([
    ['le lieu n’a pas de numéro', 'Rue Jean Gallart', '31'],
    ['la fiche n’a pas de numéro', '31 Rue Jean Gallart', ''],
    ['aucun des deux n’a de numéro', 'Rue Jean Gallart', '']
  ])('ne rattache rien quand %s', (_, voie, numero): void => {
    expect(fiche(lieu(voie), [erp({ numero })])).toBeUndefined();
  });

  it('écarte une fiche sans code INSEE, qu’aucune commune ne situe', (): void => {
    expect(fiche(lieu('31 Rue Jean Gallart'), [erp({ codeInsee: '' })])).toBeUndefined();
  });

  it('ne rattache rien à un lieu sans code INSEE', (): void => {
    const sansCodeInsee = { voie: '31 Rue Jean Gallart', code_postal: '49650', commune: 'Allonnes' } as Adresse;

    expect(fiche(sansCodeInsee, [erp({})])).toBeUndefined();
  });
});

describe('attribution de la fiche au lieu', (): void => {
  const ADRESSE = lieu('31 Rue Jean Gallart');

  it('attribue par l’activité propre à la typologie du lieu', (): void => {
    const mediatheque = erp({ nom: 'Sans rapport', activite: 'Bibliothèque médiathèque' });

    expect(rattacher(ADRESSE, [mediatheque], 'Un nom sans rapport', typologies('BIB'))).toBe(FICHE_MAIRIE);
  });

  it('attribue par le nom, même sans typologie', (): void => {
    const canope = erp({ nom: 'Atelier Canopé 82 - Montauban', activite: 'Bibliothèque médiathèque' });

    expect(rattacher(ADRESSE, [canope], 'Atelier Canopé 82', undefined)).toBe(FICHE_MAIRIE);
  });

  it('attribue par l’hébergeur quand la typologie est connue', (): void => {
    expect(rattacher(ADRESSE, [erp({ nom: 'Mairie - Cébazan' })], 'France services de Cébazan', typologies('RFS'))).toBe(
      FICHE_MAIRIE
    );
  });

  it('n’attribue pas par l’hébergeur à un lieu sans typologie', (): void => {
    expect(rattacher(ADRESSE, [erp({ nom: 'Mairie - Cébazan' })], 'Un nom sans rapport', undefined)).toBeUndefined();
  });

  it.each([
    ['Dentiste, chirurgien dentiste'],
    ['Coiffure'],
    ['Photographie'],
    ['Boulangerie Pâtisserie'],
    ['Une activité qu’Accès Libre ajouterait demain']
  ])('écarte une fiche d’activité « %s », qu’aucune typologie n’attend', (activite): void => {
    expect(fiche(ADRESSE, [erp({ nom: 'Chez Paul', activite })])).toBeUndefined();
  });

  it('retient la seule fiche attribuable quand plusieurs partagent l’adresse', (): void => {
    const candidats = [erp({ nom: 'Chez Paul', activite: 'Coiffure' }), erp({ nom: 'Mairie d’Allonnes' })];

    expect(fiche(ADRESSE, candidats)).toBe(FICHE_MAIRIE);
  });
});

describe('précédence de la fiche portée par la source', (): void => {
  const AVEC_COLONNE: LieuxMediationNumeriqueMatching = {
    nom: { colonne: 'nom' },
    fiche_acces_libre: { colonne: 'accessibilite' }
  } as LieuxMediationNumeriqueMatching;

  const DU_PRODUCTEUR = 'https://acceslibre.beta.gouv.fr/app/49-allonnes/a/mairie/erp/celle-du-producteur/';
  const ADRESSE = lieu('31 Rue Jean Gallart');
  const DE_L_EXPORT = [erp({ nom: 'Mairie d’Allonnes' })];

  const avecSource = (accessibilite: string): string | undefined =>
    processFicheAccesLibre(
      { nom: 'Mairie d’Allonnes', accessibilite },
      AVEC_COLONNE,
      accesLibreIndex(DE_L_EXPORT),
      ADRESSE,
      'Mairie d’Allonnes',
      typologies('MUNI')
    );

  it('retient la fiche de la source plutôt que celle de l’export', (): void => {
    expect(avecSource(DU_PRODUCTEUR)).toBe(DU_PRODUCTEUR);
  });

  it('retombe sur l’export quand la source ne porte rien', (): void => {
    expect(avecSource('')).toBe(FICHE_MAIRIE);
  });

  it('retombe sur l’export quand la source ne porte que le script du widget', (): void => {
    expect(avecSource('https://acceslibre.beta.gouv.fr/static/js/widget.js')).toBe(FICHE_MAIRIE);
  });

  it.each([['-'], ['https://www.'], ['néant']])(
    'retombe sur l’export quand la source porte la valeur illisible « %s »',
    (illisible): void => {
      expect(avecSource(illisible)).toBe(FICHE_MAIRIE);
    }
  );

  it('ne rend aucune fiche quand la source est illisible et que l’export n’a rien', (): void => {
    expect(
      processFicheAccesLibre(
        { nom: 'Mairie d’Allonnes', accessibilite: '-' },
        AVEC_COLONNE,
        accesLibreIndex([]),
        ADRESSE,
        'Mairie d’Allonnes',
        typologies('MUNI')
      )
    ).toBeUndefined();
  });
});
