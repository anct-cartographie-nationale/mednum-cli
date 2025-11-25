import { describe, it, expect } from 'vitest';
import {
  SchemaLieuMediationNumerique,
  Service,
  ModaliteAccompagnement,
  Typologie,
  DispositifProgrammeNational,
  PublicSpecifiquementAdresse,
  PriseEnChargeSpecifique,
  Frais
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
        services: Service.AccesInternetEtMaterielInformatique
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
        services: Service.AccesInternetEtMaterielInformatique
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
        code_insee: '49127',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'hinaura',
        services: Service.AccesInternetEtMaterielInformatique
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        code_insee: '49127',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2019-08-01',
        source: 'francil-in',
        services: Service.AccesInternetEtMaterielInformatique
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
            code_insee: '49127',
            commune: 'Durtal',
            latitude: 47.6699154795,
            longitude: -0.2551539846,
            date_maj: '2023-05-03',
            source: 'hinaura',
            services: Service.AccesInternetEtMaterielInformatique
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
        code_insee: '49127',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'hinaura',
        services: Service.AideAuxDemarchesAdministratives
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        code_insee: '49127',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-01-16',
        courriels: 'commune-de-durtal@france-services.fr',
        source: 'francil-in',
        services: Service.AideAuxDemarchesAdministratives
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
            code_insee: '49127',
            commune: 'Durtal',
            latitude: 47.6699154795,
            longitude: -0.2551539846,
            date_maj: '2023-05-03',
            courriels: 'commune-de-durtal@france-services.fr',
            source: 'hinaura',
            services: Service.AideAuxDemarchesAdministratives
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
        code_insee: '49127',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriels: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.AideAuxDemarchesAdministratives
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '43493312300029',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        code_insee: '49127',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: Service.AideAuxDemarchesAdministratives
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
            code_insee: '49127',
            commune: 'Durtal',
            latitude: 47.6699154795,
            longitude: -0.2551539846,
            date_maj: '2023-05-03',
            courriels: 'commune-de-durtal@france-services.fr',
            source: 'hinaura',
            services: Service.AideAuxDemarchesAdministratives
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
        code_insee: '49127',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriels: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.AideAuxDemarchesAdministratives
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        code_insee: '49127',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: `${Service.MaitriseDesOutilsNumeriquesDuQuotidien}|${Service.InsertionProfessionnelleViaLeNumerique}`
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
            code_insee: '49127',
            commune: 'Durtal',
            latitude: 47.6699154795,
            longitude: -0.2551539846,
            date_maj: '2023-05-03',
            courriels: 'commune-de-durtal@france-services.fr',
            source: 'hinaura',
            services: `${Service.AideAuxDemarchesAdministratives}|${Service.MaitriseDesOutilsNumeriquesDuQuotidien}|${Service.InsertionProfessionnelleViaLeNumerique}`
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
        code_insee: '49127',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriels: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.AideAuxDemarchesAdministratives,
        modalites_accompagnement: `${ModaliteAccompagnement.EnAutonomie}|${ModaliteAccompagnement.AccompagnementIndividuel}|${ModaliteAccompagnement.DansUnAtelier}`
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        code_insee: '49127',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: Service.AideAuxDemarchesAdministratives,
        modalites_accompagnement: `${ModaliteAccompagnement.ADistance}|${ModaliteAccompagnement.AccompagnementIndividuel}|${ModaliteAccompagnement.DansUnAtelier}`
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
            code_insee: '49127',
            commune: 'Durtal',
            latitude: 47.6699154795,
            longitude: -0.2551539846,
            date_maj: '2023-05-03',
            courriels: 'commune-de-durtal@france-services.fr',
            source: 'hinaura',
            services: Service.AideAuxDemarchesAdministratives,
            modalites_accompagnement: `${ModaliteAccompagnement.EnAutonomie}|${ModaliteAccompagnement.AccompagnementIndividuel}|${ModaliteAccompagnement.DansUnAtelier}|${ModaliteAccompagnement.ADistance}`
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
        code_insee: '49127',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriels: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.AideAuxDemarchesAdministratives,
        frais_a_charge: `${Frais.GratuitSousCondition}|${Frais.Payant}`
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        code_insee: '49127',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: Service.AideAuxDemarchesAdministratives,
        frais_a_charge: `${Frais.Gratuit}|${Frais.Payant}`
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
            code_insee: '49127',
            commune: 'Durtal',
            latitude: 47.6699154795,
            longitude: -0.2551539846,
            date_maj: '2023-05-03',
            courriels: 'commune-de-durtal@france-services.fr',
            source: 'hinaura',
            services: Service.AideAuxDemarchesAdministratives,
            frais_a_charge: `${Frais.GratuitSousCondition}|${Frais.Payant}|${Frais.Gratuit}`
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
        code_insee: '49127',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriels: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.AideAuxDemarchesAdministratives,
        publics_specifiquement_adresses: `${PublicSpecifiquementAdresse.Seniors}|${PublicSpecifiquementAdresse.Jeunes}`,
        prise_en_charge_specifique: `${PriseEnChargeSpecifique.Surdite}|${PriseEnChargeSpecifique.HandicapsMoteurs}`
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        code_insee: '49127',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: Service.AideAuxDemarchesAdministratives,
        publics_specifiquement_adresses: `${PublicSpecifiquementAdresse.Etudiants}|${PublicSpecifiquementAdresse.FamillesEnfants}`,
        prise_en_charge_specifique: `${PriseEnChargeSpecifique.LanguesEtrangeresAutre}|${PriseEnChargeSpecifique.LanguesEtrangeresAnglais}`
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
            code_insee: '49127',
            commune: 'Durtal',
            latitude: 47.6699154795,
            longitude: -0.2551539846,
            date_maj: '2023-05-03',
            courriels: 'commune-de-durtal@france-services.fr',
            source: 'hinaura',
            services: Service.AideAuxDemarchesAdministratives,
            publics_specifiquement_adresses: `${PublicSpecifiquementAdresse.Seniors}|${PublicSpecifiquementAdresse.Jeunes}|${PublicSpecifiquementAdresse.Etudiants}|${PublicSpecifiquementAdresse.FamillesEnfants}`,
            prise_en_charge_specifique: `${PriseEnChargeSpecifique.Surdite}|${PriseEnChargeSpecifique.HandicapsMoteurs}|${PriseEnChargeSpecifique.LanguesEtrangeresAutre}|${PriseEnChargeSpecifique.LanguesEtrangeresAnglais}`
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
        code_insee: '49127',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriels: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.AideAuxDemarchesAdministratives,
        dispositif_programmes_nationaux: `${DispositifProgrammeNational.ConseillersNumeriques}|${DispositifProgrammeNational.FranceServices}|${DispositifProgrammeNational.CertificationPIX}`
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        code_insee: '49127',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: Service.AideAuxDemarchesAdministratives,
        dispositif_programmes_nationaux: `${DispositifProgrammeNational.AidantsConnect}|${DispositifProgrammeNational.CertificationPIX}`
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
            code_insee: '49127',
            commune: 'Durtal',
            latitude: 47.6699154795,
            longitude: -0.2551539846,
            date_maj: '2023-05-03',
            courriels: 'commune-de-durtal@france-services.fr',
            source: 'hinaura',
            services: Service.AideAuxDemarchesAdministratives,
            dispositif_programmes_nationaux: `${DispositifProgrammeNational.ConseillersNumeriques}|${DispositifProgrammeNational.FranceServices}|${DispositifProgrammeNational.CertificationPIX}|${DispositifProgrammeNational.AidantsConnect}`
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
        code_insee: '49127',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriels: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.AideAuxDemarchesAdministratives,
        autres_formations_labels: ['Ville de Paris', "Francil'in", 'cooltech'].join('|')
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        code_insee: '49127',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: Service.AideAuxDemarchesAdministratives,
        autres_formations_labels: ['fablab', "Francil'in"].join('|')
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
            code_insee: '49127',
            latitude: 47.6699154795,
            longitude: -0.2551539846,
            date_maj: '2023-05-03',
            courriels: 'commune-de-durtal@france-services.fr',
            source: 'hinaura',
            services: Service.AideAuxDemarchesAdministratives,
            autres_formations_labels: ['Ville de Paris', "Francil'in", 'cooltech', 'fablab'].join('|')
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
        code_insee: '49127',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriels: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.AideAuxDemarchesAdministratives,
        site_web: ['https://www.ville-durtal.fr/', 'https://www.ccals.fr/profils/durtal/'].join('|')
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        code_insee: '49127',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: Service.AideAuxDemarchesAdministratives,
        site_web: ['https://www.ville-durtal.fr/', 'https://www.cap-tierslieux.org'].join('|')
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
            code_insee: '49127',
            commune: 'Durtal',
            latitude: 47.6699154795,
            longitude: -0.2551539846,
            date_maj: '2023-05-03',
            courriels: 'commune-de-durtal@france-services.fr',
            source: 'hinaura',
            services: Service.AideAuxDemarchesAdministratives,
            site_web: [
              'https://www.ville-durtal.fr/',
              'https://www.ccals.fr/profils/durtal/',
              'https://www.cap-tierslieux.org'
            ].join('|')
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
        code_insee: '49127',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriels: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.AideAuxDemarchesAdministratives,
        typologie: `${Typologie.RFS}|${Typologie.ASSO}`
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        code_insee: '49127',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: Service.AideAuxDemarchesAdministratives,
        typologie: `${Typologie.RFS}|${Typologie.TIERS_LIEUX}`
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
            code_insee: '49127',
            commune: 'Durtal',
            latitude: 47.6699154795,
            longitude: -0.2551539846,
            date_maj: '2023-05-03',
            courriels: 'commune-de-durtal@france-services.fr',
            source: 'hinaura',
            services: Service.AideAuxDemarchesAdministratives,
            typologie: `${Typologie.RFS}|${Typologie.ASSO}|${Typologie.TIERS_LIEUX}`
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
        code_insee: '49127',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-01-16',
        courriels: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.AideAuxDemarchesAdministratives
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        code_insee: '49127',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: Service.AideAuxDemarchesAdministratives
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
            code_insee: '49127',
            commune: 'DURTAL',
            latitude: 47.671271,
            longitude: -0.256457,
            date_maj: '2023-05-03',
            courriels: 'commune-de-durtal@france-services.fr',
            source: 'francil-in',
            services: Service.AideAuxDemarchesAdministratives
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
        code_insee: '49127',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'conseiller-numerique',
        services: Service.AideAuxDemarchesAdministratives
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        code_insee: '49127',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-01-16',
        courriels: 'commune-de-durtal@france-services.fr',
        services: Service.AideAuxDemarchesAdministratives
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
            code_insee: '49127',
            commune: 'Durtal',
            latitude: 47.6699154795,
            longitude: -0.2551539846,
            date_maj: '2023-05-03',
            source: 'conseiller-numerique',
            courriels: 'commune-de-durtal@france-services.fr',
            services: Service.AideAuxDemarchesAdministratives
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
        code_insee: '49127',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'hinaura',
        services: Service.AccesInternetEtMaterielInformatique
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        code_insee: '49127',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2019-01-17',
        courriels: 'commune-de-durtal@france-services.fr',
        source: 'francil-in',
        services: Service.AccesInternetEtMaterielInformatique
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
            code_insee: '49127',
            commune: 'Durtal',
            latitude: 47.6699154795,
            longitude: -0.2551539846,
            date_maj: '2023-05-03',
            source: 'hinaura',
            services: Service.AccesInternetEtMaterielInformatique
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
        code_insee: '49127',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2019-01-16',
        courriels: 'commune-de-durtal@france-services.fr',
        source: 'hinaura',
        services: Service.AccesInternetEtMaterielInformatique
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        code_insee: '49127',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in',
        services: Service.AccesInternetEtMaterielInformatique
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
            code_insee: '49127',
            commune: 'DURTAL',
            latitude: 47.671271,
            longitude: -0.256457,
            date_maj: '2023-05-03',
            source: 'francil-in',
            services: Service.AccesInternetEtMaterielInformatique
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
        code_insee: '49127',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'conseiller-numerique',
        services: Service.AccesInternetEtMaterielInformatique
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        code_insee: '49127',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2019-01-16',
        courriels: 'commune-de-durtal@france-services.fr',
        services: Service.AccesInternetEtMaterielInformatique
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
            code_insee: '49127',
            commune: 'Durtal',
            latitude: 47.6699154795,
            longitude: -0.2551539846,
            date_maj: '2023-05-03',
            source: 'conseiller-numerique',
            services: Service.AccesInternetEtMaterielInformatique
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
        code_insee: '49127',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2019-01-16',
        courriels: 'commune-de-durtal@france-services.fr',
        services: Service.AccesInternetEtMaterielInformatique
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        code_insee: '49127',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'conseiller-numerique',
        services: Service.AccesInternetEtMaterielInformatique
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
            code_insee: '49127',
            commune: 'DURTAL',
            latitude: 47.671271,
            longitude: -0.256457,
            date_maj: '2023-05-03',
            source: 'conseiller-numerique',
            services: Service.AccesInternetEtMaterielInformatique
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
        code_insee: '49127',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'conseiller-numerique',
        dispositif_programmes_nationaux: DispositifProgrammeNational.FranceServices,
        services: Service.AccesInternetEtMaterielInformatique
      },
      {
        id: 'mediation-numerique-hub-lo-436-mediation-numerique',
        pivot: '00000000000000',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        code_insee: '49127',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2019-01-16',
        courriels: 'commune-de-durtal@france-services.fr',
        dispositif_programmes_nationaux: `${DispositifProgrammeNational.ConseillersNumeriques}|${DispositifProgrammeNational.CertificationPIX}`,
        services: Service.AccesInternetEtMaterielInformatique
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
            code_insee: '49127',
            commune: 'Durtal',
            latitude: 47.6699154795,
            longitude: -0.2551539846,
            date_maj: '2023-05-03',
            source: 'conseiller-numerique',
            dispositif_programmes_nationaux: `${DispositifProgrammeNational.FranceServices}|${DispositifProgrammeNational.ConseillersNumeriques}|${DispositifProgrammeNational.CertificationPIX}`,
            services: Service.AccesInternetEtMaterielInformatique
          }
        ]
      ])
    );
  });

  it('should keep national labels even if the lieu does not come from the source dispositif', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: 'France-Services_939',
        nom: 'France services Briouze',
        pivot: '00000000000000',
        services:
          'Aide aux démarches administratives|Insertion professionnelle via le numérique|Maîtrise des outils numériques du quotidien|Compréhension du monde numérique',
        typologie: 'RFS',
        commune: 'Briouze',
        code_postal: '61220',
        adresse: '5 Place du Général de Gaulle',
        code_insee: '61063',
        complement_adresse: 'Espace culturel du Houlme',
        latitude: 48.697978,
        longitude: -0.367817,
        telephone: '+33233628153',
        courriels: 'franceservicesbriouze@flers-agglo.fr',
        presentation_detail: 'Sur rendez-vous le jeudi et vendredi après-midi',
        frais_a_charge: 'Gratuit',
        itinerance: 'Fixe',
        modalites_acces: 'Téléphoner|Contacter par mail',
        dispositif_programmes_nationaux: DispositifProgrammeNational.FranceServices,
        autres_formations_labels: 'ZRR',
        horaires: 'Mo-Fr 09:00-12:30,14:00-17:00; Tu,We 09:00-12:30,14:00-18:00',
        source: 'France Services',
        date_maj: '2020-09-01'
      },
      {
        id: 'Numi_France-Services_939',
        nom: 'France services Briouze',
        pivot: '00000000000000',
        services: 'Aide aux démarches administratives|Insertion professionnelle via le numérique',
        typologie: 'RFS',
        commune: 'Briouze',
        code_postal: '61220',
        adresse: '5 Place du Général de Gaulle',
        code_insee: '61063',
        complement_adresse: 'Espace culturel du Houlme',
        latitude: 48.697978,
        longitude: -0.367817,
        telephone: '+33233628153',
        courriels: 'franceservicesbriouze@flers-agglo.fr',
        presentation_detail: 'Sur rendez-vous le jeudi et vendredi après-midi',
        frais_a_charge: 'Gratuit',
        itinerance: 'Fixe',
        modalites_acces: 'Téléphoner|Contacter par mail',
        autres_formations_labels: 'ZRR',
        horaires: 'Mo-Fr 09:00-12:30,14:00-17:00',
        source: 'Numi',
        date_maj: '2025-05-09'
      }
    ];

    const lieuxWithoutDuplicates: MergedLieuxByGroupMap = mergeDuplicates(new Date('2023-05-30'))(
      lieux,
      groupDuplicates(duplicationComparisons(lieux, false))
    );

    expect(lieuxWithoutDuplicates).toStrictEqual(
      new Map<string, SchemaLieuMediationNumerique>([
        [
          '2424fbf79b547f3075aeee10cc7800a4bb8efda6bf5e76a3791cfe6399cfd7fb',
          {
            adresse: '5 Place du Général de Gaulle',
            autres_formations_labels: 'ZRR',
            code_insee: '61063',
            code_postal: '61220',
            commune: 'Briouze',
            complement_adresse: 'Espace culturel du Houlme',
            courriels: 'franceservicesbriouze@flers-agglo.fr',
            date_maj: '2025-05-09',
            frais_a_charge: 'Gratuit',
            horaires: 'Mo-Fr 09:00-12:30,14:00-17:00',
            id: 'France-Services_939__Numi_France-Services_939',
            itinerance: 'Fixe',
            latitude: 48.697978,
            longitude: -0.367817,
            modalites_acces: 'Téléphoner|Contacter par mail',
            nom: 'France services Briouze',
            pivot: '00000000000000',
            presentation_detail: 'Sur rendez-vous le jeudi et vendredi après-midi',
            services: `${Service.AideAuxDemarchesAdministratives}|${Service.InsertionProfessionnelleViaLeNumerique}`,
            source: 'Numi',
            dispositif_programmes_nationaux: DispositifProgrammeNational.FranceServices,
            telephone: '+33233628153',
            typologie: 'RFS'
          }
        ]
      ])
    );
  });
});
