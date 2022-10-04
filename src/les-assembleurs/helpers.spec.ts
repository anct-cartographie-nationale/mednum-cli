import { isOpeningHours } from './helpers';

describe('les assembleurs', (): void => {
  it('should filter empty values indicated with -----', (): void => {
    const values: string[] = ['-----'];

    const filteredValues: string[] = values.filter(isOpeningHours);

    expect(filteredValues).toStrictEqual([]);
  });

  it('should filter empty values indicated with -', (): void => {
    const values: string[] = ['-'];

    const filteredValues: string[] = values.filter(isOpeningHours);

    expect(filteredValues).toStrictEqual([]);
  });

  it('should filter Fermé values', (): void => {
    const values: string[] = ['Fermé'];

    const filteredValues: string[] = values.filter(isOpeningHours);

    expect(filteredValues).toStrictEqual([]);
  });

  it('should filter fermé values', (): void => {
    const values: string[] = ['fermé'];

    const filteredValues: string[] = values.filter(isOpeningHours);

    expect(filteredValues).toStrictEqual([]);
  });

  it('should filter FERMÉ values', (): void => {
    const values: string[] = ['FERMÉ'];

    const filteredValues: string[] = values.filter(isOpeningHours);

    expect(filteredValues).toStrictEqual([]);
  });

  it('should filter FERME values', (): void => {
    const values: string[] = ['FERME'];

    const filteredValues: string[] = values.filter(isOpeningHours);

    expect(filteredValues).toStrictEqual([]);
  });

  it('should filter holidays values', (): void => {
    const values: string[] = ['16h à 18h (9h à 12h et de 13h à 18h en vacances scolaires)'];

    const filteredValues: string[] = values.filter(isOpeningHours);

    expect(filteredValues).toStrictEqual([]);
  });

  it('should filter booked values', (): void => {
    const values: string[] = ['réservés aux groupes et aux collectivités'];

    const filteredValues: string[] = values.filter(isOpeningHours);

    expect(filteredValues).toStrictEqual([]);
  });

  it('should filter fermée values', (): void => {
    const values: string[] = ['fermée'];

    const filteredValues: string[] = values.filter(isOpeningHours);

    expect(filteredValues).toStrictEqual([]);
  });

  it('should filter rendez-vous appointment values', (): void => {
    const values: string[] = ['sur rendez-vous le matin'];

    const filteredValues: string[] = values.filter(isOpeningHours);

    expect(filteredValues).toStrictEqual([]);
  });

  it('should filter rdv appointment values', (): void => {
    const values: string[] = ['sur rdv matin'];

    const filteredValues: string[] = values.filter(isOpeningHours);

    expect(filteredValues).toStrictEqual([]);
  });

  it('should filter exceptional values for saturday', (): void => {
    const values: string[] = ['13h30 - 18h30 1 samedi sur 2'];

    const filteredValues: string[] = values.filter(isOpeningHours);

    expect(filteredValues).toStrictEqual([]);
  });

  it('should filter exceptional values for first day of month', (): void => {
    const values: string[] = ['9h-12h30 et 1er de chaque mois uniquement : 14h-17h30'];

    const filteredValues: string[] = values.filter(isOpeningHours);

    expect(filteredValues).toStrictEqual([]);
  });
});
