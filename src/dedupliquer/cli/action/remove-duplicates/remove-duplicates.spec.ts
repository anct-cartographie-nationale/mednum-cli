/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import {
  ConditionAcces,
  LabelNational,
  ModaliteAccompagnement,
  PublicAccueilli,
  SchemaLieuMediationNumerique,
  Service,
  Typologie
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { removeDuplicates } from './remove-duplicates';

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
    ]);
  });
});
