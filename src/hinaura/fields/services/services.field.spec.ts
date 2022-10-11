/* eslint-disable @typescript-eslint/naming-convention */

import { formatServicesField } from './services.field';
import { Service } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { HinauraLieuMediationNumerique } from '../../helper';

describe('hinaura services field', (): void => {
  it('should handle empty value', (): void => {
    const services: Service[] = formatServicesField({} as HinauraLieuMediationNumerique);

    expect(services).toStrictEqual([]);
  });

  it('should not find any service matching a_disposition key', (): void => {
    const services: Service[] = formatServicesField({ 'À disposition': '' } as HinauraLieuMediationNumerique);

    expect(services).toStrictEqual([]);
  });

  it('should not find any service matching formations_competences_de_base_proposees key', (): void => {
    const services: Service[] = formatServicesField({
      'Formations compétences de base proposées': ''
    } as HinauraLieuMediationNumerique);

    expect(services).toStrictEqual([]);
  });

  it('should not find any service matching comprendre_et_utiliser_les_sites_d’acces_aux_droits_proposees key', (): void => {
    const services: Service[] = formatServicesField({
      'Comprendre et Utiliser les sites d’accès aux droits proposées': ''
    } as HinauraLieuMediationNumerique);

    expect(services).toStrictEqual([]);
  });

  it('should not find any service matching sensibilisations_culture_numerique key', (): void => {
    const services: Service[] = formatServicesField({
      'Sensibilisations culture numérique': ''
    } as HinauraLieuMediationNumerique);

    expect(services).toStrictEqual([]);
  });

  it('should find "Accéder à une connexion internet" service', (): void => {
    const services: Service[] = formatServicesField({
      'À disposition': 'réseau wifi'
    } as HinauraLieuMediationNumerique);

    expect(services).toStrictEqual([Service.AccederAUneConnexionInternet]);
  });

  it('should find "Accéder à du matériel" service', (): void => {
    const services: Service[] = formatServicesField({
      'À disposition': 'accès libre à du matériel informatique'
    } as HinauraLieuMediationNumerique);

    expect(services).toStrictEqual([Service.AccederADuMateriel]);
  });

  it('should find "Prendre en main un ordinateur,Utiliser le numérique au quotidien,Approfondir ma culture numérique" service', (): void => {
    const services: Service[] = formatServicesField({
      'À disposition': "découvrir l'ordinateur"
    } as HinauraLieuMediationNumerique);

    expect(services).toStrictEqual([
      Service.PrendreEnMainUnOrdinateur,
      Service.UtiliserLeNumerique,
      Service.ApprofondirMaCultureNumerique
    ]);
  });

  it('should find "Prendre en main un smartphone ou une tablette" service with "tablette" value', (): void => {
    const services: Service[] = formatServicesField({ 'À disposition': 'tablette' } as HinauraLieuMediationNumerique);

    expect(services).toStrictEqual([Service.PrendreEnMainUnSmartphoneOuUneTablette]);
  });

  it('should find "Prendre en main un smartphone ou une tablette" service with "smartphone" value', (): void => {
    const services: Service[] = formatServicesField({ 'À disposition': 'smartphone' } as HinauraLieuMediationNumerique);

    expect(services).toStrictEqual([Service.PrendreEnMainUnSmartphoneOuUneTablette]);
  });

  it('should not find any "démarches administratives" service when modalites_accompagnement is not specified', (): void => {
    const services: Service[] = formatServicesField({ 'À disposition': 'services de la caf' } as HinauraLieuMediationNumerique);

    expect(services).toStrictEqual([]);
  });

  it('should find "Devenir autonome dans les démarches administratives,Réaliser des démarches administratives avec un accompagnement" services when modalites_accompagnement is set to "Seul, Avec de l\'aide"', (): void => {
    const services: Service[] = formatServicesField(
      { 'À disposition': 'services de la caf' } as HinauraLieuMediationNumerique,
      "Seul, Avec de l'aide"
    );

    expect(services).toStrictEqual([
      Service.DevenirAutonomeDansLesDemarchesAdministratives,
      Service.RealiserDesDemarchesAdministratives
    ]);
  });

  it('should find "Devenir autonome dans les démarches administratives" service when modalites_accompagnement is set to "Seul"', (): void => {
    const services: Service[] = formatServicesField(
      { 'À disposition': 'services de la caf' } as HinauraLieuMediationNumerique,
      'Seul'
    );

    expect(services).toStrictEqual([Service.DevenirAutonomeDansLesDemarchesAdministratives]);
  });

  it('should find "Réaliser des démarches administratives avec un accompagnement" service when modalites_accompagnement is set to "Avec de l\'aide"', (): void => {
    const services: Service[] = formatServicesField(
      { 'À disposition': 'services de la caf' } as HinauraLieuMediationNumerique,
      "Avec de l'aide"
    );

    expect(services).toStrictEqual([Service.RealiserDesDemarchesAdministratives]);
  });

  it('should find "Accompagner les démarches de santé" service with CPAM value', (): void => {
    const services: Service[] = formatServicesField({ 'À disposition': 'CPAM' } as HinauraLieuMediationNumerique);

    expect(services).toStrictEqual([Service.AccompagnerLesDemarchesDeSante]);
  });

  it('should find "Accompagner les démarches de santé" service with ameli.fr value', (): void => {
    const services: Service[] = formatServicesField({ 'À disposition': 'ameli.fr' } as HinauraLieuMediationNumerique);

    expect(services).toStrictEqual([Service.AccompagnerLesDemarchesDeSante]);
  });

  it('should find "Utiliser le numérique au quotidien,Approfondir ma culture numérique,Promouvoir la citoyenneté numérique" services', (): void => {
    const services: Service[] = formatServicesField({
      'À disposition': 'cultures numériques'
    } as HinauraLieuMediationNumerique);

    expect(services).toStrictEqual([
      Service.UtiliserLeNumerique,
      Service.ApprofondirMaCultureNumerique,
      Service.PromouvoirLaCitoyenneteNumerique
    ]);
  });

  it('should cumulate all available services with "Seul" as modalites_accompagnement', (): void => {
    const services: Service[] = formatServicesField(
      {
        'À disposition':
          "réseau wifi, accès libre à du matériel informatique, découvrir l'ordinateur, utiliser une tablette, démarches CPAM, cultures numériques, pôle emploi"
      } as HinauraLieuMediationNumerique,
      'Seul'
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
    const services: Service[] = formatServicesField(
      {
        'À disposition':
          "réseau wifi, accès libre à du matériel informatique, découvrir l'ordinateur, utiliser une tablette, démarches CPAM, cultures numériques, pôle emploi"
      } as HinauraLieuMediationNumerique,
      "Avec de l'aide"
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
    const services: Service[] = formatServicesField(
      {
        'À disposition':
          "réseau wifi, accès libre à du matériel informatique, découvrir l'ordinateur, utiliser une tablette, démarches CPAM, cultures numériques, pôle emploi"
      } as HinauraLieuMediationNumerique,
      "Seul, Avec de l'aide"
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
    const services: Service[] = formatServicesField({
      'À disposition': 'tablette',
      'Sensibilisations culture numérique': 'utiliser une tablette'
    } as HinauraLieuMediationNumerique);

    expect(services).toStrictEqual([Service.PrendreEnMainUnSmartphoneOuUneTablette]);
  });
});
