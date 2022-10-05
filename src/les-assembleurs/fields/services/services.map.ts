/* eslint-disable max-lines */

import { ModaliteAccompagnement, Service } from '@gouvfr-anct/lieux-de-mediation-numerique';

export const SERVICES_MAP: Map<Service, { keywords: string[]; modalitesAccompagnement?: ModaliteAccompagnement }> = new Map([
  [
    Service.AccederAUneConnexionInternet,
    {
      keywords: [
        'réseaux sociaux',
        'développement web',
        "initiation à l'informatique",
        'navigation internet',
        'utilisation du poste informatique',
        'publication de contenus en ligne'
      ]
    }
  ],
  [
    Service.AccederADuMateriel,
    {
      keywords: [
        'poste informatique',
        'réseaux sociaux',
        'développement web',
        "initiation à l'informatique",
        'imprimantes',
        'scanner',
        'tablette',
        'téléphone',
        "découverte de l'ordinateur",
        'utilisation du poste informatique'
      ]
    }
  ],
  [
    Service.PrendreEnMainUnOrdinateur,
    {
      keywords: [
        'poste informatique',
        'développement web',
        "initiation à l'informatique",
        'outil informatique',
        "découverte de l'ordinateur",
        'utilisation du poste informatique',
        'navigation sur le web'
      ]
    }
  ],
  [
    Service.UtiliserLeNumerique,
    {
      keywords: [
        'poste informatique',
        'réseaux sociaux',
        'développement web',
        'usages du numérique',
        'cultures',
        "initiation à l'informatique",
        'outil informatique',
        'cours informatiques',
        "découverte de l'ordinateur",
        'utilisation du poste informatique',
        'navigation sur le web'
      ]
    }
  ],
  [
    Service.ApprofondirMaCultureNumerique,
    {
      keywords: [
        'poste informatique',
        'réseaux sociaux',
        'cultures',
        'développement web',
        'usages du numérique',
        "initiation à l'informatique",
        'outil informatique',
        'cours informatiques',
        "découverte de l'ordinateur",
        'renforcement du numérique',
        'navigation sur le web'
      ]
    }
  ],
  [Service.PrendreEnMainUnSmartphoneOuUneTablette, { keywords: ['tablette', 'smartphone', 'téléphone'] }],
  [
    Service.PromouvoirLaCitoyenneteNumerique,
    {
      keywords: [
        'citoyenneté',
        'usages du numérique',
        'cultures',
        "initiation à l'informatique",
        'cours informatiques',
        'renforcement du numérique',
        'navigation sur le web'
      ]
    }
  ],
  [
    Service.AccompagnerLesDemarchesDeSante,
    { keywords: ['santé', 'sécurité sociale', "caisse nationale d'assurance maladie", 'démarches maladie'] }
  ],
  [
    Service.DevenirAutonomeDansLesDemarchesAdministratives,
    {
      keywords: [
        'caf',
        'caf.fr',
        'caisse nationale des allocations familiales',
        'caisse centrale de la mutualité sociale agricole',
        "caisse nationale d'assurance vieillesse",
        'cnav',
        'msa',
        'emploi',
        'citoyenneté',
        'social',
        'retraite',
        'fiscalité',
        'justice',
        'étrangers',
        'logement',
        'transports',
        'loisirs',
        'accès libre',
        'démarches administratives',
        'administrations',
        'démarches',
        'accompagnement individuel',
        'services dématérialisés'
      ],
      modalitesAccompagnement: ModaliteAccompagnement.Seul
    }
  ],
  [
    Service.RealiserDesDemarchesAdministratives,
    {
      keywords: [
        'caf',
        'caf.fr',
        'caisse nationale des allocations familiales',
        'caisse centrale de la mutualité sociale agricole',
        "caisse nationale d'assurance vieillesse",
        'cnav',
        'msa',
        'emploi',
        'citoyenneté',
        'social',
        'retraite',
        'fiscalité',
        'justice',
        'étrangers',
        'logement',
        'transports',
        'loisirs',
        'accès libre',
        'démarches administratives',
        'administrations',
        'démarches',
        'services dématérialisés'
      ],
      modalitesAccompagnement: ModaliteAccompagnement.AvecDeLAide
    }
  ]
]);
