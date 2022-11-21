import { ModaliteAccompagnement, Service } from '@gouvfr-anct/lieux-de-mediation-numerique';

export const SERVICES_MAP_HINAURA: Map<Service, { keywords: string[]; modalitesAccompagnement?: ModaliteAccompagnement }> =
  new Map([
    [Service.AccederAUneConnexionInternet, { keywords: ['réseau wifi'] }],
    [Service.AccederADuMateriel, { keywords: ['accès libre à du matériel informatique'] }],
    [Service.PrendreEnMainUnOrdinateur, { keywords: ["découvrir l'ordinateur"] }],
    [Service.UtiliserLeNumerique, { keywords: ["découvrir l'ordinateur", 'cultures numériques'] }],
    [Service.ApprofondirMaCultureNumerique, { keywords: ["découvrir l'ordinateur", 'cultures numériques'] }],
    [Service.PrendreEnMainUnSmartphoneOuUneTablette, { keywords: ['tablette', 'smartphone'] }],
    [Service.PromouvoirLaCitoyenneteNumerique, { keywords: ['cultures numériques'] }],
    [Service.AccompagnerLesDemarchesDeSante, { keywords: ['cpam', 'ameli.fr'] }],
    [
      Service.DevenirAutonomeDansLesDemarchesAdministratives,
      {
        keywords: ['services de la caf', 'services des impôts', 'logement social', 'pôle emploi', 'pole-emploi.fr'],
        modalitesAccompagnement: ModaliteAccompagnement.Seul
      }
    ],
    [
      Service.RealiserDesDemarchesAdministratives,
      {
        keywords: ['services de la caf', 'services des impôts', 'logement social', 'pôle emploi', 'pole-emploi.fr'],
        modalitesAccompagnement: ModaliteAccompagnement.AvecDeLAide
      }
    ]
  ]);
