import { toOsmHours } from './to-osm-hours';

describe('les assembleurs', (): void => {
  it('should format 9:00 - 12:00 / 14:00 - 18:00 to osm hours', (): void => {
    const hours: string = '9:00 - 12:00 / 14:00 - 18:00';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,14:00-18:00');
  });

  it('should format 8h45 à 12h15 to osm hours', (): void => {
    const hours: string = '8h45 à 12h15';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('08:45-12:15');
  });

  it('should format 9H-12H /14H-18H to osm hours', (): void => {
    const hours: string = '9H-12H /14H-18H';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,14:00-18:00');
  });

  it('should format 09h-12h / 14h-18h to osm hours', (): void => {
    const hours: string = '09h-12h / 14h-18h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,14:00-18:00');
  });

  it('should format 8h30 à 12h - 14h à 17h30 to osm hours', (): void => {
    const hours: string = '8h30 à 12h - 14h à 17h30';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('08:30-12:00,14:00-17:30');
  });

  it('should format 16h-19h to osm hours', (): void => {
    const hours: string = '16h-19h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('16:00-19:00');
  });

  it('should format 9h-12h et 14h-16h30 to osm hours', (): void => {
    const hours: string = '9h-12h et 14h-16h30';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,14:00-16:30');
  });

  it('should format de 9h à 12h et de 14h à 17h to osm hours', (): void => {
    const hours: string = 'de 9h à 12h et de 14h à 17h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,14:00-17:00');
  });

  it('should format 13h30-17H00 to osm hours', (): void => {
    const hours: string = '13h30-17H00';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('13:30-17:00');
  });

  it('should format 09H00-17H00 to osm hours', (): void => {
    const hours: string = '09H00-17H00';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-17:00');
  });

  it('should format 9h/17h to osm hours', (): void => {
    const hours: string = '9h/17h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-17:00');
  });

  it('should format 8 h 30 - 12 h -  et 13 h 30 -17 h to osm hours', (): void => {
    const hours: string = '8 h 30 - 12 h -  et 13 h 30 -17 h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('08:30-12:00,13:30-17:00');
  });

  it('should format 9h00-12h00  13h00-17h00 to osm hours', (): void => {
    const hours: string = ' 9h00-12h00  13h00-17h00';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,13:00-17:00');
  });

  it('should format 9h/12h45-13h30/17h to osm hours', (): void => {
    const hours: string = ' 9h/12h45-13h30/17h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:45,13:30-17:00');
  });

  it('should format 8h30 12h / 14h 17h30 to osm hours', (): void => {
    const hours: string = '8h30 12h / 14h 17h30';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('08:30-12:00,14:00-17:30');
  });

  it('should format 9h12h / 14h-17h to osm hours', (): void => {
    const hours: string = '9h12h / 14h-17h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,14:00-17:00');
  });

  it('should format 9h – 12h30 / 13h30 – 17h to osm hours', (): void => {
    const hours: string = '9h – 12h30 / 13h30 – 17h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:30,13:30-17:00');
  });

  it('should format 9h-12h 13h30-16h30 to osm hours', (): void => {
    const hours: string = '9h-12h 13h30-16h30';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,13:30-16:30');
  });

  it('should format de 8h30 h à 12 h et de 13 h 30 à 17 h to osm hours', (): void => {
    const hours: string = 'de 8h30 h à 12 h et de 13 h 30 à 17 h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('08:30-12:00,13:30-17:00');
  });

  it('should format 09:00-12:00 hors premier Lundi du mois to osm hours', (): void => {
    const hours: string = '09:00-12:00 hors premier Lundi du mois';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00');
  });

  it('should format 8h30-12 / 13h30 17h30 to osm hours', (): void => {
    const hours: string = '8h30-12 / 13h30 17h30';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('08:30-12:00,13:30-17:30');
  });

  it('should format 8:30 -12:00 /14: - 17:30 to osm hours', (): void => {
    const hours: string = '8:30 -12:00 /14: - 17:30';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('08:30-12:00,14:00-17:30');
  });

  it('should format 8:30/12:00 -14:/18: to osm hours', (): void => {
    const hours: string = '8:30/12:00 -14:/18:';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('08:30-12:00,14:00-18:00');
  });

  it('should format 10:/12: to osm hours', (): void => {
    const hours: string = '10:/12:';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('10:00-12:00');
  });

  it('should format 8:30-12- /14: - 17:30 to osm hours', (): void => {
    const hours: string = '8:30-12- /14: - 17:30';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('08:30-12:00,14:00-17:30');
  });
});
