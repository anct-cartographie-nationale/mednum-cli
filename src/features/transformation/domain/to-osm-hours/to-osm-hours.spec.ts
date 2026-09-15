import { describe, it, expect } from 'vitest';
import { toOsmHours } from './to-osm-hours';

describe('to osm hours', (): void => {
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

  it('should format 9-12/14-18 to osm hours', (): void => {
    const hours: string = '9-12/14-18';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,14:00-18:00');
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

  it('should format 8h30 - 12h / 14h - 17h30 to osm hours', (): void => {
    const hours: string = '8h30 - 12h / 14h - 17h30';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('08:30-12:00,14:00-17:30');
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

  it('should format 8h30-12h/13h30-17h to osm hours', (): void => {
    const hours: string = '8h30-12h/13h30-17h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('08:30-12:00,13:30-17:00');
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
    const hours: string = '9h/12h45-13h30/17h';
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

  it("should format 9h30-12h (jusqu'en juin 2022) to osm hours", (): void => {
    const hours: string = "9h30-12h (jusqu'en juin 2022)";
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:30-12:00');
  });

  it('should format 14h-18h sur RDV uniquement to osm hours', (): void => {
    const hours: string = '14h-18h sur RDV uniquement';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('14:00-18:00');
  });

  it('should format 10 à 12h - 14h à 16h sur RDV uniquement to osm hours', (): void => {
    const hours: string = '10 à 12h - 14h à 16h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('10:00-12:00,14:00-16:00');
  });

  it('should format 9h30 à 12h30*-*fermé vacances to osm hours', (): void => {
    const hours: string = '9h30 à 12h30*-*fermé vacances';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:30-12:30');
  });

  it('should format 9h00/12h00  13h30/17h30 to osm hours', (): void => {
    const hours: string = '9h00/12h00  13h30/17h30';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,13:30-17:30');
  });

  it("should format 9h00/12h00 atelier cyber  13h30/17h30 atelier f'AB to osm hours", (): void => {
    const hours: string = "9h00/12h00 atelier cyber  13h30/17h30 atelier f'AB";
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,13:30-17:30');
  });

  it("should format Pas d'accueil. to osm hours", (): void => {
    const hours: string = "Pas d'accueil.";
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('');
  });

  it('should format Sans rendez-vous de 9h30 à 12h to osm hours', (): void => {
    const hours: string = 'Sans rendez-vous de 9h30 à 12h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:30-12:00');
  });

  it('should format 9h à 12h  14h à 17h30 to osm hours', (): void => {
    const hours: string = '9h à 12h  14h à 17h30';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,14:00-17:30');
  });

  it('should format 10h30 12h to osm hours', (): void => {
    const hours: string = '10h30 12h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('10:30-12:00');
  });

  it('should format 9H-12H / Après-midi sur RDV to osm hours', (): void => {
    const hours: string = '9H-12H / Après-midi sur RDV';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00');
  });

  it('should format 11h/12h30 et 14h/19h to osm hours', (): void => {
    const hours: string = '11h/12h30 et 14h/19h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('11:00-12:30,14:00-19:00');
  });

  it('should format 8h30-12h30 13h30 -17h30 to osm hours', (): void => {
    const hours: string = '8h30-12h30 13h30 -17h30';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('08:30-12:30,13:30-17:30');
  });

  it('should format 8h30-12h30 13h30 17h30 to osm hours', (): void => {
    const hours: string = '8h30-12h30 13h30 17h30';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('08:30-12:30,13:30-17:30');
  });

  it('should format 9h30-12h30, 14h-17h to osm hours', (): void => {
    const hours: string = '9h30-12h30, 14h-17h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:30-12:30,14:00-17:00');
  });

  it('should format 12h3019h to osm hours', (): void => {
    const hours: string = '12h3019h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('12:30-19:00');
  });

  it('should format 9-12h  13h30-18h to osm hours', (): void => {
    const hours: string = '9-12h  13h30-18h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,13:30-18:00');
  });

  it('should format Fermé  le matin - 13h30 à 18h to osm hours', (): void => {
    const hours: string = 'Fermé  le matin - 13h30 à 18h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('13:30-18:00');
  });

  it('should format 8h à 12h &amp; 13h30 à 17h30 to osm hours', (): void => {
    const hours: string = '8h à 12h &amp; 13h30 à 17h30';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('08:00-12:00,13:30-17:30');
  });

  it('should format 9hè16h to osm hours', (): void => {
    const hours: string = '9hè16h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-16:00');
  });

  it('should format 9h-12h - 14h-17h to osm hours', (): void => {
    const hours: string = '9h-12h - 14h-17h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,14:00-17:00');
  });

  it('should format 9h30-12h0/ 13h-16h to osm hours', (): void => {
    const hours: string = '9h30-12h0/ 13h-16h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:30-12:00,13:00-16:00');
  });

  it('should format 13h30 a 16h30 sur rendez-vous to osm hours', (): void => {
    const hours: string = '13h30 a 16h30 sur rendez-vous';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('13:30-16:30');
  });

  it('should format 9h12h 14h18h(Mandela) to osm hours', (): void => {
    const hours: string = '9h12h 14h18h(Mandela)';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,14:00-18:00');
  });

  it('should format En location_reservation to osm hours', (): void => {
    const hours: string = 'En location_reservation';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('');
  });

  it('should format 9h-12h00 ; 13h30-17h00 to osm hours', (): void => {
    const hours: string = '9h-12h00 ; 13h30-17h00';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,13:30-17:00');
  });

  it('should format 18h to osm hours', (): void => {
    const hours: string = '18h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('');
  });

  it('should format 10h00 - 12h30 | 13h30 - 16h00 to osm hours', (): void => {
    const hours: string = '10h00 - 12h30 | 13h30 - 16h00';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('10:00-12:30,13:30-16:00');
  });

  it('should format 10h-12h     14h-18h to osm hours', (): void => {
    const hours: string = '10h-12h     14h-18h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('10:00-12:00,14:00-18:00');
  });

  it('should format 9h à 12h30 et de 13h30 à 16h3 to osm hours', (): void => {
    const hours: string = '9h à 12h30 et de 13h30 à 16h3';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:30,13:30-16:30');
  });

  it('should format 08h30-12h00/13h30-1730 to osm hours', (): void => {
    const hours: string = '08h30-12h00/13h30-1730';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('08:30-12:00,13:30-17:30');
  });

  it('should format 9h30-12h30 / 1er samedi du moi to osm hours', (): void => {
    const hours: string = '9h30-12h30 / 1er samedi du moi';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:30-12:30');
  });

  it('should format 1x par mois de 10h à 12h to osm hours', (): void => {
    const hours: string = '1x par mois de 10h à 12h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('10:00-12:00');
  });

  it('should format ateliers collectifs réguliers; avec LE LAVOIR to osm hours', (): void => {
    const hours: string = 'ateliers collectifs réguliers; avec LE LAVOIR';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('');
  });

  it('should format 10h/12h et 13h30/16h30 to osm hours', (): void => {
    const hours: string = '10h/12h et 13h30/16h30';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('10:00-12:00,13:30-16:30');
  });

  it('should format Permanence 14h à 16h tous les 15 jours to osm hours', (): void => {
    const hours: string = 'Permanence 14h à 16h tous les 15 jours';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('14:00-16:00');
  });

  it('should format Permanences de 9h à 12h (à partir du 14/04/2022 to osm hours', (): void => {
    const hours: string = 'Permanences de 9h à 12h (à partir du 14/04/2022';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00');
  });

  it('should format Permanence de 13h30 à 16h30 1 Semaine /2 to osm hours', (): void => {
    const hours: string = 'Permanence de 13h30 à 16h30 1 Semaine /2';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('13:30-16:30');
  });

  it('should format 9h à 12h _ 13h30 à 17h to osm hours', (): void => {
    const hours: string = '9h à 12h _ 13h30 à 17h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,13:30-17:00');
  });

  it('should format 8h30 à12h30 13h30 à 16h30h to osm hours', (): void => {
    const hours: string = '8h30 à12h30 13h30 à 16h30';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('08:30-12:30,13:30-16:30');
  });

  it('should format | Présence sur Chambéry / Annecy to osm hours', (): void => {
    const hours: string = '| Présence sur Chambéry / Annecy';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('');
  });

  it('should format 9H a 12H  14H a 17H to osm hours', (): void => {
    const hours: string = '9H a 12H  14H a 17H';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,14:00-17:00');
  });

  it('should format ----- to osm hours', (): void => {
    const hours: string = '-----';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('');
  });

  it('should format Juillet-août : 10h-12h / 13h30-17h30 to osm hours', (): void => {
    const hours: string = 'Juillet-août : 10h-12h / 13h30-17h30';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('10:00-12:00,13:30-17:30');
  });

  it('should format 1 samedi sur 2 : 9:00 - 12:30 to osm hours', (): void => {
    const hours: string = '1 samedi sur 2 : 9:00 - 12:30';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:30');
  });

  it('should format 9h à 12h et de 13h30 à 18h hors et en vacances scolaires to osm hours', (): void => {
    const hours: string = '9h à 12h et de 13h30 à 18h hors et en vacances scolaires';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,13:30-18:00');
  });

  it('should format 9h - 12h le 1er et le dernier samedi du mois to osm hours', (): void => {
    const hours: string = '9h - 12h le 1er et le dernier samedi du mois';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00');
  });

  it('should format 9h-12h30 et 1er de chaque mois uniquement : 14h-17h30 to osm hours', (): void => {
    const hours: string = '9h-12h30 et 1er de chaque mois uniquement : 14h-17h30';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:30,14:00-17:30');
  });

  it('should format 08:30 12:30 - 13:30 17:00 to osm hours', (): void => {
    const hours: string = '08:30 12:30 - 13:30 17:00';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('08:30-12:30,13:30-17:00');
  });

  it('should format 9h-12h 14h18h to osm hours', (): void => {
    const hours: string = '9h-12h 14h18h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,14:00-18:00');
  });

  it('should format samedi de 14 h 30 à 18 h 30 pinto 5 rue des fortes terres to osm hours', (): void => {
    const hours: string = 'samedi de 14 h 30 à 18 h 30 pinto 5 rue des fortes terres';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('14:30-18:30');
  });

  it('should format 9h30-12h et 13h,17h to osm hours', (): void => {
    const hours: string = '9h30-12h et 13h,17h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:30-12:00,13:00-17:00');
  });

  it('should format 9h,12/ 13h30-17h30 to osm hours', (): void => {
    const hours: string = '9h,12/ 13h30-17h30';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,13:30-17:30');
  });

  it('should format 9h 12h - 13h30 17h to osm hours', (): void => {
    const hours: string = '9h 12h - 13h30 17h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,13:30-17:00');
  });

  it('should format 14 18 h to osm hours', (): void => {
    const hours: string = '14 15 h et 16 19h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('14:00-15:00,16:00-19:00');
  });

  it('should format 10h-18h  -  pendant les vacances : > to osm hours', (): void => {
    const hours: string = '10h-18h  -  pendant les vacances : >';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('10:00-18:00');
  });

  it('should format 9h 12h et 14h 19h to osm hours', (): void => {
    const hours: string = '9h 12h et 14h 19h';
    const formattedHours: string = toOsmHours(hours);

    expect(formattedHours).toBe('09:00-12:00,14:00-19:00');
  });
});
