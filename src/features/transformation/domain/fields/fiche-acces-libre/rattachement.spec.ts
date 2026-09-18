import type { Adresse } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { describe, it, expect } from 'vitest';
import type { AccesLibreErp } from '../../../../../libraries/acces-libre';
import type { DataSource, LieuxMediationNumeriqueMatching } from '../../matching';
import { accesLibreIndex, processFicheAccesLibre } from './fiche-acces-libre.field';

const MATCHING: LieuxMediationNumeriqueMatching = {
  nom: { colonne: 'nom' }
} as LieuxMediationNumeriqueMatching;

const SOURCE: DataSource = { nom: 'Un lieu' };

const erp = (partiel: Partial<AccesLibreErp>): AccesLibreErp => ({
  nom: 'Mairie',
  activite: 'Mairie',
  codeInsee: '49003',
  numero: '31',
  voie: 'Rue Jean Gallart',
  codePostal: '49650',
  ficheUrl: 'https://acceslibre.beta.gouv.fr/app/49-allonnes/a/mairie/erp/mairie/',
  ...partiel
});

const lieu = (voie: string, codeInsee = '49003'): Adresse =>
  ({ voie, code_postal: '49650', code_insee: codeInsee, commune: 'Allonnes' }) as Adresse;

const fiche = (adresse: Adresse, erps: AccesLibreErp[]): string | undefined =>
  processFicheAccesLibre(SOURCE, MATCHING, accesLibreIndex(erps), adresse);

describe('rattachement d’une fiche Accès Libre', (): void => {
  it('rattache quand la commune, le numéro et la voie sont identiques', (): void => {
    expect(fiche(lieu('31 Rue Jean Gallart'), [erp({})])).toBe(
      'https://acceslibre.beta.gouv.fr/app/49-allonnes/a/mairie/erp/mairie/'
    );
  });

  it('ignore la casse, les accents et la ponctuation de la voie', (): void => {
    expect(fiche(lieu('31 rue Jean-Gallart'), [erp({ voie: 'RUE JEAN GALLART' })])).toBeDefined();
  });

  it.each([
    ['le numéro diffère d’une unité', '33 Rue Jean Gallart'],
    ['le numéro est absent du lieu', 'Rue Jean Gallart'],
    ['la voie diffère', '31 Rue des Lilas']
  ])('ne rattache rien quand %s', (_, voie): void => {
    expect(fiche(lieu(voie), [erp({})])).toBeUndefined();
  });

  it('ne rattache rien quand le numéro n’est qu’un préfixe de celui de la fiche', (): void => {
    expect(fiche(lieu('3 Rue Jean Gallart'), [erp({ numero: '31' })])).toBeUndefined();
  });

  it('distingue 31 de 31 bis', (): void => {
    expect(fiche(lieu('31 bis Rue Jean Gallart'), [erp({ numero: '31' })])).toBeUndefined();
  });

  it('ne rattache rien quand la commune diffère, à voie et numéro identiques', (): void => {
    expect(fiche(lieu('31 Rue Jean Gallart', '49004'), [erp({})])).toBeUndefined();
  });

  it('rattache un arrondissement à la fiche portée par sa commune', (): void => {
    expect(fiche(lieu('31 Rue Jean Gallart', '75118'), [erp({ codeInsee: '75056' })])).toBeDefined();
  });

  it('ne rattache rien quand plusieurs fiches partagent l’adresse', (): void => {
    expect(
      fiche(lieu('31 Rue Jean Gallart'), [
        erp({ nom: 'Mairie' }),
        erp({ nom: 'Médiathèque', activite: 'Bibliothèque médiathèque' })
      ])
    ).toBeUndefined();
  });

  it.each([
    ['Dentiste, chirurgien dentiste'],
    ['Coiffure'],
    ['Photographie'],
    ['Boulangerie Pâtisserie'],
    ['Une activité qu’Accès Libre ajouterait demain']
  ])('écarte une fiche dont l’activité « %s » n’accueille pas de médiation numérique', (activite): void => {
    expect(fiche(lieu('31 Rue Jean Gallart'), [erp({ activite })])).toBeUndefined();
  });

  it('écarte une fiche sans code INSEE, qu’aucune commune ne situe', (): void => {
    expect(fiche(lieu('31 Rue Jean Gallart'), [erp({ codeInsee: '' })])).toBeUndefined();
  });

  it('ne rattache rien à un lieu sans code INSEE', (): void => {
    expect(
      processFicheAccesLibre(SOURCE, MATCHING, accesLibreIndex([erp({})]), {
        voie: '31 Rue Jean Gallart',
        code_postal: '49650',
        commune: 'Allonnes'
      } as Adresse)
    ).toBeUndefined();
  });

  it('retient la seule fiche accueillante quand une fiche écartée partage l’adresse', (): void => {
    expect(fiche(lieu('31 Rue Jean Gallart'), [erp({}), erp({ nom: 'Chez Paul', activite: 'Coiffure' })])).toBeDefined();
  });
});

describe('rattachement sans numéro de voirie', (): void => {
  it('ne rattache pas un lieu sans numéro à une fiche sans numéro de la même voie', (): void => {
    expect(fiche(lieu('Rue Jean Gallart'), [erp({ numero: '' })])).toBeUndefined();
  });

  it('ne rattache pas un lieu sans numéro à une fiche qui en porte un', (): void => {
    expect(fiche(lieu('Rue Jean Gallart'), [erp({ numero: '31' })])).toBeUndefined();
  });

  it('ne rattache pas un lieu numéroté à une fiche sans numéro', (): void => {
    expect(fiche(lieu('31 Rue Jean Gallart'), [erp({ numero: '' })])).toBeUndefined();
  });

  it('ne rattache rien quand la voie est vide des deux côtés', (): void => {
    expect(fiche(lieu(''), [erp({ voie: '', numero: '' })])).toBeUndefined();
  });
});
