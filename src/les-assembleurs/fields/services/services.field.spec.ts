/* eslint-disable @typescript-eslint/naming-convention */

import { formatServicesField } from './services.field';
import { ModaliteAccompagnement, Service } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LesAssembleursLieuMediationNumerique } from '../../helpers';

describe('les assembleurs services field', (): void => {
  it('should handle empty value', (): void => {
    const services: Service[] = formatServicesField({} as LesAssembleursLieuMediationNumerique);

    expect(services).toStrictEqual([]);
  });

  it('should not find any service matching a_disposition key', (): void => {
    const services: Service[] = formatServicesField({ 'Type démarches': '' } as LesAssembleursLieuMediationNumerique);

    expect(services).toStrictEqual([]);
  });

  it('should find "Devenir autonome dans les démarches administratives,Réaliser des démarches administratives avec un accompagnement" services when modalites_accompagnement is set to "Seul, Avec de l\'aide"', (): void => {
    const services: Service[] = formatServicesField({ 'Type démarches': 'caf' } as LesAssembleursLieuMediationNumerique, [
      ModaliteAccompagnement.Seul,
      ModaliteAccompagnement.AvecDeLAide
    ]);

    expect(services).toStrictEqual([
      Service.DevenirAutonomeDansLesDemarchesAdministratives,
      Service.RealiserDesDemarchesAdministratives
    ]);
  });

  it('should find "Accompagner les démarches de sante" service with "santé" value', (): void => {
    const services: Service[] = formatServicesField({ 'Type démarches': 'santé' } as LesAssembleursLieuMediationNumerique);

    expect(services).toStrictEqual([Service.AccompagnerLesDemarchesDeSante]);
  });

  it('should find "Devenir autonome dans les démarches administratives" service with "emploi" value and modalites is "Seul"', (): void => {
    const services: Service[] = formatServicesField({ 'Type démarches': 'emploi' } as LesAssembleursLieuMediationNumerique, [
      ModaliteAccompagnement.Seul
    ]);

    expect(services).toStrictEqual([Service.DevenirAutonomeDansLesDemarchesAdministratives]);
  });

  it('should find "Devenir autonome dans les démarches administratives,Accompagner les démarches de sante" services when modalites_accompagnement is set to "Seul"', (): void => {
    const services: Service[] = formatServicesField(
      {
        'Type démarches':
          "Citoyenneté - État-civil (Carte d'identité, acte de naissance, passeport...), Social (Allocations familiales, RSA...), Santé (Carte Vitale, handicap...), Emploi (Recherche d'emploi, création d'entreprise...), Retraite (Allocations retraite...), Fiscalité (Impôts...), Justice (Dépôt de plainte, casier judiciaire...), Étrangers (Titres de séjour, attestation d'accueil...), Logement (Allocations logement, permis de construire, fin de bail...), Transports (Carte grise, permis de conduire...), Loisirs (Culture, sport, vie associative...)"
      } as LesAssembleursLieuMediationNumerique,
      [ModaliteAccompagnement.Seul]
    );

    expect(services).toStrictEqual([
      Service.PromouvoirLaCitoyenneteNumerique,
      Service.AccompagnerLesDemarchesDeSante,
      Service.DevenirAutonomeDansLesDemarchesAdministratives
    ]);
  });

  it('should find "Devenir autonome dans les démarches administratives,Réaliser des démarches administratives avec un accompagnement" service with "administrations" value', (): void => {
    const services: Service[] = formatServicesField(
      { 'Type démarches': 'administrations' } as LesAssembleursLieuMediationNumerique,
      [ModaliteAccompagnement.Seul, ModaliteAccompagnement.AvecDeLAide]
    );

    expect(services).toStrictEqual([
      Service.DevenirAutonomeDansLesDemarchesAdministratives,
      Service.RealiserDesDemarchesAdministratives
    ]);
  });

  it('should find "Accompagner les démarches de sante" service with "démarches maladie" value', (): void => {
    const services: Service[] = formatServicesField({
      'Type démarches': 'démarches maladie'
    } as LesAssembleursLieuMediationNumerique);

    expect(services).toStrictEqual([Service.AccompagnerLesDemarchesDeSante]);
  });

  it("should find \"Acceder à une connexion internet, Acceder à du materiel,Prendre en main un ordinateur,Utiliser le numérique au quotidien,Approfondir ma culture numérique, Prendre en main une tablette ou un smartphone, Promouvoir la citonyenté du numérique\" service with \"L'utilisation du poste informatique, L'utilisation d'outils bureautiques et de communication, L'utilisation de services dématérialisés en ligne, La création et publication de contenus en ligne (vidéos, blogs, sites), L'utilisation des réseaux sociaux, L'utilisation de terminaux (tablette, téléphone, imprimantes, scanner), L'utilisation de plateformes d'apprentissage (tutoriels, MOOC), La sensibilisation aux cultures et usages du numérique, La fabrication d'objets numériques (robots, 3D)\" value", (): void => {
    const services: Service[] = formatServicesField({
      'Type médiation numérique':
        "L'utilisation du poste informatique, L'utilisation d'outils bureautiques et de communication, L'utilisation de services dématérialisés en ligne, La création et publication de contenus en ligne (vidéos, blogs, sites), L'utilisation des réseaux sociaux, L'utilisation de terminaux (tablette, téléphone, imprimantes, scanner), L'utilisation de plateformes d'apprentissage (tutoriels, MOOC), La sensibilisation aux cultures et usages du numérique, La fabrication d'objets numériques (robots, 3D)"
    } as LesAssembleursLieuMediationNumerique);

    expect(services).toStrictEqual([
      Service.AccederAUneConnexionInternet,
      Service.AccederADuMateriel,
      Service.PrendreEnMainUnOrdinateur,
      Service.UtiliserLeNumerique,
      Service.ApprofondirMaCultureNumerique,
      Service.PrendreEnMainUnSmartphoneOuUneTablette,
      Service.PromouvoirLaCitoyenneteNumerique
    ]);
  });
});
