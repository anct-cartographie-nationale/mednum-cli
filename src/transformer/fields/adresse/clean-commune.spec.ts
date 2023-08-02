import { CLEAN_COMMUNE, communeField } from './clean-commune';
import { toCleanField } from './clean-operations';

describe('clean commune', (): void => {
  it('should replace st with saint when starting with st and use space', (): void => {
    const commune: string = CLEAN_COMMUNE.reduce(toCleanField, communeField('', 'St Jorioz'));

    expect(commune).toBe('Saint-Jorioz');
  });

  it('should replace st with saint when starting with st and use dash', (): void => {
    const commune: string = CLEAN_COMMUNE.reduce(toCleanField, communeField('', 'St-Jorioz'));

    expect(commune).toBe('Saint-Jorioz');
  });

  it('should replace st with saint when not starting with st and use space', (): void => {
    const commune: string = CLEAN_COMMUNE.reduce(toCleanField, communeField('', 'Bournoncle St Pierre'));

    expect(commune).toBe('Bournoncle-Saint-Pierre');
  });

  it('should replace st with saint when not starting with st and use dash', (): void => {
    const commune: string = CLEAN_COMMUNE.reduce(toCleanField, communeField('', 'Bournoncle-St-Pierre'));

    expect(commune).toBe('Bournoncle-Saint-Pierre');
  });

  it('should replace ste with sainte when starting with ste and use space', (): void => {
    const commune: string = CLEAN_COMMUNE.reduce(toCleanField, communeField('', 'Ste Croix Volvestre'));

    expect(commune).toBe('Sainte-Croix-Volvestre');
  });

  it('should replace ste with sainte when not starting with ste and use dash', (): void => {
    const commune: string = CLEAN_COMMUNE.reduce(toCleanField, communeField('', 'La pierre-Ste-Marie'));

    expect(commune).toBe('La-pierre-Sainte-Marie');
  });

  it('should not have space after quote', (): void => {
    const commune: string = CLEAN_COMMUNE.reduce(toCleanField, communeField('', "L' Arbresle"));

    expect(commune).toBe("L'Arbresle");
  });

  it('should remove cedex in commune name', (): void => {
    const commune: string = CLEAN_COMMUNE.reduce(toCleanField, communeField('', 'Aix-en-Provence CEDEX 1'));

    expect(commune).toBe('Aix-en-Provence');
  });

  it('should remove district 1er', (): void => {
    const commune: string = CLEAN_COMMUNE.reduce(toCleanField, communeField('', 'Lyon 1er'));

    expect(commune).toBe('Lyon');
  });

  it('should remove district 2e', (): void => {
    const commune: string = CLEAN_COMMUNE.reduce(toCleanField, communeField('', 'Lyon 2e'));

    expect(commune).toBe('Lyon');
  });

  it('should remove numeric chars', (): void => {
    const commune: string = CLEAN_COMMUNE.reduce(toCleanField, communeField('', 'Amplepuis 69550'));

    expect(commune).toBe('Amplepuis');
  });

  it('should replace curved apostrophes', (): void => {
    const commune: string = CLEAN_COMMUNE.reduce(toCleanField, communeField('', 'L’ESCARÈNE'));

    expect(commune).toBe("L'ESCARÈNE");
  });
});
