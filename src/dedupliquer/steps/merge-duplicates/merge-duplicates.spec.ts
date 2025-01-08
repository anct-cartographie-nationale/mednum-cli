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
});
