/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { toLieuxMediationNumeriqueCsv } from './to-lieux-mediation-numerique-csv';

describe('output', (): void => {
  it('should convert empty schema de la médiation numérique data to CSV with headers only', (): void => {
    const csv: string = toLieuxMediationNumeriqueCsv([]);

    expect(csv).toBe(
      '"id","pivot","nom","commune","code_postal","code_insee","adresse","complement_adresse","latitude","longitude","cle_ban","typologie","telephone","courriel","site_web","horaires","presentation_resumee","presentation_detail","source","structure_parente","date_maj","services","publics_accueillis","conditions_access","labels_nationaux","labels_autres","modalites_accompagnement","accessibilite","prise_rdv"\n'
    );
  });

  it('should convert schema de la médiation numérique single data to CSV with headers and one line', (): void => {
    const csv: string = toLieuxMediationNumeriqueCsv([
      {
        accessibilite:
          'https://acceslibre.beta.gouv.fr/app/29-lampaul-plouarzel/a/bibliotheque-mediatheque/erp/mediatheque-13/',
        adresse: '12 BIS RUE DE LECLERCQ',
        cle_ban: '13001_3079_00001',
        code_insee: '51454',
        code_postal: '51100',
        commune: 'Reims',
        complement_adresse: "Le patio du bois de l'Aulne",
        conditions_access:
          "Payant : L'accès au lieu et/ou à ses services est payant;Accepte le Pass numérique : Il est possible d'utiliser un Pass numérique pour accéder au lieu",
        courriel: 'contact@laquincaillerie.tl',
        date_maj: '2022-06-02',
        horaires: 'Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00',
        id: 'structure-1',
        labels_autres: 'SudLabs;Nièvre médiation numérique',
        labels_nationaux: 'France Services;APTIC;Point relais CAF',
        latitude: 43.52609,
        longitude: 5.41423,
        modalites_accompagnement:
          "Seul : j'ai accès à du matériel et une connexion;Avec de l'aide : je suis accompagné seul dans l'usage du numérique",
        nom: 'Anonymal',
        pivot: '43493312300029',
        presentation_detail:
          "Notre parcours d'initiation permet l'acquisition de compétences numériques de base. Nous proposons également un accompagnement à destination des personnes déjà initiées qui souhaiteraient approfondir leurs connaissances. Du matériel informatique est en libre accès pour nos adhérents tous les après-midis. En plus de d'accueillir les personnes dans notre lieu en semaine (sur rendez-vous), nous assurons une permanence le samedi matin dans la médiathèque XX.",
        presentation_resumee:
          'Notre association propose des formations aux outils numériques à destination des personnes âgées.',
        prise_rdv: 'https://www.rdv-solidarites.fr/',
        publics_accueillis: 'Familles/enfants;Adultes;Déficience visuelle',
        services:
          'Devenir autonome dans les démarches administratives;Réaliser des démarches administratives avec un accompagnement;Prendre en main un smartphone ou une tablette',
        site_web: 'https://www.laquincaillerie.tl/;https://m.facebook.com/laquincaillerienumerique/',
        source: 'Hubik',
        structure_parente: 'Pôle emploi',
        telephone: '+33180059880',
        typologie: 'TIERS_LIEUX;ASSO'
      }
    ]);

    expect(csv).toBe(
      '"id","pivot","nom","commune","code_postal","code_insee","adresse","complement_adresse","latitude","longitude","cle_ban","typologie","telephone","courriel","site_web","horaires","presentation_resumee","presentation_detail","source","structure_parente","date_maj","services","publics_accueillis","conditions_access","labels_nationaux","labels_autres","modalites_accompagnement","accessibilite","prise_rdv"\n' +
        '"structure-1","43493312300029","Anonymal","Reims","51100","51454","12 BIS RUE DE LECLERCQ","Le patio du bois de l\'Aulne","43.52609","5.41423","13001_3079_00001","TIERS_LIEUX;ASSO","+33180059880","contact@laquincaillerie.tl","https://www.laquincaillerie.tl/;https://m.facebook.com/laquincaillerienumerique/","Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00","Notre association propose des formations aux outils numériques à destination des personnes âgées.","Notre parcours d\'initiation permet l\'acquisition de compétences numériques de base. Nous proposons également un accompagnement à destination des personnes déjà initiées qui souhaiteraient approfondir leurs connaissances. Du matériel informatique est en libre accès pour nos adhérents tous les après-midis. En plus de d\'accueillir les personnes dans notre lieu en semaine (sur rendez-vous), nous assurons une permanence le samedi matin dans la médiathèque XX.","Hubik","Pôle emploi","2022-06-02","Devenir autonome dans les démarches administratives;Réaliser des démarches administratives avec un accompagnement;Prendre en main un smartphone ou une tablette","Familles/enfants;Adultes;Déficience visuelle","Payant : L\'accès au lieu et/ou à ses services est payant;Accepte le Pass numérique : Il est possible d\'utiliser un Pass numérique pour accéder au lieu","France Services;APTIC;Point relais CAF","SudLabs;Nièvre médiation numérique","Seul : j\'ai accès à du matériel et une connexion;Avec de l\'aide : je suis accompagné seul dans l\'usage du numérique","https://acceslibre.beta.gouv.fr/app/29-lampaul-plouarzel/a/bibliotheque-mediatheque/erp/mediatheque-13/","https://www.rdv-solidarites.fr/"'
    );
  });

  it('should convert schema de la médiation numérique single data to CSV with headers and two lines', (): void => {
    const csv: string = toLieuxMediationNumeriqueCsv([
      {
        accessibilite:
          'https://acceslibre.beta.gouv.fr/app/29-lampaul-plouarzel/a/bibliotheque-mediatheque/erp/mediatheque-13/',
        adresse: '12 BIS RUE DE LECLERCQ',
        cle_ban: '13001_3079_00001',
        code_insee: '51454',
        code_postal: '51100',
        commune: 'Reims',
        complement_adresse: "Le patio du bois de l'Aulne",
        conditions_access:
          "Payant : L'accès au lieu et/ou à ses services est payant;Accepte le Pass numérique : Il est possible d'utiliser un Pass numérique pour accéder au lieu",
        courriel: 'contact@laquincaillerie.tl',
        date_maj: '2022-06-02',
        horaires: 'Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00',
        id: 'structure-1',
        labels_autres: 'SudLabs;Nièvre médiation numérique',
        labels_nationaux: 'France Services;APTIC;Point relais CAF',
        latitude: 43.52609,
        longitude: 5.41423,
        modalites_accompagnement:
          "Seul : j'ai accès à du matériel et une connexion;Avec de l'aide : je suis accompagné seul dans l'usage du numérique",
        nom: 'Anonymal',
        pivot: '43493312300029',
        presentation_detail:
          "Notre parcours d'initiation permet l'acquisition de compétences numériques de base. Nous proposons également un accompagnement à destination des personnes déjà initiées qui souhaiteraient approfondir leurs connaissances. Du matériel informatique est en libre accès pour nos adhérents tous les après-midis. En plus de d'accueillir les personnes dans notre lieu en semaine (sur rendez-vous), nous assurons une permanence le samedi matin dans la médiathèque XX.",
        presentation_resumee:
          'Notre association propose des formations aux outils numériques à destination des personnes âgées.',
        prise_rdv: 'https://www.rdv-solidarites.fr/',
        publics_accueillis: 'Familles/enfants;Adultes;Déficience visuelle',
        services:
          'Devenir autonome dans les démarches administratives;Réaliser des démarches administratives avec un accompagnement;Prendre en main un smartphone ou une tablette',
        site_web: 'https://www.laquincaillerie.tl/;https://m.facebook.com/laquincaillerienumerique/',
        source: 'Hubik',
        structure_parente: 'Pôle emploi',
        telephone: '+33180059880',
        typologie: 'TIERS_LIEUX;ASSO'
      },
      {
        adresse: '51 rue de la république',
        code_postal: '75013',
        commune: 'Paris',
        date_maj: '2022-11-07',
        id: 'structure-2',
        nom: 'Médiation république',
        pivot: '43497452600012',
        services:
          'Devenir autonome dans les démarches administratives;Réaliser des démarches administratives avec un accompagnement'
      }
    ]);

    expect(csv).toBe(
      '"id","pivot","nom","commune","code_postal","code_insee","adresse","complement_adresse","latitude","longitude","cle_ban","typologie","telephone","courriel","site_web","horaires","presentation_resumee","presentation_detail","source","structure_parente","date_maj","services","publics_accueillis","conditions_access","labels_nationaux","labels_autres","modalites_accompagnement","accessibilite","prise_rdv"\n' +
        '"structure-1","43493312300029","Anonymal","Reims","51100","51454","12 BIS RUE DE LECLERCQ","Le patio du bois de l\'Aulne","43.52609","5.41423","13001_3079_00001","TIERS_LIEUX;ASSO","+33180059880","contact@laquincaillerie.tl","https://www.laquincaillerie.tl/;https://m.facebook.com/laquincaillerienumerique/","Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00","Notre association propose des formations aux outils numériques à destination des personnes âgées.","Notre parcours d\'initiation permet l\'acquisition de compétences numériques de base. Nous proposons également un accompagnement à destination des personnes déjà initiées qui souhaiteraient approfondir leurs connaissances. Du matériel informatique est en libre accès pour nos adhérents tous les après-midis. En plus de d\'accueillir les personnes dans notre lieu en semaine (sur rendez-vous), nous assurons une permanence le samedi matin dans la médiathèque XX.","Hubik","Pôle emploi","2022-06-02","Devenir autonome dans les démarches administratives;Réaliser des démarches administratives avec un accompagnement;Prendre en main un smartphone ou une tablette","Familles/enfants;Adultes;Déficience visuelle","Payant : L\'accès au lieu et/ou à ses services est payant;Accepte le Pass numérique : Il est possible d\'utiliser un Pass numérique pour accéder au lieu","France Services;APTIC;Point relais CAF","SudLabs;Nièvre médiation numérique","Seul : j\'ai accès à du matériel et une connexion;Avec de l\'aide : je suis accompagné seul dans l\'usage du numérique","https://acceslibre.beta.gouv.fr/app/29-lampaul-plouarzel/a/bibliotheque-mediatheque/erp/mediatheque-13/","https://www.rdv-solidarites.fr/"\n' +
        '"structure-2","43497452600012","Médiation république","Paris","75013",,"51 rue de la république",,,,,,,,,,,,,,"2022-11-07","Devenir autonome dans les démarches administratives;Réaliser des démarches administratives avec un accompagnement",,,,,,,'
    );
  });

  it('should convert schema de la médiation numérique single data to CSV with headers and a name containing forbidden "', (): void => {
    const csv: string = toLieuxMediationNumeriqueCsv([
      {
        adresse: '51 rue de la république',
        code_postal: '75013',
        commune: 'Paris',
        date_maj: '2022-11-07',
        id: 'structure-2',
        nom: 'Médiation république "MRPP"',
        pivot: '43497452600012',
        services:
          'Devenir autonome dans les démarches administratives;Réaliser des démarches administratives avec un accompagnement'
      }
    ]);

    expect(csv).toBe(
      '"id","pivot","nom","commune","code_postal","code_insee","adresse","complement_adresse","latitude","longitude","cle_ban","typologie","telephone","courriel","site_web","horaires","presentation_resumee","presentation_detail","source","structure_parente","date_maj","services","publics_accueillis","conditions_access","labels_nationaux","labels_autres","modalites_accompagnement","accessibilite","prise_rdv"\n' +
        '"structure-2","43497452600012","Médiation république MRPP","Paris","75013",,"51 rue de la république",,,,,,,,,,,,,,"2022-11-07","Devenir autonome dans les démarches administratives;Réaliser des démarches administratives avec un accompagnement",,,,,,,'
    );
  });
});
