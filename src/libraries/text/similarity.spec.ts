import { describe, it, expect } from 'vitest';
import { similarityRatio, tokenSetSimilarityRatio } from './similarity';

describe('repli des accents et des ligatures', (): void => {
  it.each([
    ['Médiathèque', 'MEDIATHEQUE'],
    ['Forêt', 'FORET'],
    ['Éducation Permanente', 'EDUCATION PERMANENTE'],
    ['François', 'FRANCOIS'],
    ['Cœur', 'COEUR'],
    ['Lætitia', 'LAETITIA'],
    ['Amitié partage', 'AMITIE PARTAGE']
  ])('rend 100 entre « %s » et « %s »', (gauche, droite): void => {
    expect(tokenSetSimilarityRatio(gauche, droite)).toBe(100);
    expect(similarityRatio(gauche, droite)).toBe(100);
  });

  it('ne rapproche pas deux libellés réellement différents', (): void => {
    expect(tokenSetSimilarityRatio('Médiathèque', 'Boulangerie')).toBeLessThan(40);
  });

  it('reste trompé par un suffixe géographique commun, ce que le repli ne corrige pas', (): void => {
    expect(tokenSetSimilarityRatio('Préfecture de la Charente-Maritime', 'PACT DE LA CHARENTE MARITIME')).toBe(90);
    expect(tokenSetSimilarityRatio('MSAP Hauts du Val de Saône', 'SISA DES HAUTS DU VAL DE SAONE')).toBeGreaterThanOrEqual(80);
  });

  it('reste à 100 pour deux chaînes identiques', (): void => {
    expect(tokenSetSimilarityRatio('Centre Socio Educatif', 'Centre Socio Educatif')).toBe(100);
  });

  it('tolère une chaîne vide sans lever', (): void => {
    expect(tokenSetSimilarityRatio('', 'MEDIATHEQUE')).toBe(0);
  });
});
