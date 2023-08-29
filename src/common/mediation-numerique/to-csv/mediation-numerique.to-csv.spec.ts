/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { mediationNumeriqueToCsv } from './mediation-numerique.to-csv';

describe('output', (): void => {
  it('should convert empty schema de la médiation numérique data to CSV with headers only', (): void => {
    const csv: string = mediationNumeriqueToCsv([]);

    expect(csv).toBe(
      '"id","pivot","nom","commune","code_postal","code_insee","adresse","complement_adresse","latitude","longitude","cle_ban","typologie","telephone","courriel","site_web","horaires","presentation_resume","presentation_detail","source","structure_parente","date_maj","services","publics_accueillis","conditions_acces","labels_nationaux","labels_autres","modalites_accompagnement","accessibilite","prise_rdv"\n'
    );
  });

  it('should convert schema de la médiation numérique single data to CSV with headers and one line', (): void => {
    const csv: string = mediationNumeriqueToCsv([
      {
        accessibilite:
          'https://acceslibre.beta.gouv.fr/app/29-lampaul-plouarzel/a/bibliotheque-mediatheque/erp/mediatheque-13/',
        adresse: '12 BIS RUE DE LECLERCQ',
        cle_ban: '13001_3079_00001',
        code_insee: '51454',
        code_postal: '51100',
        commune: 'Reims',
        complement_adresse: "Le patio du bois de l'Aulne",
        conditions_acces:
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
        presentation_resume:
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
      '"id","pivot","nom","commune","code_postal","code_insee","adresse","complement_adresse","latitude","longitude","cle_ban","typologie","telephone","courriel","site_web","horaires","presentation_resume","presentation_detail","source","structure_parente","date_maj","services","publics_accueillis","conditions_acces","labels_nationaux","labels_autres","modalites_accompagnement","accessibilite","prise_rdv"\n' +
        '"structure-1","43493312300029","Anonymal","Reims","51100","51454","12 BIS RUE DE LECLERCQ","Le patio du bois de l\'Aulne","43.52609","5.41423","13001_3079_00001","TIERS_LIEUX;ASSO","+33180059880","contact@laquincaillerie.tl","https://www.laquincaillerie.tl/;https://m.facebook.com/laquincaillerienumerique/","Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00","Notre association propose des formations aux outils numériques à destination des personnes âgées.","Notre parcours d\'initiation permet l\'acquisition de compétences numériques de base. Nous proposons également un accompagnement à destination des personnes déjà initiées qui souhaiteraient approfondir leurs connaissances. Du matériel informatique est en libre accès pour nos adhérents tous les après-midis. En plus de d\'accueillir les personnes dans notre lieu en semaine (sur rendez-vous), nous assurons une permanence le samedi matin dans la médiathèque XX.","Hubik","Pôle emploi","2022-06-02","Devenir autonome dans les démarches administratives;Réaliser des démarches administratives avec un accompagnement;Prendre en main un smartphone ou une tablette","Familles/enfants;Adultes;Déficience visuelle","Payant : L\'accès au lieu et/ou à ses services est payant;Accepte le Pass numérique : Il est possible d\'utiliser un Pass numérique pour accéder au lieu","France Services;APTIC;Point relais CAF","SudLabs;Nièvre médiation numérique","Seul : j\'ai accès à du matériel et une connexion;Avec de l\'aide : je suis accompagné seul dans l\'usage du numérique","https://acceslibre.beta.gouv.fr/app/29-lampaul-plouarzel/a/bibliotheque-mediatheque/erp/mediatheque-13/","https://www.rdv-solidarites.fr/"'
    );
  });

  it('should convert schema de la médiation numérique single data to CSV with headers and two lines', (): void => {
    const csv: string = mediationNumeriqueToCsv([
      {
        accessibilite:
          'https://acceslibre.beta.gouv.fr/app/29-lampaul-plouarzel/a/bibliotheque-mediatheque/erp/mediatheque-13/',
        adresse: '12 BIS RUE DE LECLERCQ',
        cle_ban: '13001_3079_00001',
        code_insee: '51454',
        code_postal: '51100',
        commune: 'Reims',
        complement_adresse: "Le patio du bois de l'Aulne",
        conditions_acces:
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
        presentation_resume:
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
      '"id","pivot","nom","commune","code_postal","code_insee","adresse","complement_adresse","latitude","longitude","cle_ban","typologie","telephone","courriel","site_web","horaires","presentation_resume","presentation_detail","source","structure_parente","date_maj","services","publics_accueillis","conditions_acces","labels_nationaux","labels_autres","modalites_accompagnement","accessibilite","prise_rdv"\n' +
        '"structure-1","43493312300029","Anonymal","Reims","51100","51454","12 BIS RUE DE LECLERCQ","Le patio du bois de l\'Aulne","43.52609","5.41423","13001_3079_00001","TIERS_LIEUX;ASSO","+33180059880","contact@laquincaillerie.tl","https://www.laquincaillerie.tl/;https://m.facebook.com/laquincaillerienumerique/","Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00","Notre association propose des formations aux outils numériques à destination des personnes âgées.","Notre parcours d\'initiation permet l\'acquisition de compétences numériques de base. Nous proposons également un accompagnement à destination des personnes déjà initiées qui souhaiteraient approfondir leurs connaissances. Du matériel informatique est en libre accès pour nos adhérents tous les après-midis. En plus de d\'accueillir les personnes dans notre lieu en semaine (sur rendez-vous), nous assurons une permanence le samedi matin dans la médiathèque XX.","Hubik","Pôle emploi","2022-06-02","Devenir autonome dans les démarches administratives;Réaliser des démarches administratives avec un accompagnement;Prendre en main un smartphone ou une tablette","Familles/enfants;Adultes;Déficience visuelle","Payant : L\'accès au lieu et/ou à ses services est payant;Accepte le Pass numérique : Il est possible d\'utiliser un Pass numérique pour accéder au lieu","France Services;APTIC;Point relais CAF","SudLabs;Nièvre médiation numérique","Seul : j\'ai accès à du matériel et une connexion;Avec de l\'aide : je suis accompagné seul dans l\'usage du numérique","https://acceslibre.beta.gouv.fr/app/29-lampaul-plouarzel/a/bibliotheque-mediatheque/erp/mediatheque-13/","https://www.rdv-solidarites.fr/"\n' +
        '"structure-2","43497452600012","Médiation république","Paris","75013",,"51 rue de la république",,,,,,,,,,,,,,"2022-11-07","Devenir autonome dans les démarches administratives;Réaliser des démarches administratives avec un accompagnement",,,,,,,'
    );
  });

  it('should convert schema de la médiation numérique single data to CSV with headers and a name containing forbidden "', (): void => {
    const csv: string = mediationNumeriqueToCsv([
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
      '"id","pivot","nom","commune","code_postal","code_insee","adresse","complement_adresse","latitude","longitude","cle_ban","typologie","telephone","courriel","site_web","horaires","presentation_resume","presentation_detail","source","structure_parente","date_maj","services","publics_accueillis","conditions_acces","labels_nationaux","labels_autres","modalites_accompagnement","accessibilite","prise_rdv"\n' +
        '"structure-2","43497452600012","Médiation république MRPP","Paris","75013",,"51 rue de la république",,,,,,,,,,,,,,"2022-11-07","Devenir autonome dans les démarches administratives;Réaliser des démarches administratives avec un accompagnement",,,,,,,'
    );
  });

  it('should convert schema de la médiation numérique single data to CSV with headers and no offset cause of doble quote', (): void => {
    const csv: string = mediationNumeriqueToCsv([
      {
        id: '36',
        nom: 'Pole Emploi Biarritz (permanence St Palais)',
        services:
          'Accéder à une connexion internet;Prendre en main un ordinateur;Accéder à du matériel;Approfondir ma culture numérique;Créer avec le numérique;Promouvoir la citoyenneté numérique;Utiliser le numérique au quotidien;Favoriser mon insertion professionnelle',
        pivot: '00000000000000',
        commune: 'Saint Palais',
        code_postal: '64120',
        adresse: 'Maison France Service',
        latitude: 43.323496,
        longitude: -1.037223,
        courriel: 'ape.64062@pole-emploi.fr',
        site_web: 'https://www.pole-emploi.fr/',
        presentation_detail:
          '2 postes en libre acces avec imprimantes - scanners. Acces aux principaux sites de services publics.\nAteliers d\'utilisation de "pole-emploi.fr"\nPrescription de formation "HSP socle - les savoirs',
        publics_accueillis: 'Jeunes (16-26 ans);Adultes;Seniors (+ 65 ans)',
        conditions_acces: 'Gratuit : Je peux accéder gratuitement au lieu et à ses services',
        modalites_accompagnement: "Avec de l'aide : je suis accompagné seul dans l'usage du numérique",
        source: 'Fibre 64',
        date_maj: '1969-12-31'
      }
    ]);

    expect(csv).toBe(
      '"id","pivot","nom","commune","code_postal","code_insee","adresse","complement_adresse","latitude","longitude","cle_ban","typologie","telephone","courriel","site_web","horaires","presentation_resume","presentation_detail","source","structure_parente","date_maj","services","publics_accueillis","conditions_acces","labels_nationaux","labels_autres","modalites_accompagnement","accessibilite","prise_rdv"\n' +
        '"36","00000000000000","Pole Emploi Biarritz (permanence St Palais)","Saint Palais","64120",,"Maison France Service",,"43.323496","-1.037223",,,,"ape.64062@pole-emploi.fr","https://www.pole-emploi.fr/",,,"2 postes en libre acces avec imprimantes - scanners. Acces aux principaux sites de services publics.Ateliers d\'utilisation de pole-emploi.frPrescription de formation HSP socle - les savoirs","Fibre 64",,"1969-12-31","Accéder à une connexion internet;Prendre en main un ordinateur;Accéder à du matériel;Approfondir ma culture numérique;Créer avec le numérique;Promouvoir la citoyenneté numérique;Utiliser le numérique au quotidien;Favoriser mon insertion professionnelle","Jeunes (16-26 ans);Adultes;Seniors (+ 65 ans)","Gratuit : Je peux accéder gratuitement au lieu et à ses services",,,"Avec de l\'aide : je suis accompagné seul dans l\'usage du numérique",,'
    );
  });

  it('should convert schema de la médiation numérique single data to CSV with headers and not offset in horraires field', (): void => {
    const csv: string = mediationNumeriqueToCsv([
      {
        id: '8fffbaf6-56e2-4501-958a-25dc56a572a4',
        nom: 'EMMAUS CONNECT FONDATEUR ABBE PIERRE',
        services:
          'Prendre en main un smartphone ou une tablette;Prendre en main un ordinateur;Utiliser le numérique au quotidien;Approfondir ma culture numérique',
        pivot: '79227291600042',
        typologie: 'ASSO',
        commune: 'Lille',
        code_postal: '59000',
        adresse: "83 Rue de l'Abbé Aerts",
        code_insee: '59350',
        latitude: 50.624933,
        longitude: 3.051349,
        telephone: '+33180059880',
        courriel: 'cslille@emmaus-connect.org',
        site_web: 'https://emmaus-connect.org/',
        presentation_resume: 'Faire du numérique une chance pour tous.',
        presentation_detail:
          'Emmaüs Connect agit depuis 2013 pour permettre aux personnes en situation de précarité sociale et numérique d’accéder aux outils en ligne devenus indispensables. Être coupé d’internet aujourd’hui, c’est être exclu de services essentiels de la vie quotidienne, c’est s’éloigner du retour à l’emploi, du lien social.<br><br>**L’association a la particularité de travailler sur les 3 aspects de la précarité numérique : l’accès au matériel, l’accès aux moyens de connexion et l’accompagnement vers des compétences essentielles.**A ce jour, plus de 135 000 personnes ont pu être aidées au sein de nos [lieux d’accueil](<https://emmaus-connect.org/nous-trouver/>) ou de Relais Numériques partenaires.L’association propose également des [formations et des outils](<https://emmaus-connect.org/formations-professionnels/>) aux acteurs sociaux et opérateurs de services publics pour transmettre ses méthodes avec l’ambition de changer d’échelle dans l’inclusion numérique sur tout le territoire.',
        conditions_acces: 'Gratuit : Je peux accéder gratuitement au lieu et à ses services',
        modalites_accompagnement: "Avec de l'aide : je suis accompagné seul dans l'usage du numérique",
        labels_nationaux: 'CNFS;APTIC',
        horaires:
          'Tu 09:15-18:30;We 09:15-18:30;Th 09:15-18:30;Fr 09:15-18:30;Sa 09:15-12:30; "fermé au public les lundis, horaires variables"',
        source: 'dora',
        date_maj: '2023-06-22'
      }
    ]);

    expect(csv).toBe(
      '"id","pivot","nom","commune","code_postal","code_insee","adresse","complement_adresse","latitude","longitude","cle_ban","typologie","telephone","courriel","site_web","horaires","presentation_resume","presentation_detail","source","structure_parente","date_maj","services","publics_accueillis","conditions_acces","labels_nationaux","labels_autres","modalites_accompagnement","accessibilite","prise_rdv"\n' +
        '"8fffbaf6-56e2-4501-958a-25dc56a572a4","79227291600042","EMMAUS CONNECT FONDATEUR ABBE PIERRE","Lille","59000","59350","83 Rue de l\'Abbé Aerts",,"50.624933","3.051349",,"ASSO","+33180059880","cslille@emmaus-connect.org","https://emmaus-connect.org/","Tu 09:15-18:30;We 09:15-18:30;Th 09:15-18:30;Fr 09:15-18:30;Sa 09:15-12:30; fermé au public les lundis, horaires variables","Faire du numérique une chance pour tous.","Emmaüs Connect agit depuis 2013 pour permettre aux personnes en situation de précarité sociale et numérique d’accéder aux outils en ligne devenus indispensables. Être coupé d’internet aujourd’hui, c’est être exclu de services essentiels de la vie quotidienne, c’est s’éloigner du retour à l’emploi, du lien social.<br><br>**L’association a la particularité de travailler sur les 3 aspects de la précarité numérique : l’accès au matériel, l’accès aux moyens de connexion et l’accompagnement vers des compétences essentielles.**A ce jour, plus de 135 000 personnes ont pu être aidées au sein de nos [lieux d’accueil](<https://emmaus-connect.org/nous-trouver/>) ou de Relais Numériques partenaires.L’association propose également des [formations et des outils](<https://emmaus-connect.org/formations-professionnels/>) aux acteurs sociaux et opérateurs de services publics pour transmettre ses méthodes avec l’ambition de changer d’échelle dans l’inclusion numérique sur tout le territoire.","dora",,"2023-06-22","Prendre en main un smartphone ou une tablette;Prendre en main un ordinateur;Utiliser le numérique au quotidien;Approfondir ma culture numérique",,"Gratuit : Je peux accéder gratuitement au lieu et à ses services","CNFS;APTIC",,"Avec de l\'aide : je suis accompagné seul dans l\'usage du numérique",,'
    );
  });
});
