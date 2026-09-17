import { describe, it, expect } from 'vitest';
import { appliquerRegles, nettoyerCommune } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { REGLES_COMMUNE_LOCALES, communeField } from './clean-commune';

describe('clean commune', (): void => {
  it('should replace st with saint when starting with st and use space', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'St Jorioz')));

    expect(commune).toBe('Saint-Jorioz');
  });

  it('should replace st with saint when starting with st and use dash', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'St-Jorioz')));

    expect(commune).toBe('Saint-Jorioz');
  });

  it('should replace st with saint when not starting with st and use space', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'Bournoncle St Pierre')));

    expect(commune).toBe('Bournoncle-Saint-Pierre');
  });

  it('should replace st with saint when not starting with st and use dash', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'Bournoncle-St-Pierre')));

    expect(commune).toBe('Bournoncle-Saint-Pierre');
  });

  it('should replace ste with sainte when starting with ste and use space', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'Ste Croix Volvestre')));

    expect(commune).toBe('Sainte-Croix-Volvestre');
  });

  it('should replace ste with sainte when not starting with ste and use dash', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'La pierre-Ste-Marie')));

    expect(commune).toBe('La-pierre-Sainte-Marie');
  });

  it('should not have space after quote', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', "L' Arbresle")));

    expect(commune).toBe("L'Arbresle");
  });

  it('should remove cedex in commune name', (): void => {
    const commune: string = appliquerRegles(
      REGLES_COMMUNE_LOCALES,
      nettoyerCommune(communeField('', 'Aix-en-Provence CEDEX 1'))
    );

    expect(commune).toBe('Aix-en-Provence');
  });

  it('should remove district 1er', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'Lyon 1er')));

    expect(commune).toBe('Lyon');
  });

  it('should remove district 2e', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'Lyon 2e')));

    expect(commune).toBe('Lyon');
  });

  it('should remove numeric chars', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'Amplepuis 69550')));

    expect(commune).toBe('Amplepuis');
  });

  it('should replace curved apostrophes', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'L’ESCARÈNE')));

    expect(commune).toBe("L'ESCARÈNE");
  });

  it('should add an article for Pont-de-Claix', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'Pont-de-Claix')));

    expect(commune).toBe('Le-Pont-de-Claix');
  });

  it('should not add an article for Le Pont-de-Claix', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'Le Pont-de-Claix')));

    expect(commune).toBe('Le-Pont-de-Claix');
  });

  it('should add an article for Nouvion-en-Thiérache', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'Nouvion-en-Thiérache')));

    expect(commune).toBe('Le-Nouvion-en-Thiérache');
  });

  it('should not add an article for Le Nouvion-en-Thiérache', (): void => {
    const commune: string = appliquerRegles(
      REGLES_COMMUNE_LOCALES,
      nettoyerCommune(communeField('', 'Le Nouvion-en-Thiérache'))
    );

    expect(commune).toBe('Le-Nouvion-en-Thiérache');
  });

  it('should add an article for Fay-Saint-Quentin', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'Fay-Saint-Quentin')));

    expect(commune).toBe('Le-Fay-Saint-Quentin');
  });

  it('should not add an article for Le Fay-Saint-Quentin', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'Le Fay-Saint-Quentin')));

    expect(commune).toBe('Le-Fay-Saint-Quentin');
  });

  it('should add an article for Prêcheur', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'Prêcheur')));

    expect(commune).toBe('Le-Prêcheur');
  });

  it('should not add an article for Le Prếcheur', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'Le Prêcheur')));

    expect(commune).toBe('Le-Prêcheur');
  });

  it('should delete the letter s for Grandchamps-des-Fontaines', (): void => {
    const commune: string = appliquerRegles(
      REGLES_COMMUNE_LOCALES,
      nettoyerCommune(communeField('', 'Grandchamps-des-Fontaines'))
    );

    expect(commune).toBe('Grandchamp-des-Fontaines');
  });

  it('should fix the typo in Bordères-et-Lamensen', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'Bordères-et-Lamensens')));

    expect(commune).toBe('Bordères-et-Lamensans');
  });

  it('should fix the typo in Pierreffitte-Nestalas', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'Pierreffitte-Nestalas')));

    expect(commune).toBe('Pierrefitte-Nestalas');
  });

  it('should remove cedex without number', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'Douai-cedex')));

    expect(commune).toBe('Douai');
  });

  it('should remove cédex', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'SAINT-NICOLAS-cédex')));

    expect(commune).toBe('SAINT-NICOLAS');
  });

  it('should fix the typo in Ayre-sur-la-Lys', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'Ayre-sur-la-Lys')));

    expect(commune).toBe('Aire-sur-la-Lys');
  });

  it('should fix the typo in Saugnacq-et-muret', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'Saugnacq-et-muret')));

    expect(commune).toBe('Saugnac-et-muret');
  });

  it('should fix the typo in Saint-Philbert-de-Grandlieu', (): void => {
    const commune: string = appliquerRegles(
      REGLES_COMMUNE_LOCALES,
      nettoyerCommune(communeField('', 'Saint-Philbert-de-Grandlieu'))
    );

    expect(commune).toBe('Saint-Philbert-de-Grand-Lieu');
  });

  it('should fix the apostrophe in Saint-Donat-sur-lHerbasse', (): void => {
    const commune: string = appliquerRegles(
      REGLES_COMMUNE_LOCALES,
      nettoyerCommune(communeField('', 'Saint-Donat-sur-lHerbasse'))
    );

    expect(commune).toBe("Saint-Donat-sur-l'Herbasse");
  });

  it('should add the letter l in Les-Molettes', (): void => {
    const commune: string = appliquerRegles(REGLES_COMMUNE_LOCALES, nettoyerCommune(communeField('', 'Les-Molettes')));

    expect(commune).toBe('Les-Mollettes');
  });
});
