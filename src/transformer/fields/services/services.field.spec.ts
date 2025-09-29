import { describe, it, expect } from 'vitest';
import { processServices } from './services.field';
import { Service } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DataSource, LieuxMediationNumeriqueMatching } from '../../input';

const MATCHING: LieuxMediationNumeriqueMatching = {
  services: [
    {
      colonnes: [
        'À disposition',
        'Formations compétences de base proposées',
        'Comprendre et Utiliser les sites d’accès aux droits proposées',
        'Sensibilisations culture numérique'
      ],
      termes: ['réseau wifi', 'tablette', 'smartphone', 'accès libre à du matériel informatique', 'accéder à internet'],
      cible: Service.AccesInternetEtMaterielInformatique
    },
    {
      colonnes: [
        'À disposition',
        'Formations compétences de base proposées',
        'Comprendre et Utiliser les sites d’accès aux droits proposées',
        'Sensibilisations culture numérique'
      ],
      termes: ["découvrir l'ordinateur", 'cultures numériques'],
      cible: Service.MaitriseDesOutilsNumeriquesDuQuotidien
    },
    {
      colonnes: [
        'À disposition',
        'Formations compétences de base proposées',
        'Comprendre et Utiliser les sites d’accès aux droits proposées',
        'Sensibilisations culture numérique'
      ],
      termes: ['open source', 'cultures numériques', "découvrir l'ordinateur"],
      cible: Service.ComprehensionDuMondeNumerique
    },
    {
      colonnes: [
        'À disposition',
        'Formations compétences de base proposées',
        'Comprendre et Utiliser les sites d’accès aux droits proposées',
        'Sensibilisations culture numérique'
      ],
      termes: ['services de la caf', 'services des impôts', 'logement social', 'pôle emploi', 'pole-emploi.fr'],
      cible: Service.AideAuxDemarchesAdministratives
    },
    {
      colonnes: [
        'À disposition',
        'Formations compétences de base proposées',
        'Comprendre et Utiliser les sites d’accès aux droits proposées',
        'Sensibilisations culture numérique'
      ],
      termes: ['france travail', 'pôle emploi', 'pole-emploi.fr'],
      cible: Service.InsertionProfessionnelleViaLeNumerique
    },
    {
      colonnes: [
        'À disposition',
        'Formations compétences de base proposées',
        'Comprendre et Utiliser les sites d’accès aux droits proposées',
        'Sensibilisations culture numérique'
      ],
      termes: ['Éduquer avec le numérique'],
      cible: Service.ParentaliteEtEducationAvecLeNumerique
    },
    {
      colonnes: [
        'À disposition',
        'Formations compétences de base proposées',
        'Comprendre et Utiliser les sites d’accès aux droits proposées',
        'Sensibilisations culture numérique'
      ],
      termes: ['sécuriser sa navigation', "découvrir l'ordinateur"],
      cible: Service.UtilisationSecuriseeDuNumerique
    },
    {
      colonnes: [
        'À disposition',
        'Formations compétences de base proposées',
        'Comprendre et Utiliser les sites d’accès aux droits proposées',
        'Sensibilisations culture numérique'
      ],
      termes: ['Imprimante 3D', 'cultures numériques'],
      cible: Service.LoisirsEtCreationsNumeriques
    },
    {
      colonnes: [
        'À disposition',
        'Formations compétences de base proposées',
        'Comprendre et Utiliser les sites d’accès aux droits proposées',
        'Sensibilisations culture numérique'
      ],
      termes: ["S'équiper en matériel informatique"],
      cible: Service.MaterielInformatiqueAPrixSolidaire
    }
  ]
} as LieuxMediationNumeriqueMatching;

