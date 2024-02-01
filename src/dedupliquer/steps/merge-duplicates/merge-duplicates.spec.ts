/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import {
  SchemaLieuMediationNumerique,
  Service,
  LabelNational,
  ModaliteAccompagnement,
  Typologie,
  ConditionAcces,
  PublicAccueilli
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { duplicationComparisons } from '../duplication-comparisons';
import { groupDuplicates } from '../group-duplicates/group-duplicates';
import { MergedLieuxByGroupMap, mergeDuplicates } from './merge-duplicates';

describe('remove duplicates', (): void => {
  it('should not have merged lieux when there is no duplicates', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-hinaura-MairiE2-mediation-numerique',
        pivot: '00000000000000',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey (chez Aconit)',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962,
        date_maj: '2023-05-03',
        source: 'hinaura',
        services: Service.AccederADuMateriel
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'La Turbine.Coop',
        adresse: '5 esplanade Andry Farcy 38000 Grenoble',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953,
        date_maj: '2023-05-03',
        source: 'hinaura',
        services: Service.AccederADuMateriel
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(lieux, groupDuplicates([]));

    expect(lieuxWithoutDuplicates).toStrictEqual(new Map<string, SchemaLieuMediationNumerique>());
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
        source: 'hinaura',
        services: Service.AccederADuMateriel
      },
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
        source: 'francil-in',
        services: Service.AccederADuMateriel
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(
      lieux,
      groupDuplicates(duplicationComparisons(lieux, false))
    );

    expect(lieuxWithoutDuplicates).toStrictEqual(
      new Map<string, SchemaLieuMediationNumerique>([
        [
          '673303b99e539442336e5e866dc641d67938c3a0cfd32880c2cafac2fd6ea3ba',
          {
            id: 'hinaura-MairiE2__hub-lo-436',
            pivot: '00000000000000',
            nom: 'France Services Durtal',
            adresse: '11 rue Joseph Cugnot',
            code_postal: '49430',
            commune: 'Durtal',
            latitude: 47.6699154795,
            longitude: -0.2551539846,
            date_maj: '2023-05-03',
            source: 'hinaura',
            services: Service.AccederADuMateriel
          }
        ]
      ])
    );
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
      },
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
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(
      lieux,
      groupDuplicates(duplicationComparisons(lieux, false))
    );

    expect(lieuxWithoutDuplicates).toStrictEqual(
      new Map<string, SchemaLieuMediationNumerique>([
        [
          '673303b99e539442336e5e866dc641d67938c3a0cfd32880c2cafac2fd6ea3ba',
          {
            id: 'hinaura-MairiE2__hub-lo-436',
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
          }
        ]
      ])
    );
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
      },
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
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(
      lieux,
      groupDuplicates(duplicationComparisons(lieux, false))
    );

    expect(lieuxWithoutDuplicates).toStrictEqual(
      new Map<string, SchemaLieuMediationNumerique>([
        [
          '673303b99e539442336e5e866dc641d67938c3a0cfd32880c2cafac2fd6ea3ba',
          {
            id: 'hinaura-MairiE2__hub-lo-436',
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
          }
        ]
      ])
    );
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
      },
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
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(
      lieux,
      groupDuplicates(duplicationComparisons(lieux, false))
    );

    expect(lieuxWithoutDuplicates).toStrictEqual(
      new Map<string, SchemaLieuMediationNumerique>([
        [
          '673303b99e539442336e5e866dc641d67938c3a0cfd32880c2cafac2fd6ea3ba',
          {
            id: 'hinaura-MairiE2__hub-lo-436',
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
          }
        ]
      ])
    );
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
      },
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
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(
      lieux,
      groupDuplicates(duplicationComparisons(lieux, false))
    );

    expect(lieuxWithoutDuplicates).toStrictEqual(
      new Map<string, SchemaLieuMediationNumerique>([
        [
          '673303b99e539442336e5e866dc641d67938c3a0cfd32880c2cafac2fd6ea3ba',
          {
            id: 'hinaura-MairiE2__hub-lo-436',
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
          }
        ]
      ])
    );
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
      },
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
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(
      lieux,
      groupDuplicates(duplicationComparisons(lieux, false))
    );

    expect(lieuxWithoutDuplicates).toStrictEqual(
      new Map<string, SchemaLieuMediationNumerique>([
        [
          '673303b99e539442336e5e866dc641d67938c3a0cfd32880c2cafac2fd6ea3ba',
          {
            id: 'hinaura-MairiE2__hub-lo-436',
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
          }
        ]
      ])
    );
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
      },
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
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(
      lieux,
      groupDuplicates(duplicationComparisons(lieux, false))
    );

    expect(lieuxWithoutDuplicates).toStrictEqual(
      new Map<string, SchemaLieuMediationNumerique>([
        [
          '673303b99e539442336e5e866dc641d67938c3a0cfd32880c2cafac2fd6ea3ba',
          {
            id: 'hinaura-MairiE2__hub-lo-436',
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
          }
        ]
      ])
    );
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
      },
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
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(
      lieux,
      groupDuplicates(duplicationComparisons(lieux, false))
    );

    expect(lieuxWithoutDuplicates).toStrictEqual(
      new Map<string, SchemaLieuMediationNumerique>([
        [
          '673303b99e539442336e5e866dc641d67938c3a0cfd32880c2cafac2fd6ea3ba',
          {
            id: 'hinaura-MairiE2__hub-lo-436',
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
          }
        ]
      ])
    );
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
      },
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
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(
      lieux,
      groupDuplicates(duplicationComparisons(lieux, false))
    );

    expect(lieuxWithoutDuplicates).toStrictEqual(
      new Map<string, SchemaLieuMediationNumerique>([
        [
          '673303b99e539442336e5e866dc641d67938c3a0cfd32880c2cafac2fd6ea3ba',
          {
            id: 'hinaura-MairiE2__hub-lo-436',
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
          }
        ]
      ])
    );
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
      },
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
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(
      lieux,
      groupDuplicates(duplicationComparisons(lieux, false))
    );

    expect(lieuxWithoutDuplicates).toStrictEqual(
      new Map<string, SchemaLieuMediationNumerique>([
        [
          '673303b99e539442336e5e866dc641d67938c3a0cfd32880c2cafac2fd6ea3ba',
          {
            id: 'hinaura-MairiE2__hub-lo-436',
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
          }
        ]
      ])
    );
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
      },
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
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(
      lieux,
      groupDuplicates(duplicationComparisons(lieux, false))
    );

    expect(lieuxWithoutDuplicates).toStrictEqual(
      new Map<string, SchemaLieuMediationNumerique>([
        [
          '673303b99e539442336e5e866dc641d67938c3a0cfd32880c2cafac2fd6ea3ba',
          {
            id: 'hinaura-MairiE2__hub-lo-436',
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
          }
        ]
      ])
    );
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
      },
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
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(
      lieux,
      groupDuplicates(duplicationComparisons(lieux, false))
    );

    expect(lieuxWithoutDuplicates).toStrictEqual(
      new Map<string, SchemaLieuMediationNumerique>([
        [
          '673303b99e539442336e5e866dc641d67938c3a0cfd32880c2cafac2fd6ea3ba',
          {
            id: 'hinaura-MairiE2__hub-lo-436',
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
          }
        ]
      ])
    );
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
      },
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
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(
      lieux,
      groupDuplicates(duplicationComparisons(lieux, false))
    );

    expect(lieuxWithoutDuplicates).toStrictEqual(
      new Map<string, SchemaLieuMediationNumerique>([
        [
          '673303b99e539442336e5e866dc641d67938c3a0cfd32880c2cafac2fd6ea3ba',
          {
            id: 'hinaura-MairiE2__hub-lo-436',
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
          }
        ]
      ])
    );
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
        source: 'hinaura',
        services: Service.AccederADuMateriel
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2019-01-17',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'francil-in',
        services: Service.AccederADuMateriel
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(
      lieux,
      groupDuplicates(duplicationComparisons(lieux, false))
    );

    expect(lieuxWithoutDuplicates).toStrictEqual(
      new Map<string, SchemaLieuMediationNumerique>([
        [
          '673303b99e539442336e5e866dc641d67938c3a0cfd32880c2cafac2fd6ea3ba',
          {
            id: 'hinaura-MairiE2__hub-lo-436',
            pivot: '00000000000000',
            nom: 'France Services Durtal',
            adresse: '11 rue Joseph Cugnot',
            code_postal: '49430',
            commune: 'Durtal',
            latitude: 47.6699154795,
            longitude: -0.2551539846,
            date_maj: '2023-05-03',
            source: 'hinaura',
            services: Service.AccederADuMateriel
          }
        ]
      ])
    );
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
        source: 'hinaura',
        services: Service.AccederADuMateriel
      },
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
        services: Service.AccederADuMateriel
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(
      lieux,
      groupDuplicates(duplicationComparisons(lieux, false))
    );

    expect(lieuxWithoutDuplicates).toStrictEqual(
      new Map<string, SchemaLieuMediationNumerique>([
        [
          '673303b99e539442336e5e866dc641d67938c3a0cfd32880c2cafac2fd6ea3ba',
          {
            id: 'hinaura-MairiE2__hub-lo-436',
            pivot: '00000000000000',
            nom: 'France Services Durtal',
            adresse: '11 rue Joseph Cugnot',
            code_postal: '49430',
            commune: 'DURTAL',
            latitude: 47.671271,
            longitude: -0.256457,
            date_maj: '2023-05-03',
            source: 'francil-in',
            services: Service.AccederADuMateriel
          }
        ]
      ])
    );
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
        source: 'conseiller-numerique',
        services: Service.AccederADuMateriel
      },
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
        services: Service.AccederADuMateriel
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(
      lieux,
      groupDuplicates(duplicationComparisons(lieux, false))
    );

    expect(lieuxWithoutDuplicates).toStrictEqual(
      new Map<string, SchemaLieuMediationNumerique>([
        [
          '673303b99e539442336e5e866dc641d67938c3a0cfd32880c2cafac2fd6ea3ba',
          {
            id: 'hinaura-MairiE2__hub-lo-436',
            pivot: '00000000000000',
            nom: 'France Services Durtal',
            adresse: '11 rue Joseph Cugnot',
            code_postal: '49430',
            commune: 'Durtal',
            latitude: 47.6699154795,
            longitude: -0.2551539846,
            date_maj: '2023-05-03',
            source: 'conseiller-numerique',
            services: Service.AccederADuMateriel
          }
        ]
      ])
    );
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
        courriel: 'commune-de-durtal@france-services.fr',
        services: Service.AccederADuMateriel
      },
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
        source: 'conseiller-numerique',
        services: Service.AccederADuMateriel
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(
      lieux,
      groupDuplicates(duplicationComparisons(lieux, false))
    );

    expect(lieuxWithoutDuplicates).toStrictEqual(
      new Map<string, SchemaLieuMediationNumerique>([
        [
          '673303b99e539442336e5e866dc641d67938c3a0cfd32880c2cafac2fd6ea3ba',
          {
            id: 'hinaura-MairiE2__hub-lo-436',
            pivot: '00000000000000',
            nom: 'France Services Durtal',
            adresse: '11 rue Joseph Cugnot',
            code_postal: '49430',
            commune: 'DURTAL',
            latitude: 47.671271,
            longitude: -0.256457,
            date_maj: '2023-05-03',
            source: 'conseiller-numerique',
            services: Service.AccederADuMateriel
          }
        ]
      ])
    );
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
        labels_nationaux: LabelNational.FranceServices,
        services: Service.AccederADuMateriel
      },
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
        labels_nationaux: `${LabelNational.CNFS};${LabelNational.APTIC}`,
        services: Service.AccederADuMateriel
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(
      lieux,
      groupDuplicates(duplicationComparisons(lieux, false))
    );

    expect(lieuxWithoutDuplicates).toStrictEqual(
      new Map<string, SchemaLieuMediationNumerique>([
        [
          '673303b99e539442336e5e866dc641d67938c3a0cfd32880c2cafac2fd6ea3ba',
          {
            id: 'hinaura-MairiE2__hub-lo-436',
            pivot: '00000000000000',
            nom: 'France Services Durtal',
            adresse: '11 rue Joseph Cugnot',
            code_postal: '49430',
            commune: 'Durtal',
            latitude: 47.6699154795,
            longitude: -0.2551539846,
            date_maj: '2023-05-03',
            source: 'conseiller-numerique',
            labels_nationaux: `${LabelNational.FranceServices};${LabelNational.CNFS};${LabelNational.APTIC}`,
            services: Service.AccederADuMateriel
          }
        ]
      ])
    );
  });
});
