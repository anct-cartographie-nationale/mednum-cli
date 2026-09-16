import { describe, expect, it } from 'vitest';
import { CLEAN_VOIE, CLEAN_VOIE_FOR_SEARCH } from './clean-voie';
import { toCleanField } from './clean-operations';

const pourLaRecherche = (voie: string): string => CLEAN_VOIE_FOR_SEARCH.reduce(toCleanField, voie);
const pourLaPublication = (voie: string): string => CLEAN_VOIE.reduce(toCleanField, voie);

describe('CLEAN_VOIE_FOR_SEARCH', (): void => {
  it.each([
    ['211-213 boulevard Vincent Auriol', '211 boulevard Vincent Auriol'],
    ['211 – 213 boulevard Vincent Auriol', '211 boulevard Vincent Auriol'],
    ['1 rue de la Garenne (Rdc - porte 3)', '1 rue de la Garenne'],
    ['206 quais de Jemmapes', '206 quai de Jemmapes'],
    ['12 Allées des Tilleuls', '12 Allée des Tilleuls']
  ])('rend « %s » interrogeable en « %s »', (voie, attendu) => {
    expect(pourLaRecherche(voie)).toBe(attendu);
  });

  it.each([['12 rue des Lilas'], ['2ter rue au Maire'], ['Place Georges Pompidou']])('laisse « %s » intacte', (voie) => {
    expect(pourLaRecherche(voie)).toBe(voie);
  });

  it('ne singularise pas un nom de voie qui finit par les mêmes lettres', (): void => {
    expect(pourLaRecherche('rue des Ruesnes')).toBe('rue des Ruesnes');
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
