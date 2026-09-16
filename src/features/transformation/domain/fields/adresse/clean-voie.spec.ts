import { describe, expect, it } from 'vitest';
import { CLEAN_VOIE, CLEAN_VOIE_FOR_SEARCH } from './clean-voie';
import { toCleanField } from './clean-operations';

const pourLaRecherche = (voie: string): string => CLEAN_VOIE_FOR_SEARCH.reduce(toCleanField, voie);
const pourLaPublication = (voie: string): string => CLEAN_VOIE.reduce(toCleanField, voie);

describe('CLEAN_VOIE_FOR_SEARCH', (): void => {
  it.each([
    ['211-213 boulevard Vincent Auriol', '211 boulevard Vincent Auriol'],
    ['211 – 213 boulevard Vincent Auriol', '211 boulevard Vincent Auriol'],
    ['1 rue de la Garenne (Rdc - porte 3)', '1 rue de la Garenne']
  ])('rend « %s » interrogeable en « %s »', (voie, attendu) => {
    expect(pourLaRecherche(voie)).toBe(attendu);
  });

  it.each([['12 rue des Lilas'], ['2ter rue au Maire'], ['Place Georges Pompidou']])('laisse « %s » intacte', (voie) => {
    expect(pourLaRecherche(voie)).toBe(voie);
  });

  it.each([
    ['Allées d’Etigny', 'Allées d’Etigny'],
    ['39 Allees des Ecoles', '39 Allees des Ecoles'],
    ['206 quais de Jemmapes', '206 quais de Jemmapes']
  ])('laisse « %s » au pluriel, que le référentiel connaît ainsi', (voie, attendu) => {
    expect(pourLaRecherche(voie)).toBe(attendu);
  });

  it.each([
    ['Mairie de Blois BP 226', 'Mairie de Blois'],
    ['9 rue Cure Bourse batiment W porte C', '9 rue Cure Bourse'],
    ['IMMEUBLE ANTHYLLIS ZAC BASSO CAMBO 8 RUE PAUL MESPLE', '8 RUE PAUL MESPLE'],
    ['46 b Avenue Joliot Curie', '46 Avenue Joliot Curie']
  ])('rend « %s » interrogeable en « %s »', (voie, attendu) => {
    expect(pourLaRecherche(voie)).toBe(attendu);
  });

  it.each([
    ['27 Rue Victor Hugo (Saint-Pol-sur-Mer)'],
    ['888 Avenue de Dunkerque (Lomme)'],
    ['Grande Rue de la Guillotière'],
    ['Grand-Place du Marche'],
    ['Impasse du Moulin de l’Escalier'],
    ['372 R des Tovets'],
    ['2 rue Porte de Paris']
  ])('laisse « %s » intacte, le mot y appartenant au nom', (voie) => {
    expect(pourLaRecherche(voie)).toBe(voie);
  });
});

describe('CLEAN_VOIE', (): void => {
  it.each([['211-213 boulevard Vincent Auriol'], ['1 rue de la Garenne (Rdc - porte 3)']])(
    'conserve « %s » à la publication, ces nettoyages ne servant qu’à interroger',
    (voie) => {
      expect(pourLaPublication(voie)).toBe(voie);
    }
  );
});
