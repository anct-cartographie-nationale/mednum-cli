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

  it('should replace all "/" by "-"', (): void => {
    const dataInclusionVoie: string = '2/12 Rue du Chemin des Femmes';

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe('2-12 Rue du Chemin des Femmes');
  });

  it('should trim multiple newlines', (): void => {
    const dataInclusionVoie: string = 'Chemin de la Fauceille\r\nRoute d\'Elne\r\nLieu dit "Mas balande"';

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe("Chemin de la Fauceille Route d'Elne Lieu dit Mas balande");
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

  it('should replace any "+" in voie', (): void => {
    const dataInclusionVoie: string = '20 + Place + JEAN BAPTISTE + DURAND';

    const voie: string = processVoie(dataInclusionVoie);

    expect(voie).toBe('20 Place JEAN BAPTISTE DURAND');
  });
});
