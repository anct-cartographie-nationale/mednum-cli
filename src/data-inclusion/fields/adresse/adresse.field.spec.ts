/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { processCommune, processVoie } from './adresse.field';

describe('adresse field', (): void => {
  it('should delete brackets', (): void => {
    const dataInclusionCommune: string = 'Paris (75)';

    const commune: string = processCommune(dataInclusionCommune);

    expect(commune).toBe('Paris');
  });

  it('should replace "/" by "sur"', (): void => {
    const dataInclusionCommune: string = 'VILLEFRANCHE/SAONE';

    const commune: string = processCommune(dataInclusionCommune);

    expect(commune).toBe('VILLEFRANCHE sur SAONE');
  });

  it('should replace accentued char by same char without accent', (): void => {
    const dataInclusionCommune: string = 'POINTE-Ã-PITRE';

    const commune: string = processCommune(dataInclusionCommune);

    expect(commune).toBe('POINTE-A-PITRE');
  });

  it('should replace "," by nothing', (): void => {
    const dataInclusionVoie: string = 'avenue Gustave Eiffel, cité Générat, Bat K1';

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe('avenue Gustave Eiffel cité Générat Bat K1');
  });

  it('should replace "°" by nothing', (): void => {
    const dataInclusionVoie: string = '43 avenue Faidherbe Bureau N°8';

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe('43 avenue Faidherbe Bureau N8');
  });

  it('should replace all "." by nothing', (): void => {
    const dataInclusionVoie: string = 'Z.A. de la Millière';

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe('ZA de la Millière');
  });

  it('should delete all voie after a "|"', (): void => {
    const dataInclusionVoie: string = '1022 R Antoine de Saint-exupery | R Antoine Saint-exupery';

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe('1022 R Antoine de Saint-exupery');
  });

  it('should replace all "/" by "-"', (): void => {
    const dataInclusionVoie: string = '2/12 Rue du Chemin des Femmes';

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe('2-12 Rue du Chemin des Femmes');
  });

  it('should delete all voie after a ":"', (): void => {
    const dataInclusionVoie: string = '4 Rue Emile Desvaux Adresse :\r\nCentre hospitalier';

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe('4 Rue Emile Desvaux Adresse Centre hospitalier');
  });

  it('should trim all voie with brackets', (): void => {
    const dataInclusionVoie: string = 'Cheminement de la Maison Neuve Noyant (Noyant-la-Gravoyère)';

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe('Cheminement de la Maison Neuve Noyant');
  });

  it('should trim multiple newlines', (): void => {
    const dataInclusionVoie: string = 'Chemin de la Fauceille\r\nRoute d\'Elne\r\nLieu dit "Mas balande"';

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe("Chemin de la Fauceille Route d'Elne Lieu dit Mas balande");
  });

  it('should replace all long dash to simple dash', (): void => {
    const dataInclusionVoie: string = '61 – 63 Avenue Paul Krüger';

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe('61 - 63 Avenue Paul Krüger');
  });

  it('should replace "¨" by nothing', (): void => {
    const dataInclusionVoie: string = '14 Rue des ¨Paradis';

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe('14 Rue des Paradis');
  });

  it('should replace ? by C', (): void => {
    const dataInclusionVoie: string = '16 AV FRAN?OIS MITERRAND';

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe('16 AV FRANCOIS MITERRAND');
  });

  it('should replace delete all after "&"', (): void => {
    const dataInclusionCommune: string = 'Caudebec en Caux & Lillebonne';

    const commune: string = processCommune(dataInclusionCommune);

    expect(commune).toBe('Caudebec en Caux');
  });

  it('should remove all dot in commune', (): void => {
    const dataInclusionCommune: string = 'LA POSSESSION B.P. 24';

    const commune: string = processCommune(dataInclusionCommune);

    expect(commune).toBe('LA POSSESSION BP 24');
  });

  it('should replace space unicode by regular spaces', (): void => {
    const dataInclusionVoie: string = '96 rue Didot';

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe('96 rue Didot');
  });

  it('should replace all space unicode by regular spaces when previous test not doing at all', (): void => {
    const dataInclusionVoie: string = '6  rue du Cardinal Paul Gouyon';

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe('6 rue du Cardinal Paul Gouyon');
  });

  it('should replace "{" by nothing', (): void => {
    const dataInclusionVoie: string = 'DISPENSAIRE D{PARTEMENTAL 15 RUE BERRY';

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe('DISPENSAIRE DPARTEMENTAL 15 RUE BERRY');
  });

  it('should delete all voie after "&"', (): void => {
    const dataInclusionVoie: string = 'MAISON SOLIDARITÉ & FAMILLES 1 PAS DES ÉCOLES BP 251';

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe('MAISON SOLIDARITÉ');
  });

  it('should replace any "+" in voie', (): void => {
    const dataInclusionVoie: string = '20 + Place + JEAN BAPTISTE + DURAND';

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe('20 Place JEAN BAPTISTE DURAND');
  });

  it('should delete all voie after ";"', (): void => {
    const dataInclusionVoie: string = "53 Avenue de l'Europe Ecopolis; 1er étage bureau 09";

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe("53 Avenue de l'Europe Ecopolis");
  });
});
