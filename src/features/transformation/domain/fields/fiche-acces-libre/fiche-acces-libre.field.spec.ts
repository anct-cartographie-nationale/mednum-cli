import { describe, it, expect } from 'vitest';
import type { Adresse } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { LieuxMediationNumeriqueMatching, DataSource } from '../../matching';
import type { AccesLibreErp } from '../../../../../libraries/acces-libre';
import { accesLibreIndex, processFicheAccesLibre } from './fiche-acces-libre.field';

const ALLONNES: AccesLibreErp = {
  nom: "France Services d'Allonnes",
  activite: 'Guichet france services',
  codeInsee: '49003',
  numero: '31',
  voie: 'Rue Jean Gallart',
  codePostal: '49650',
  ficheUrl: 'https://acceslibre.beta.gouv.fr/app/49-allonnes/a/guichet-france-services/erp/france-services/'
};

describe('accessibilite field', (): void => {
  it('should get accessibilite url from data source using matching information', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      fiche_acces_libre: {
        colonne: 'bf_accessibilit_'
      }
    } as LieuxMediationNumeriqueMatching;

    const adresseProcessed: Adresse = {
      voie: '',
      code_postal: '',
      commune: ''
    } as Adresse;

    const source: DataSource = {
      bf_accessibilit_: 'https://acceslibre.beta.gouv.fr/app/73-chambery/a/administration-publique/erp/mairie-chambery/'
    };

    const accesLibreData = accesLibreIndex([]);

    const accessibilite: string | undefined = processFicheAccesLibre(
      source,
      matching,
      accesLibreData,
      adresseProcessed,
      'Un lieu'
    );

    expect(accessibilite).toBe(
      'https://acceslibre.beta.gouv.fr/app/73-chambery/a/administration-publique/erp/mairie-chambery/'
    );
  });

  it('should not get any accessibilite url', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      fiche_acces_libre: {
        colonne: 'bf_accessibilit_'
      }
    } as LieuxMediationNumeriqueMatching;

    const adresseProcessed: Adresse = {
      voie: '',
      code_postal: '',
      commune: ''
    } as Adresse;

    const source: DataSource = {};

    const accesLibreData = accesLibreIndex([]);

    const accessibilite: string | undefined = processFicheAccesLibre(
      source,
      matching,
      accesLibreData,
      adresseProcessed,
      'Un lieu'
    );

    expect(accessibilite).toBeUndefined();
  });

  it('should not get accessibilite url from data source if not valid', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      fiche_acces_libre: {
        colonne: 'bf_accessibilit_'
      }
    } as LieuxMediationNumeriqueMatching;

    const adresseProcessed: Adresse = {
      voie: '',
      code_postal: '',
      commune: ''
    } as Adresse;

    const source: DataSource = {
      bf_accessibilit_: 'https://acceslibre.beta.gouv.fr/static/js/widget.js'
    };

    const accesLibreData = accesLibreIndex([]);

    const accessibilite: string | undefined = processFicheAccesLibre(
      source,
      matching,
      accesLibreData,
      adresseProcessed,
      'Un lieu'
    );

    expect(accessibilite).toBeUndefined();
  });

  it('should not get accessibilite url from data source if not valid', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      fiche_acces_libre: {
        colonne: 'bf_accessibilit_'
      }
    } as LieuxMediationNumeriqueMatching;

    const adresseProcessed: Adresse = {
      voie: '',
      code_postal: '',
      commune: ''
    } as Adresse;

    const source: DataSource = {
      bf_accessibilit_:
        'https://acceslibre.beta.gouv.fr/recherche/?what=&where=Saint-Nazaire-le-D%C3%A9sert%20(26)&lat=44.569759&lon=5.275761&code=26321'
    };

    const accesLibreData = accesLibreIndex([]);

    const accessibilite: string | undefined = processFicheAccesLibre(
      source,
      matching,
      accesLibreData,
      adresseProcessed,
      'Un lieu'
    );

    expect(accessibilite).toBe(
      'https://acceslibre.beta.gouv.fr/recherche/?what=&where=Saint-Nazaire-le-D%C3%A9sert%20%2826%29&lat=44.569759&lon=5.275761&code=26321'
    );
  });

  it('should ignore empty strings', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      fiche_acces_libre: {
        colonne: 'bf_accessibilit_'
      }
    } as LieuxMediationNumeriqueMatching;

    const adresseProcessed: Adresse = {
      voie: '',
      code_postal: '',
      commune: ''
    } as Adresse;

    const source: DataSource = {
      bf_accessibilit_: ''
    };

    const accesLibreData = accesLibreIndex([]);

    const accessibilite: string | undefined = processFicheAccesLibre(
      source,
      matching,
      accesLibreData,
      adresseProcessed,
      'Un lieu'
    );

    expect(accessibilite).toBeUndefined();
  });

  it('rattache la fiche dont l’adresse est exactement celle du lieu', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      fiche_acces_libre: { colonne: 'bf_accessibilit_' },
      nom: { colonne: 'nom' }
    } as LieuxMediationNumeriqueMatching;

    const adresseProcessed: Adresse = {
      voie: '31 rue Jean Gallart',
      code_postal: '49650',
      code_insee: '49003',
      commune: 'Allonnes'
    } as Adresse;

    const source: DataSource = { bf_accessibilit_: '', nom: "France Services d'Allonnes" };

    const ficheAccesLibre: string | undefined = processFicheAccesLibre(
      source,
      matching,
      accesLibreIndex([ALLONNES]),
      adresseProcessed,
      "France Services d'Allonnes"
    );

    expect(ficheAccesLibre).toBe(
      'https://acceslibre.beta.gouv.fr/app/49-allonnes/a/guichet-france-services/erp/france-services/'
    );
  });
});
