/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import {
  ModaliteAccompagnement,
  SchemaLieuMediationNumerique,
  Service,
  LabelNational,
  ConditionAcces,
  Typologie,
  PublicAccueilli
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { findGroups, Group, removeDuplicates } from './remove-duplicates';

describe('remove duplicates', (): void => {
  it('should not remove lieux when there is no duplicates', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey (chez Aconit)',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'La Turbine.Coop',
        adresse: '5 esplanade Andry Farcy 38000 Grenoble',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey (chez Aconit)',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'La Turbine.Coop',
        adresse: '5 esplanade Andry Farcy 38000 Grenoble',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should remove oldest lieux when there is two duplicate', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'hinaura'
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2019-08-01',
        source: 'francil-in'
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: 'hinaura-MairiE2|hub-lo-436',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'hinaura'
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should merge extra field from lieu 2 duplicate', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'hinaura',
        services: Service.RealiserDesDemarchesAdministratives
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-01-16',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'francil-in',
        services: Service.RealiserDesDemarchesAdministratives
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: 'hinaura-MairiE2|hub-lo-436',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.RealiserDesDemarchesAdministratives
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should merge but not override default pivot', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.RealiserDesDemarchesAdministratives
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '43493312300029',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: Service.RealiserDesDemarchesAdministratives
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: 'hinaura-MairiE2|hub-lo-436',
        pivot: '43493312300029',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.RealiserDesDemarchesAdministratives
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should merge lieux services', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: `${Service.DevenirAutonomeDansLesDemarchesAdministratives};${Service.RealiserDesDemarchesAdministratives}`
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: `${Service.PrendreEnMainUnSmartphoneOuUneTablette};${Service.FavoriserMonInsertionProfessionnelle}`
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: 'hinaura-MairiE2|hub-lo-436',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: `${Service.DevenirAutonomeDansLesDemarchesAdministratives};${Service.RealiserDesDemarchesAdministratives};${Service.PrendreEnMainUnSmartphoneOuUneTablette};${Service.FavoriserMonInsertionProfessionnelle}`
      } as SchemaLieuMediationNumerique
    ]);
  });

  it("should merge lieux Modalités d'accompagnement", (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.RealiserDesDemarchesAdministratives,
        modalites_accompagnement: `${ModaliteAccompagnement.Seul};${ModaliteAccompagnement.AMaPlace};${ModaliteAccompagnement.DansUnAtelier}`
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: Service.RealiserDesDemarchesAdministratives,
        modalites_accompagnement: `${ModaliteAccompagnement.AvecDeLAide};${ModaliteAccompagnement.DansUnAtelier}`
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: 'hinaura-MairiE2|hub-lo-436',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.RealiserDesDemarchesAdministratives,
        modalites_accompagnement: `${ModaliteAccompagnement.Seul};${ModaliteAccompagnement.AMaPlace};${ModaliteAccompagnement.DansUnAtelier};${ModaliteAccompagnement.AvecDeLAide}`
      } as SchemaLieuMediationNumerique
    ]);
  });

  it("should merge lieux Conditions d'accès", (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.RealiserDesDemarchesAdministratives,
        conditions_acces: `${ConditionAcces.GratuitSousCondition};${ConditionAcces.Payant};${ConditionAcces.AccepteLePassNumerique}`
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: Service.RealiserDesDemarchesAdministratives,
        conditions_acces: `${ConditionAcces.Gratuit};${ConditionAcces.Payant}`
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: 'hinaura-MairiE2|hub-lo-436',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.RealiserDesDemarchesAdministratives,
        conditions_acces: `${ConditionAcces.GratuitSousCondition};${ConditionAcces.Payant};${ConditionAcces.AccepteLePassNumerique};${ConditionAcces.Gratuit}`
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should merge lieux Publics accueillis', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.RealiserDesDemarchesAdministratives,
        publics_accueillis: `${PublicAccueilli.Surdite};${PublicAccueilli.Adultes};${PublicAccueilli.Jeunes}`
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: Service.RealiserDesDemarchesAdministratives,
        publics_accueillis: `${PublicAccueilli.Surdite};${PublicAccueilli.Adultes};${PublicAccueilli.Seniors}`
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: 'hinaura-MairiE2|hub-lo-436',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.RealiserDesDemarchesAdministratives,
        publics_accueillis: `${PublicAccueilli.Surdite};${PublicAccueilli.Adultes};${PublicAccueilli.Jeunes};${PublicAccueilli.Seniors}`
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should merge lieux Labels nationaux', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.RealiserDesDemarchesAdministratives,
        labels_nationaux: `${LabelNational.CNFS};${LabelNational.FranceServices};${LabelNational.APTIC}`
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: Service.RealiserDesDemarchesAdministratives,
        labels_nationaux: `${LabelNational.AidantsConnect};${LabelNational.APTIC}`
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: 'hinaura-MairiE2|hub-lo-436',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.RealiserDesDemarchesAdministratives,
        labels_nationaux: `${LabelNational.CNFS};${LabelNational.FranceServices};${LabelNational.APTIC};${LabelNational.AidantsConnect}`
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should merge lieux Autres labels', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.RealiserDesDemarchesAdministratives,
        labels_autres: "Ville de Paris;Francil'in;cooltech"
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: Service.RealiserDesDemarchesAdministratives,
        labels_autres: "fablab;Francil'in"
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: 'hinaura-MairiE2|hub-lo-436',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.RealiserDesDemarchesAdministratives,
        labels_autres: "Ville de Paris;Francil'in;cooltech;fablab"
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should merge lieux Site web', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.RealiserDesDemarchesAdministratives,
        site_web: 'https://www.ville-durtal.fr/;https://www.ccals.fr/profils/durtal/'
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: Service.RealiserDesDemarchesAdministratives,
        site_web: 'https://www.ville-durtal.fr/;https://www.cap-tierslieux.org/'
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: 'hinaura-MairiE2|hub-lo-436',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.RealiserDesDemarchesAdministratives,
        site_web: 'https://www.ville-durtal.fr/;https://www.ccals.fr/profils/durtal/;https://www.cap-tierslieux.org/'
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should merge lieux Typologie', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.RealiserDesDemarchesAdministratives,
        typologie: `${Typologie.RFS};${Typologie.ASSO}`
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: Service.RealiserDesDemarchesAdministratives,
        typologie: `${Typologie.RFS};${Typologie.TIERS_LIEUX}`
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: 'hinaura-MairiE2|hub-lo-436',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.RealiserDesDemarchesAdministratives,
        typologie: `${Typologie.RFS};${Typologie.ASSO};${Typologie.TIERS_LIEUX}`
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should merge extra field from lieu 1 duplicate', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-01-16',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.RealiserDesDemarchesAdministratives
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: Service.RealiserDesDemarchesAdministratives
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: 'hinaura-MairiE2|hub-lo-436',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'francil-in',
        services: Service.RealiserDesDemarchesAdministratives
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should merge extra field from lieu 2 duplicate which source that is not conseiller numerique', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'conseiller-numerique',
        services: Service.RealiserDesDemarchesAdministratives
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-01-16',
        courriel: 'commune-de-durtal@france-services.fr',
        services: Service.RealiserDesDemarchesAdministratives
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: 'hinaura-MairiE2|hub-lo-436',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'conseiller-numerique',
        courriel: 'commune-de-durtal@france-services.fr',
        services: Service.RealiserDesDemarchesAdministratives
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should not merge extra field from lieu 2 duplicate when duplicate is too old', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'hinaura'
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2019-01-16',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'francil-in'
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: 'hinaura-MairiE2|hub-lo-436',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'hinaura'
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should not merge extra field from lieu 1 duplicate when duplicate is too old', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2019-01-16',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura'
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in'
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: 'hinaura-MairiE2|hub-lo-436',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in'
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should not merge extra field from lieu 2 duplicate with conseiller-numerique fields when duplicate is too old', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'conseiller-numerique'
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2019-01-16',
        courriel: 'commune-de-durtal@france-services.fr'
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: 'hinaura-MairiE2|hub-lo-436',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'conseiller-numerique'
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should not merge extra field from lieu 1 duplicate with conseiller-numerique fields when duplicate is too old', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2019-01-16',
        courriel: 'commune-de-durtal@france-services.fr'
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'conseiller-numerique'
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: 'hinaura-MairiE2|hub-lo-436',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'conseiller-numerique'
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should keep label nationaux even if the lieu is too old', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'conseiller-numerique',
        labels_nationaux: LabelNational.FranceServices
      } as SchemaLieuMediationNumerique,
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2019-01-16',
        courriel: 'commune-de-durtal@france-services.fr',
        labels_nationaux: `${LabelNational.CNFS};${LabelNational.APTIC}`
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: 'hinaura-MairiE2|hub-lo-436',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'conseiller-numerique',
        labels_nationaux: `${LabelNational.FranceServices};${LabelNational.CNFS};${LabelNational.APTIC}`
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should not have any group when there is no duplicated lieux', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'hinaura',
        services: `${Service.RealiserDesDemarchesAdministratives}`
      }
    ];

    const groups: Group[] = findGroups(new Date('2023-10-04'))(lieux);

    expect(groups).toStrictEqual([]);
  });

  it('should have one group when there is two duplicated lieux', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-res-in-199-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Service Grenoble',
        adresse: 'Place Robert Schumann',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953,
        date_maj: '2022-02-20',
        source: 'res-in',
        services: `${Service.CreerAvecLeNumerique}`
      },
      {
        id: 'mediation-numerique-hub-lo-918-mediation-numerique',
        pivot: '00000000000000',
        nom: 'Maison France Services',
        adresse: '4 Place Robert Schumann',
        code_postal: '38000',
        commune: 'GRENOBLE',
        latitude: 45.187654,
        longitude: 5.704953,
        date_maj: '2019-11-12',
        source: 'hub-lo',
        services: `${Service.CreerAvecLeNumerique}`
      }
    ];

    const groups: Group[] = findGroups(new Date('2023-10-04'))(lieux);

    expect(groups).toStrictEqual([
      {
        id: '0',
        lieuxIds: ['mediation-numerique-hub-lo-918-mediation-numerique', 'mediation-numerique-res-in-199-mediation-numerique']
      }
    ]);
  });

  it('should have two groups when there is multiple duplicated lieux for two final lieux', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'hinaura',
        services: `${Service.RealiserDesDemarchesAdministratives}`
      },
      {
        id: 'mediation-numerique-hub-lo-333-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-01-16',
        source: 'hub-lo',
        courriel: 'commune-de-durtal@france-services.fr',
        services: `${Service.DevenirAutonomeDansLesDemarchesAdministratives}`
      },
      {
        id: 'mediation-numerique-res-in-201-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2022-01-16',
        source: 'res-in',
        services: `${Service.CreerAvecLeNumerique}`
      },
      {
        id: 'mediation-numerique-res-in-199-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Service Grenoble',
        adresse: 'Place Robert Schumann',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953,
        date_maj: '2022-02-20',
        source: 'res-in',
        services: `${Service.CreerAvecLeNumerique}`
      },
      {
        id: 'mediation-numerique-hub-lo-918-mediation-numerique',
        pivot: '00000000000000',
        nom: 'Maison France Services',
        adresse: '4 Place Robert Schumann',
        code_postal: '38000',
        commune: 'GRENOBLE',
        latitude: 45.187654,
        longitude: 5.704953,
        date_maj: '2019-11-12',
        source: 'hub-lo',
        services: `${Service.CreerAvecLeNumerique}`
      }
    ];

    const groups: Group[] = findGroups(new Date('2023-10-04'))(lieux);

    expect(groups).toStrictEqual([
      {
        id: '1',
        lieuxIds: ['mediation-numerique-hub-lo-918-mediation-numerique', 'mediation-numerique-res-in-199-mediation-numerique']
      },
      {
        id: '0',
        lieuxIds: [
          'mediation-numerique-res-in-201-mediation-numerique',
          'mediation-numerique-hub-lo-333-mediation-numerique',
          'mediation-numerique-hinaura-MairiE2-mediation-numerique'
        ]
      }
    ]);
  });
});
