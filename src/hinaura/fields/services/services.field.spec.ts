/* eslint-disable @typescript-eslint/naming-convention */

import { ModaliteAccompagnement, Service } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { processServices } from '../../../tools';
import { SERVICES_MAP_HINAURA } from './services.map';

describe('hinaura services field', (): void => {
  it('should handle empty value', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_HINAURA, '', []);
    expect(services).toStrictEqual([]);
  });

  it('should find "Accéder à une connexion internet" service', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_HINAURA, 'réseau wifi', []);

    expect(services).toStrictEqual([Service.AccederAUneConnexionInternet]);
  });

  it('should find "Accéder à du matériel" service', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_HINAURA, 'accès libre à du matériel informatique', []);

    expect(services).toStrictEqual([Service.AccederADuMateriel]);
  });

  it('should find "Prendre en main un ordinateur,Utiliser le numérique au quotidien,Approfondir ma culture numérique" service', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_HINAURA, "découvrir l'ordinateur", []);

    expect(services).toStrictEqual([
      Service.PrendreEnMainUnOrdinateur,
      Service.UtiliserLeNumerique,
      Service.ApprofondirMaCultureNumerique
    ]);
  });

  it('should find "Prendre en main un smartphone ou une tablette" service with "tablette" value', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_HINAURA, 'tablette', []);

    expect(services).toStrictEqual([Service.PrendreEnMainUnSmartphoneOuUneTablette]);
  });

  it('should find "Prendre en main un smartphone ou une tablette" service with "smartphone" value', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_HINAURA, 'smartphone', []);

    expect(services).toStrictEqual([Service.PrendreEnMainUnSmartphoneOuUneTablette]);
  });

  it('should not find any "démarches administratives" service when modalites_accompagnement is not specified', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_HINAURA, 'services de la caf', []);

    expect(services).toStrictEqual([]);
  });

  it('should find "Devenir autonome dans les démarches administratives,Réaliser des démarches administratives avec un accompagnement" services when modalites_accompagnement is set to "Seul, Avec de l\'aide"', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_HINAURA, 'services de la caf', [
      ModaliteAccompagnement.Seul,
      ModaliteAccompagnement.AvecDeLAide
    ]);

    expect(services).toStrictEqual([
      Service.DevenirAutonomeDansLesDemarchesAdministratives,
      Service.RealiserDesDemarchesAdministratives
    ]);
  });

  it('should find "Devenir autonome dans les démarches administratives" service when modalites_accompagnement is set to "Seul"', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_HINAURA, 'services de la caf', [ModaliteAccompagnement.Seul]);

    expect(services).toStrictEqual([Service.DevenirAutonomeDansLesDemarchesAdministratives]);
  });

  it('should find "Réaliser des démarches administratives avec un accompagnement" service when modalites_accompagnement is set to "Avec de l\'aide"', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_HINAURA, 'services de la caf', [
      ModaliteAccompagnement.AvecDeLAide
    ]);

    expect(services).toStrictEqual([Service.RealiserDesDemarchesAdministratives]);
  });

  it('should find "Accompagner les démarches de santé" service with CPAM value', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_HINAURA, 'CPAM', []);

    expect(services).toStrictEqual([Service.AccompagnerLesDemarchesDeSante]);
  });

  it('should find "Accompagner les démarches de santé" service with ameli.fr value', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_HINAURA, 'ameli.fr', []);

    expect(services).toStrictEqual([Service.AccompagnerLesDemarchesDeSante]);
  });

  it('should find "Utiliser le numérique au quotidien,Approfondir ma culture numérique,Promouvoir la citoyenneté numérique" services', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_HINAURA, 'cultures numériques');

    expect(services).toStrictEqual([
      Service.UtiliserLeNumerique,
      Service.ApprofondirMaCultureNumerique,
      Service.PromouvoirLaCitoyenneteNumerique
    ]);
  });

  it('should cumulate all available services with "Seul" as modalites_accompagnement', (): void => {
    const services: Service[] = processServices(
      SERVICES_MAP_HINAURA,
      "réseau wifi, accès libre à du matériel informatique, découvrir l'ordinateur, utiliser une tablette, démarches CPAM, cultures numériques, pôle emploi",
      [ModaliteAccompagnement.Seul]
    );

    expect(services).toStrictEqual([
      Service.AccederAUneConnexionInternet,
      Service.AccederADuMateriel,
      Service.PrendreEnMainUnOrdinateur,
      Service.UtiliserLeNumerique,
      Service.ApprofondirMaCultureNumerique,
      Service.PrendreEnMainUnSmartphoneOuUneTablette,
      Service.PromouvoirLaCitoyenneteNumerique,
      Service.AccompagnerLesDemarchesDeSante,
      Service.DevenirAutonomeDansLesDemarchesAdministratives
    ]);
  });

  it('should cumulate all available services with "Avec de l\'aide" as modalites_accompagnement', (): void => {
    const services: Service[] = processServices(
      SERVICES_MAP_HINAURA,
      "réseau wifi, accès libre à du matériel informatique, découvrir l'ordinateur, utiliser une tablette, démarches CPAM, cultures numériques, pôle emploi",
      [ModaliteAccompagnement.AvecDeLAide]
    );

    expect(services).toStrictEqual([
      Service.AccederAUneConnexionInternet,
      Service.AccederADuMateriel,
      Service.PrendreEnMainUnOrdinateur,
      Service.UtiliserLeNumerique,
      Service.ApprofondirMaCultureNumerique,
      Service.PrendreEnMainUnSmartphoneOuUneTablette,
      Service.PromouvoirLaCitoyenneteNumerique,
      Service.AccompagnerLesDemarchesDeSante,
      Service.RealiserDesDemarchesAdministratives
    ]);
  });

  it('should cumulate all available services with "Seul, Avec de l\'aide" as modalites_accompagnement', (): void => {
    const services: Service[] = processServices(
      SERVICES_MAP_HINAURA,
      "réseau wifi, accès libre à du matériel informatique, découvrir l'ordinateur, utiliser une tablette, démarches CPAM, cultures numériques, pôle emploi",
      [ModaliteAccompagnement.Seul, ModaliteAccompagnement.AvecDeLAide]
    );

    expect(services).toStrictEqual([
      Service.AccederAUneConnexionInternet,
      Service.AccederADuMateriel,
      Service.PrendreEnMainUnOrdinateur,
      Service.UtiliserLeNumerique,
      Service.ApprofondirMaCultureNumerique,
      Service.PrendreEnMainUnSmartphoneOuUneTablette,
      Service.PromouvoirLaCitoyenneteNumerique,
      Service.AccompagnerLesDemarchesDeSante,
      Service.DevenirAutonomeDansLesDemarchesAdministratives,
      Service.RealiserDesDemarchesAdministratives
    ]);
  });

  it('should get only one service when there is redundancy in targeted fields', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_HINAURA, 'tablette,utiliser une tablette', []);

    expect(services).toStrictEqual([Service.PrendreEnMainUnSmartphoneOuUneTablette]);
  });
});
