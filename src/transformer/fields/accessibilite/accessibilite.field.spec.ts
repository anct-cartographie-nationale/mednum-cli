/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Adresse } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { Erp, processAccessibilite } from './accessibilite.field';

describe('accessibilite field', (): void => {
  it('should get accessibilite url from data source using matching information', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      accessibilite: {
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

    const accesLibreData: Erp[] = [];

    const accessibilite: string | undefined = processAccessibilite(source, matching, accesLibreData, adresseProcessed);

    expect(accessibilite).toBe(
      'https://acceslibre.beta.gouv.fr/app/73-chambery/a/administration-publique/erp/mairie-chambery/'
    );
  });

  it('should not get any accessibilite url', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      accessibilite: {
        colonne: 'bf_accessibilit_'
      }
    } as LieuxMediationNumeriqueMatching;

    const adresseProcessed: Adresse = {
      voie: '',
      code_postal: '',
      commune: ''
    } as Adresse;

    const source: DataSource = {};

    const accesLibreData: Erp[] = [];

    const accessibilite: string | undefined = processAccessibilite(source, matching, accesLibreData, adresseProcessed);

    expect(accessibilite).toBeUndefined();
  });

  it('should ignore empty strings', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      accessibilite: {
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

    const accesLibreData: Erp[] = [];

    const accessibilite: string | undefined = processAccessibilite(source, matching, accesLibreData, adresseProcessed);

    expect(accessibilite).toBeUndefined();
  });

  it('should get accessibilite from acces libre', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      accessibilite: {
        colonne: 'bf_accessibilit_'
      },
      nom: {
        colonne: 'nom'
      }
    } as LieuxMediationNumeriqueMatching;

    const adresseProcessed: Adresse = {
      voie: '31 rue Jean Gallart',
      code_postal: '49650',
      commune: 'Allonnes'
    } as Adresse;

    const source: DataSource = {
      bf_accessibilit_: '',
      nom: "France Services d'Allonnes"
    };

    const accesLibreData: Erp[] = [
      {
        name: 'France Services Allonnes',
        siret: '',
        web_url: 'https://acceslibre.beta.gouv.fr/app/49-allonnes/a/guichet-france-services/erp/france-services/',
        voie: 'jean gallart',
        numero: '31',
        postal_code: '49650'
      }
    ];

    const accessibilite: string | undefined = processAccessibilite(source, matching, accesLibreData, adresseProcessed);

    expect(accessibilite).toBe(
      'https://acceslibre.beta.gouv.fr/app/49-allonnes/a/guichet-france-services/erp/france-services/'
    );
  });
});
