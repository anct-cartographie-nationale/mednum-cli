/* eslint-disable @typescript-eslint/naming-convention, camelcase */
import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { keepOneEntryPerSource } from './duplicates-same-source';

describe('merge same lieux with same sources', (): void => {
  it('should keep only one lieu if doublons', (): void => {
    const lieuxMediationNumerique: LieuMediationNumerique[] = [
      {
        id: 43,
        nom: 'A.S.C Bellevue Naugeat ',
        services: 'Accéder à une connexion internet',
        pivot: '00000000000000',
        adresse: {
          code_postal: '87000',
          commune: 'Limoges',
          voie: '1 Allée Rossini 87000 Limoges'
        },
        localisation: {
          latitude: 45.8182020037582,
          longitude: 1.247903624910087
        },
        telephone: '+33555331259',
        site_web: 'https://ascbellevue.fr/activites/insertion/',
        presentation_detail: 'Accompagnement réalisé par un travailleur social',
        conditions_acces:
          "Gratuit : Je peux accéder gratuitement au lieu et à ses services;Adhésion : L'accès au lieu et/ou à ses services nécessite d'y adhérer;Accepte le Pass numérique : Il est possible d'utiliser un Pass numérique pour accéder au lieu",
        modalites_accompagnement: "Avec de l'aide : je suis accompagné seul dans l'usage du numérique",
        labels_nationaux: 'APTIC',
        source: 'Haute-Vienne',
        date_maj: '1969-12-31'
      } as unknown as LieuMediationNumerique,
      {
        id: 44,
        nom: 'A.S.C Bellevue Naugeat ',
        services: 'Accéder à du matériel',
        pivot: '00000000000000',
        adresse: {
          code_postal: '87000',
          commune: 'Limoges',
          voie: '1 Allée Rossini 87000 Limoges'
        },
        localisation: {
          latitude: 45.8182020037582,
          longitude: 1.247903624910087
        },
        telephone: '+33555331259',
        site_web: 'https://ascbellevue.fr/activites/insertion/',
        presentation_detail: 'Accompagnement réalisé par un travailleur social',
        conditions_acces:
          "Gratuit : Je peux accéder gratuitement au lieu et à ses services;Adhésion : L'accès au lieu et/ou à ses services nécessite d'y adhérer;Accepte le Pass numérique : Il est possible d'utiliser un Pass numérique pour accéder au lieu",
        modalites_accompagnement: "Avec de l'aide : je suis accompagné seul dans l'usage du numérique",
        labels_nationaux: 'APTIC',
        source: 'Haute-Vienne',
        date_maj: '1969-12-31'
      } as unknown as LieuMediationNumerique,
      {
        id: 45,
        nom: 'A.S.C Bellevue Naugeat ',
        services: 'Favoriser mon insertion professionnelle',
        pivot: '00000000000000',
        adresse: {
          code_postal: '87000',
          commune: 'Limoges',
          voie: '1 Allée Rossini 87000 Limoges'
        },
        localisation: {
          latitude: 45.8182020037582,
          longitude: 1.247903624910087
        },
        telephone: '+33555331259',
        site_web: 'https://ascbellevue.fr/activites/insertion/',
        presentation_detail:
          "Aide à la recherche d'emploi, à la rédaction de CV et de lettres de motivation. Mise en relation avec d'autres structures de l'emploi et de l'insertion.",
        publics_accueillis: 'Jeunes (16-26 ans);Familles/enfants;Adultes;Seniors (+ 65 ans)',
        conditions_acces:
          "Adhésion : L'accès au lieu et/ou à ses services nécessite d'y adhérer;Accepte le Pass numérique : Il est possible d'utiliser un Pass numérique pour accéder au lieu",
        modalites_accompagnement: "Avec de l'aide : je suis accompagné seul dans l'usage du numérique",
        labels_nationaux: 'APTIC',
        source: 'Haute-Vienne',
        date_maj: '1969-12-31'
      } as unknown as LieuMediationNumerique,
      {
        id: 46,
        nom: 'A.S.C Bellevue Naugeat ',
        services: 'Réaliser des démarches administratives avec un accompagnement',
        pivot: '00000000000000',
        adresse: {
          code_postal: '87000',
          commune: 'Limoges',
          voie: '1 Allée Rossini 87000 Limoges'
        },
        localisation: {
          latitude: 45.8182020037582,
          longitude: 1.247903624910087
        },
        telephone: '+33555331259',
        site_web: 'https://ascbellevue.fr/activites/insertion/',
        publics_accueillis: 'Jeunes (16-26 ans);Familles/enfants;Adultes;Seniors (+ 65 ans)',
        conditions_acces:
          "Adhésion : L'accès au lieu et/ou à ses services nécessite d'y adhérer;Accepte le Pass numérique : Il est possible d'utiliser un Pass numérique pour accéder au lieu",
        modalites_accompagnement: "Avec de l'aide : je suis accompagné seul dans l'usage du numérique",
        labels_nationaux: 'APTIC',
        source: 'Haute-Vienne',
        date_maj: '1969-12-31'
      } as unknown as LieuMediationNumerique
    ];

    const mergedLieuMediationNumerique: LieuMediationNumerique[] = keepOneEntryPerSource(lieuxMediationNumerique);

    expect(mergedLieuMediationNumerique).toStrictEqual([
      {
        id: 43,
        nom: 'A.S.C Bellevue Naugeat ',
        services: 'Accéder à une connexion internet',
        pivot: '00000000000000',
        adresse: {
          code_postal: '87000',
          commune: 'Limoges',
          voie: '1 Allée Rossini 87000 Limoges'
        },
        localisation: {
          latitude: 45.8182020037582,
          longitude: 1.247903624910087
        },
        telephone: '+33555331259',
        site_web: 'https://ascbellevue.fr/activites/insertion/',
        presentation_detail: 'Accompagnement réalisé par un travailleur social',
        conditions_acces:
          "Gratuit : Je peux accéder gratuitement au lieu et à ses services;Adhésion : L'accès au lieu et/ou à ses services nécessite d'y adhérer;Accepte le Pass numérique : Il est possible d'utiliser un Pass numérique pour accéder au lieu",
        modalites_accompagnement: "Avec de l'aide : je suis accompagné seul dans l'usage du numérique",
        labels_nationaux: 'APTIC',
        source: 'Haute-Vienne',
        date_maj: '1969-12-31'
      }
    ]);
  });
});
