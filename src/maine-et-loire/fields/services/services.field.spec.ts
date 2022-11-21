import { Service } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { SERVICES_MAP_MAINE_ET_LOIRE } from '..';
import { processServices } from '../../../tools/fields/services/services.field';

describe('maine et loire services field', (): void => {
  it('should handle empty value', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_MAINE_ET_LOIRE, '', []);

    expect(services).toStrictEqual([]);
  });

  it('should find "Devenir autonome dans les démarches administratives,Réaliser des démarches administratives avec un accompagnement,Accompagner les démarches de santés" services', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_MAINE_ET_LOIRE, 'démarches générales', []);

    expect(services).toStrictEqual([
      Service.AccompagnerLesDemarchesDeSante,
      Service.DevenirAutonomeDansLesDemarchesAdministratives,
      Service.RealiserDesDemarchesAdministratives
    ]);
  });

  it('should find "Accéder à une connexion internet,Accéder à du materiel,Prendre en main un ordinateur,Utiliser le numérique" services', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_MAINE_ET_LOIRE, 'accès internet', []);

    expect(services).toStrictEqual([
      Service.AccederAUneConnexionInternet,
      Service.AccederADuMateriel,
      Service.PrendreEnMainUnOrdinateur,
      Service.UtiliserLeNumerique
    ]);
  });

  it('should find "Accéder à une connexion internet,Accéder à du materiel,Prendre en main un ordinateur,Utiliser le numérique,Promouvoir citoyenneté" services', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_MAINE_ET_LOIRE, 'Initiation aux outils numériques', []);

    expect(services).toStrictEqual([
      Service.AccederAUneConnexionInternet,
      Service.AccederADuMateriel,
      Service.PrendreEnMainUnOrdinateur,
      Service.UtiliserLeNumerique,
      Service.ApprofondirMaCultureNumerique,
      Service.PromouvoirLaCitoyenneteNumerique
    ]);
  });

  it('should  find "Accéder à une connexion internet"', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_MAINE_ET_LOIRE, 'wifi', []);

    expect(services).toStrictEqual([Service.AccederAUneConnexionInternet]);
  });

  it('should  find "Accéder à du materiel when value is "jt_mat_imp"', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_MAINE_ET_LOIRE, 'jt_mat_imp', []);

    expect(services).toStrictEqual([Service.AccederADuMateriel]);
  });

  it('should  find "Accéder à du materiel when value is "jt_mat_sca"', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_MAINE_ET_LOIRE, 'jt_mat_sca', []);

    expect(services).toStrictEqual([Service.AccederADuMateriel]);
  });

  it('should  find "Accéder à du materiel when value is "jt_mat_bor"', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_MAINE_ET_LOIRE, 'jt_mat_bor', []);

    expect(services).toStrictEqual([Service.AccederADuMateriel]);
  });

  it('should  find "Accéder à du materiel when value is "jt_mat_3d"', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_MAINE_ET_LOIRE, 'jt_mat_3d', []);

    expect(services).toStrictEqual([Service.AccederADuMateriel]);
  });

  it('should  find "Accéder à du materiel when value is "jt_mat_vid"', (): void => {
    const services: Service[] = processServices(SERVICES_MAP_MAINE_ET_LOIRE, 'jt_mat_vid', []);

    expect(services).toStrictEqual([Service.AccederADuMateriel]);
  });
});