describe('services field', (): void => {
  it('should handle empty value', (): void => {
    expect((): void => {
      processServices({}, MATCHING);
    }).toThrow("Le service 'service indéfini' n'est pas une valeur admise");
  });

  it('should not find any service matching a_disposition key', (): void => {
    expect((): void => {
      processServices({ 'À disposition': '' }, MATCHING);
    }).toThrow("Le service 'service indéfini' n'est pas une valeur admise");
  });

  it('should not find any service matching formations_competences_de_base_proposees key', (): void => {
    expect((): void => {
      processServices({ 'Formations compétences de base proposées': '' }, MATCHING);
    }).toThrow("Le service 'service indéfini' n'est pas une valeur admise");
  });

  it('should not find any service matching comprendre_et_utiliser_les_sites_d’acces_aux_droits_proposees key', (): void => {
    expect((): void => {
      processServices({ 'Comprendre et Utiliser les sites d’accès aux droits proposées': '' }, MATCHING);
    }).toThrow("Le service 'service indéfini' n'est pas une valeur admise");
  });

  it('should not find any service matching sensibilisations_culture_numerique key', (): void => {
    expect((): void => {
      processServices({ 'Sensibilisations culture numérique': '' }, MATCHING);
    }).toThrow("Le service 'service indéfini' n'est pas une valeur admise");
  });

  it('should find "Accès internet et matériel informatique" service with "réseau wifi" in "À disposition" column', (): void => {
    const services: Service[] = processServices({ 'À disposition': 'réseau wifi' }, MATCHING);

    expect(services).toStrictEqual([Service.AccesInternetEtMaterielInformatique]);
  });

  it('should find "Accès internet et matériel informatique" service with "accès libre à du matériel informatique" in "À disposition" column', (): void => {
    const services: Service[] = processServices({ 'À disposition': 'accès libre à du matériel informatique' }, MATCHING);

    expect(services).toStrictEqual([Service.AccesInternetEtMaterielInformatique]);
  });

  it('should find "Maitrise des outils numériques du quotidien, Utilisation sécurisée du numérique, Comprehension du monde numérique" service', (): void => {
    const services: Service[] = processServices({ 'À disposition': "découvrir l'ordinateur" }, MATCHING);

    expect(services).toStrictEqual([
      Service.MaitriseDesOutilsNumeriquesDuQuotidien,
      Service.ComprehensionDuMondeNumerique,
      Service.UtilisationSecuriseeDuNumerique
    ]);
  });

  it('should find "Acces internet et materiel informatique" service with "tablette" value', (): void => {
    const services: Service[] = processServices({ 'À disposition': 'tablette' }, MATCHING);

    expect(services).toStrictEqual([Service.AccesInternetEtMaterielInformatique]);
  });

  it('should find "Acces internet et materiel informatique" service with "smartphone" value', (): void => {
    const services: Service[] = processServices({ 'À disposition': 'smartphone' }, MATCHING);

    expect(services).toStrictEqual([Service.AccesInternetEtMaterielInformatique]);
  });

  it('should find "Aide aux démarches administratives" services when "À disposition" contains "services de la caf"', (): void => {
    const services: Service[] = processServices({ 'À disposition': 'services de la caf' }, MATCHING);

    expect(services).toStrictEqual([Service.AideAuxDemarchesAdministratives]);
  });

  it('should find "Utiliser le numérique au quotidien,Approfondir ma culture numérique,Promouvoir la citoyenneté numérique" services', (): void => {
    const services: Service[] = processServices({ 'À disposition': 'cultures numériques' }, MATCHING);

    expect(services).toStrictEqual([
      Service.MaitriseDesOutilsNumeriquesDuQuotidien,
      Service.ComprehensionDuMondeNumerique,
      Service.LoisirsEtCreationsNumeriques
    ]);
  });

  it('should cumulate all available services', (): void => {
    const services: Service[] = processServices(
      {
        'À disposition':
          "réseau wifi, accès libre à du matériel informatique, tablette, Imprimante 3D, S'équiper en matériel informatique",
        'Comprendre et Utiliser les sites d’accès aux droits proposées':
          "services des impôts', 'logement social', 'pôle emploi",
        'Formations compétences de base proposées': "Découvrir l'ordinateur",
        'Sensibilisations culture numérique': 'Éduquer avec le numérique'
      },
      MATCHING
    );

    expect(services).toStrictEqual([
      Service.AccesInternetEtMaterielInformatique,
      Service.MaitriseDesOutilsNumeriquesDuQuotidien,
      Service.ComprehensionDuMondeNumerique,
      Service.AideAuxDemarchesAdministratives,
      Service.InsertionProfessionnelleViaLeNumerique,
      Service.ParentaliteEtEducationAvecLeNumerique,
      Service.UtilisationSecuriseeDuNumerique,
      Service.LoisirsEtCreationsNumeriques,
      Service.MaterielInformatiqueAPrixSolidaire
    ]);
  });

  it('should get only one service when there is redundancy in targeted fields', (): void => {
    const services: Service[] = processServices(
      {
        'À disposition': 'matériel informatique',
        'Sensibilisations culture numérique': 'accéder à internet'
      },
      MATCHING
    );

    expect(services).toStrictEqual([Service.AccesInternetEtMaterielInformatique]);
  });

  it('should get maitriser outils numériques du quotidien default services', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      services: [
        {
          cible: Service.MaitriseDesOutilsNumeriquesDuQuotidien
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const services: Service[] = processServices({} as DataSource, matching);

    expect(services).toStrictEqual([Service.MaitriseDesOutilsNumeriquesDuQuotidien]);
  });
});
