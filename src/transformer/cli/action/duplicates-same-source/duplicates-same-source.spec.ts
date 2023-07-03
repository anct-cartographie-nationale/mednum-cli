/* eslint-disable @typescript-eslint/naming-convention, camelcase */
import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { mergeDoublonsInSameSource } from './duplicates-same-source';

describe('merge same lieux with same sources', (): void => {
  it('should merge same lieux with same coordonnee', (): void => {
    const lieuxMediationNumerique: LieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-cd28-appui-territorial-mediation-numerique-conseiller-numerique-62b0233a8255a806e299df55-mediation-numerique-mediation-numerique',
        nom: 'Maison des Solidarités et de la Citoyenneté',
        services: 'Prendre en main un smartphone ou une tablette;Prendre en main un ordinateur',
        pivot: '00000000000000',
        commune: 'DREUX',
        code_postal: '28100',
        adresse: '5 Rue Henri Dunant',
        localisation: {
          latitude: 48.736124,
          longitude: 1.385011
        },
        conditions_acces: 'Gratuit : Je peux accéder gratuitement au lieu et à ses services',
        modalites_accompagnement: "Avec de l'aide : je suis accompagné seul dans l'usage du numérique",
        source: 'cd28-appui-territorial',
        date_maj: '2022-06-20'
      } as unknown as LieuMediationNumerique,
      {
        id: 'mediation-numerique-cd29-appui-territorial-mediation-numerique-conseiller-numerique-62b0233a8255a806e299df55-mediation-numerique-mediation-numerique',
        nom: 'Médiation Numérique',
        services: 'Utiliser le numérique au quotidien;Approfondir ma culture numérique',
        pivot: '12345678910111',
        commune: 'DREUX',
        code_postal: '28100',
        adresse: '5 Rue Henri Dunant',
        localisation: {
          latitude: 48.736124,
          longitude: 1.385011
        },
        conditions_acces: 'Gratuit : Je peux accéder gratuitement au lieu et à ses services',
        modalites_accompagnement: "Seul : j'ai accès à du matériel et une connexion",
        source: 'cd28-appui-territorial',
        date_maj: '2022-06-20'
      } as unknown as LieuMediationNumerique
    ];

    const mergedLieuMediationNumerique: LieuMediationNumerique[] = mergeDoublonsInSameSource(lieuxMediationNumerique);

    expect(mergedLieuMediationNumerique).toStrictEqual([
      {
        id: 'mediation-numerique-cd28-appui-territorial-mediation-numerique-conseiller-numerique-62b0233a8255a806e299df55-mediation-numerique-mediation-numerique',
        nom: 'Maison des Solidarités et de la Citoyenneté',
        services:
          'Prendre en main un smartphone ou une tablette;Prendre en main un ordinateur;Utiliser le numérique au quotidien;Approfondir ma culture numérique',
        pivot: '12345678910111',
        commune: 'DREUX',
        code_postal: '28100',
        adresse: '5 Rue Henri Dunant',
        localisation: {
          latitude: 48.736124,
          longitude: 1.385011
        },
        conditions_acces: 'Gratuit : Je peux accéder gratuitement au lieu et à ses services',
        modalites_accompagnement:
          "Avec de l'aide : je suis accompagné seul dans l'usage du numérique;Seul : j'ai accès à du matériel et une connexion",
        source: 'cd28-appui-territorial',
        date_maj: '2022-06-20'
      }
    ]);
  });

  it('should merge same lieux with same coordonnee and keep others lieux', (): void => {
    const lieuxMediationNumerique: LieuMediationNumerique[] = [
      {
        id: 'mediation-numerique-cd28-appui-territorial-mediation-numerique-conseiller-numerique-62b0233a8255a806e299df55-mediation-numerique-mediation-numerique',
        nom: 'Maison des Solidarités et de la Citoyenneté',
        services: 'Prendre en main un smartphone ou une tablette;Prendre en main un ordinateur',
        pivot: '00000000000000',
        commune: 'DREUX',
        code_postal: '28100',
        adresse: '5 Rue Henri Dunant',
        localisation: {
          latitude: 48.736124,
          longitude: 1.385011
        },
        conditions_acces: 'Gratuit : Je peux accéder gratuitement au lieu et à ses services',
        modalites_accompagnement: "Avec de l'aide : je suis accompagné seul dans l'usage du numérique",
        source: 'cd28-appui-territorial',
        date_maj: '2022-06-20'
      } as unknown as LieuMediationNumerique,
      {
        id: 'mediation-numerique-cd29-appui-territorial-mediation-numerique-conseiller-numerique-62b0233a8255a806e299df55-mediation-numerique-mediation-numerique',
        nom: 'Médiation Numérique',
        services: 'Utiliser le numérique au quotidien;Approfondir ma culture numérique',
        pivot: '12345678910111',
        commune: 'DREUX',
        code_postal: '28100',
        adresse: '5 Rue Henri Dunant',
        localisation: {
          latitude: 48.736124,
          longitude: 1.385011
        },
        conditions_acces: 'Gratuit : Je peux accéder gratuitement au lieu et à ses services',
        modalites_accompagnement: "Seul : j'ai accès à du matériel et une connexion",
        source: 'cd28-appui-territorial',
        date_maj: '2022-06-20'
      } as unknown as LieuMediationNumerique,
      {
        id: 'mediation-numerique-cd30-appui-territorial-mediation-numerique-conseiller-numerique-62b0233a8255a806e299df55-mediation-numerique-mediation-numerique',
        nom: 'Test',
        services: 'Utiliser le numérique au quotidien;Approfondir ma culture numérique',
        pivot: '00000000000000',
        commune: 'DREUX',
        code_postal: '28100',
        adresse: '6 Rue du test',
        localisation: {
          latitude: 48.738957,
          longitude: 1.66988
        },
        conditions_acces: 'Gratuit : Je peux accéder gratuitement au lieu et à ses services',
        modalites_accompagnement: "Seul : j'ai accès à du matériel et une connexion",
        source: 'cd28-appui-territorial',
        date_maj: '2022-06-20'
      } as unknown as LieuMediationNumerique
    ];

    const mergedLieuMediationNumerique: LieuMediationNumerique[] = mergeDoublonsInSameSource(lieuxMediationNumerique);

    expect(mergedLieuMediationNumerique).toStrictEqual([
      {
        id: 'mediation-numerique-cd28-appui-territorial-mediation-numerique-conseiller-numerique-62b0233a8255a806e299df55-mediation-numerique-mediation-numerique',
        nom: 'Maison des Solidarités et de la Citoyenneté',
        services:
          'Prendre en main un smartphone ou une tablette;Prendre en main un ordinateur;Utiliser le numérique au quotidien;Approfondir ma culture numérique',
        pivot: '12345678910111',
        commune: 'DREUX',
        code_postal: '28100',
        adresse: '5 Rue Henri Dunant',
        localisation: {
          latitude: 48.736124,
          longitude: 1.385011
        },
        conditions_acces: 'Gratuit : Je peux accéder gratuitement au lieu et à ses services',
        modalites_accompagnement:
          "Avec de l'aide : je suis accompagné seul dans l'usage du numérique;Seul : j'ai accès à du matériel et une connexion",
        source: 'cd28-appui-territorial',
        date_maj: '2022-06-20'
      },
      {
        id: 'mediation-numerique-cd30-appui-territorial-mediation-numerique-conseiller-numerique-62b0233a8255a806e299df55-mediation-numerique-mediation-numerique',
        nom: 'Test',
        services: 'Utiliser le numérique au quotidien;Approfondir ma culture numérique',
        pivot: '00000000000000',
        commune: 'DREUX',
        code_postal: '28100',
        adresse: '6 Rue du test',
        localisation: {
          latitude: 48.738957,
          longitude: 1.66988
        },
        conditions_acces: 'Gratuit : Je peux accéder gratuitement au lieu et à ses services',
        modalites_accompagnement: "Seul : j'ai accès à du matériel et une connexion",
        source: 'cd28-appui-territorial',
        date_maj: '2022-06-20'
      }
    ]);
  });
});
