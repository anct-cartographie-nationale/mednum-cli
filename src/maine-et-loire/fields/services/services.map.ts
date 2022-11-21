import { ModaliteAccompagnement, Service } from '@gouvfr-anct/lieux-de-mediation-numerique';

export const SERVICES_MAP_MAINE_ET_LOIRE: Map<
  Service,
  { keywords: string[]; modalitesAccompagnement?: ModaliteAccompagnement }
> = new Map([
  [Service.AccederAUneConnexionInternet, { keywords: ['accès internet', 'initiation aux outils numériques', 'wifi'] }],
  [
    Service.AccederADuMateriel,
    {
      keywords: [
        'accès internet',
        'initiation aux outils numériques',
        'jt_mat_imp',
        'jt_mat_sca',
        'jt_mat_bor',
        'jt_mat_3d',
        'jt_mat_vid'
      ]
    }
  ],
  [
    Service.PrendreEnMainUnOrdinateur,
    {
      keywords: ['accès internet', 'initiation aux outils numériques']
    }
  ],
  [
    Service.UtiliserLeNumerique,
    {
      keywords: ['accès internet', 'initiation aux outils numériques']
    }
  ],
  [
    Service.ApprofondirMaCultureNumerique,
    {
      keywords: ['initiation aux outils numériques']
    }
  ],
  [Service.PrendreEnMainUnSmartphoneOuUneTablette, { keywords: [] }],
  [
    Service.PromouvoirLaCitoyenneteNumerique,
    {
      keywords: ['initiation aux outils numériques']
    }
  ],
  [Service.AccompagnerLesDemarchesDeSante, { keywords: ['démarches générales'] }],
  [Service.DevenirAutonomeDansLesDemarchesAdministratives, { keywords: ['démarches générales'] }],
  [Service.RealiserDesDemarchesAdministratives, { keywords: ['démarches générales'] }]
]);
