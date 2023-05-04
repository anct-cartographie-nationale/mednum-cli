/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import {
  SchemaServiceDataInclusion,
  SchemaStructureDataInclusion,
  SchemaStructureDataInclusionAdresseFields,
  SchemaStructureDataInclusionLocalisationFields,
  Typologie
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DataInclusionMerged } from './data-inclusion-merged';
import { structuresWithServicesNumeriques } from './merge-services-in-structure';

describe('merge services in structure', (): void => {
  it('should merge a single service in a single structure', (): void => {
    const structure: SchemaStructureDataInclusion = {
      adresse: '51 rue de la république',
      code_postal: '75013',
      commune: 'Paris',
      date_maj: '2022-11-07',
      id: 'structure-1',
      nom: 'Médiation république',
      siret: '43493312300029',
      source: 'cnfs'
    };

    const service: SchemaServiceDataInclusion = {
      id: 'structure-1-mediation-numerique',
      nom: 'Médiation numérique',
      source: 'cnfs',
      structure_id: 'structure-1',
      thematiques: ['numerique--devenir-autonome-dans-les-demarches-administratives']
    };

    const dataInclusionMerged: DataInclusionMerged[] = structuresWithServicesNumeriques([structure], [service]);

    expect(dataInclusionMerged).toStrictEqual<DataInclusionMerged[]>([
      {
        code_postal: '75013',
        commune: 'Paris',
        adresse: '51 rue de la république',
        date_maj: '2022-11-07T00:00:00.000Z',
        id: 'cnfs-structure-1',
        nom: 'Médiation république',
        pivot: '43493312300029',
        thematiques: 'numerique--devenir-autonome-dans-les-demarches-administratives',
        source: 'cnfs'
      }
    ]);
  });

  it('should merge a single full service with a single full structure', (): void => {
    const structure: SchemaStructureDataInclusion = {
      adresse: '12 BIS RUE DE LECLERCQ',
      code_postal: '51100',
      code_insee: '51454',
      complement_adresse: 'Le patio du bois de l’Aulne',
      commune: 'Reims',
      date_maj: new Date('2022-10-10').toISOString(),
      id: 'structure-1',
      nom: 'Anonymal',
      siret: '43493312300029',
      source: 'Hubik',
      accessibilite: 'https://acceslibre.beta.gouv.fr/app/29-lampaul-plouarzel/a/bibliotheque-mediatheque/erp/mediatheque-13/',
      courriel: 'contact@laquincaillerie.tl',
      telephone: '+33180059880',
      site_web: 'https://www.laquincaillerie.tl/;https://m.facebook.com/laquincaillerienumerique/',
      horaires_ouverture: 'Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00',
      labels_nationaux: ['france-service', 'aptic'],
      labels_autres: ['SudLabs', 'Nièvre médiation numérique'],
      latitude: 43.52609,
      longitude: 5.41423,
      presentation_detail:
        'Notre parcours d’initiation permet l’acquisition de compétences numériques de base. Nous proposons également un accompagnement à destination des personnes déjà initiées qui souhaiteraient approfondir leurs connaissances. Du matériel informatique est en libre accès pour nos adhérents tous les après-midis. En plus de d’accueillir les personnes dans notre lieu en semaine (sur rendez-vous), nous assurons une permanence le samedi matin dans la médiathèque XX.',
      presentation_resume: 'Notre association propose des formations aux outils numériques à destination des personnes âgées.',
      structure_parente: 'Pôle emploi',
      typologie: Typologie.TIERS_LIEUX
    };

    const service: SchemaServiceDataInclusion = {
      id: 'structure-1-mediation-numerique',
      nom: 'Médiation numérique',
      source: 'Hubik',
      structure_id: 'structure-1',
      thematiques: [
        'numerique',
        'numerique--devenir-autonome-dans-les-demarches-administratives',
        'numerique--realiser-des-demarches-administratives-avec-un-accompagnement',
        'numerique--prendre-en-main-un-smartphone-ou-une-tablette',
        'numerique--prendre-en-main-un-ordinateur',
        'numerique--utiliser-le-numerique-au-quotidien',
        'numerique--approfondir-ma-culture-numerique',
        'numerique--favoriser-mon-insertion-professionnelle',
        'numerique--acceder-a-une-connexion-internet',
        'numerique--acceder-a-du-materiel',
        'numerique--s-equiper-en-materiel-informatique',
        'numerique--creer-et-developper-mon-entreprise',
        'numerique--creer-avec-le-numerique',
        'numerique--accompagner-les-demarches-de-sante',
        'numerique--promouvoir-la-citoyennete-numerique',
        'numerique--soutenir-la-parentalite-et-l-education-avec-le-numerique'
      ],
      frais: ['gratuit-sous-conditions'],
      types: ['autonomie', 'delegation', 'accompagnement', 'atelier'],
      prise_rdv: 'https://www.rdv-solidarites.fr/',
      profils: [
        'seniors-65',
        'familles-enfants',
        'adultes',
        'jeunes-16-26',
        'public-langues-etrangeres',
        'deficience-visuelle',
        'surdite',
        'handicaps-psychiques',
        'handicaps-mentaux',
        'femmes',
        'personnes-en-situation-illettrisme'
      ]
    };

    const dataInclusionMerged: DataInclusionMerged[] = structuresWithServicesNumeriques([structure], [service]);

    expect(dataInclusionMerged).toStrictEqual<DataInclusionMerged[]>([
      {
        code_postal: '51100',
        code_insee: '51454',
        complement_adresse: 'Le patio du bois de l’Aulne',
        commune: 'Reims',
        adresse: '12 BIS RUE DE LECLERCQ',
        latitude: 43.52609,
        longitude: 5.41423,
        courriel: 'contact@laquincaillerie.tl',
        telephone: '+33180059880',
        site_web: 'https://www.laquincaillerie.tl/;https://m.facebook.com/laquincaillerienumerique/',
        date_maj: '2022-10-10T00:00:00.000Z',
        id: 'Hubik-structure-1',
        nom: 'Anonymal',
        pivot: '43493312300029',
        thematiques:
          'numerique,numerique--devenir-autonome-dans-les-demarches-administratives,numerique--realiser-des-demarches-administratives-avec-un-accompagnement,numerique--prendre-en-main-un-smartphone-ou-une-tablette,numerique--prendre-en-main-un-ordinateur,numerique--utiliser-le-numerique-au-quotidien,numerique--approfondir-ma-culture-numerique,numerique--favoriser-mon-insertion-professionnelle,numerique--acceder-a-une-connexion-internet,numerique--acceder-a-du-materiel,numerique--s-equiper-en-materiel-informatique,numerique--creer-et-developper-mon-entreprise,numerique--creer-avec-le-numerique,numerique--accompagner-les-demarches-de-sante,numerique--promouvoir-la-citoyennete-numerique,numerique--soutenir-la-parentalite-et-l-education-avec-le-numerique',
        presentation_detail:
          'Notre parcours d’initiation permet l’acquisition de compétences numériques de base. Nous proposons également un accompagnement à destination des personnes déjà initiées qui souhaiteraient approfondir leurs connaissances. Du matériel informatique est en libre accès pour nos adhérents tous les après-midis. En plus de d’accueillir les personnes dans notre lieu en semaine (sur rendez-vous), nous assurons une permanence le samedi matin dans la médiathèque XX.',
        presentation_resume:
          'Notre association propose des formations aux outils numériques à destination des personnes âgées.',
        source: 'Hubik',
        structure_parente: 'Pôle emploi',
        horaires: 'Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00',
        accessibilite:
          'https://acceslibre.beta.gouv.fr/app/29-lampaul-plouarzel/a/bibliotheque-mediatheque/erp/mediatheque-13/',
        labels_nationaux: 'france-service,aptic',
        labels_autres: 'SudLabs,Nièvre médiation numérique',
        typologie: Typologie.TIERS_LIEUX,
        frais: 'gratuit-sous-conditions',
        types: 'autonomie,delegation,accompagnement,atelier',
        prise_rdv: 'https://www.rdv-solidarites.fr/',
        profils:
          'seniors-65,familles-enfants,adultes,jeunes-16-26,public-langues-etrangeres,deficience-visuelle,surdite,handicaps-psychiques,handicaps-mentaux,femmes,personnes-en-situation-illettrisme'
      }
    ]);
  });

  it('should not merge a single service in a single structure when there is no numerique service', (): void => {
    const structure: SchemaStructureDataInclusion = {
      adresse: '51 rue de la république',
      code_postal: '75013',
      commune: 'Paris',
      date_maj: '2022-11-07',
      id: 'structure-1',
      nom: 'Médiation république',
      siret: '43493312300029'
    };

    const service: SchemaServiceDataInclusion = {
      id: 'structure-1-mediation-numerique',
      nom: 'Médiation numérique',
      source: 'Hubik',
      structure_id: 'structure-1',
      thematiques: ['mobilite-acces-a-des-transports-en-commun']
    };

    const dataInclusionMerged: DataInclusionMerged[] = structuresWithServicesNumeriques([structure], [service]);

    expect(dataInclusionMerged).toStrictEqual<DataInclusionMerged[]>([]);
  });

  it('should not merge the service when the structure id do not match', (): void => {
    const structure: SchemaStructureDataInclusion = {
      adresse: '51 rue de la république',
      code_postal: '75013',
      commune: 'Paris',
      date_maj: '2022-11-07',
      id: 'structure-1',
      nom: 'Médiation république'
    };

    const service: SchemaServiceDataInclusion = {
      id: 'structure-1-mediation-numerique',
      nom: 'Médiation numérique',
      source: 'Hubik',
      structure_id: 'structure-2',
      thematiques: ['numerique--devenir-autonome-dans-les-demarches-administratives']
    };

    const dataInclusionMerged: DataInclusionMerged[] = structuresWithServicesNumeriques([structure], [service]);

    expect(dataInclusionMerged).toStrictEqual<DataInclusionMerged[]>([]);
  });

  it('should not merge when the id are the same but the sources are different', (): void => {
    const structure1: SchemaStructureDataInclusion = {
      id: '3',
      source: 'mediation-numerique-cd87',
      longitude: 1.222764,
      latitude: 45.829986,
      labels_nationaux: ['aptic'],
      nom: 'ALSEA Service INTERVAL',
      commune: 'Limoges',
      adresse: '1 bis Rue du Maréchal Juin 87100 Limoges',
      code_postal: '87100',
      date_maj: '2022-11-07'
    };

    const structure2: SchemaStructureDataInclusion = {
      id: '3',
      source: 'mediation-numerique-angers',
      longitude: -0.5578638,
      latitude: 47.4681383,
      date_maj: '2023-02-12',
      nom: "Centre d'Information et d'Orientation d'Angers - Segré",
      commune: 'Angers',
      adresse: '12 boulevard du Roi René',
      code_postal: '49000'
    };

    const service1: SchemaServiceDataInclusion = {
      id: '3-mediation-numerique',
      source: 'mediation-numerique-cd87',
      nom: 'Médiation numérique',
      structure_id: '3',
      thematiques: ['numerique', 'numerique--acceder-a-une-connexion-internet']
    };

    const service2: SchemaServiceDataInclusion = {
      id: '3-mediation-numerique',
      source: 'mediation-numerique-angers',
      nom: 'Médiation numérique',
      types: ['accompagnement'],
      frais: ['pass-numerique'],
      profils: ['jeunes-16-26', 'familles-enfants', 'adultes', 'seniors-65'],
      structure_id: '3',
      thematiques: ['numerique', 'numerique--utiliser-le-numerique-au-quotidien']
    };

    const dataInclusionMerged: DataInclusionMerged[] = structuresWithServicesNumeriques(
      [structure1, structure2],
      [service1, service2]
    );

    expect(dataInclusionMerged).toStrictEqual<DataInclusionMerged[]>([
      {
        adresse: '1 bis Rue du Maréchal Juin 87100 Limoges',
        code_postal: '87100',
        commune: 'Limoges',
        date_maj: '2022-11-07T00:00:00.000Z',
        id: 'mediation-numerique-cd87-3',
        latitude: 45.829986,
        longitude: 1.222764,
        nom: 'ALSEA Service INTERVAL',
        pivot: '',
        source: 'mediation-numerique-cd87',
        labels_nationaux: 'aptic',
        thematiques: 'numerique,numerique--acceder-a-une-connexion-internet'
      },
      {
        adresse: '12 boulevard du Roi René',
        code_postal: '49000',
        commune: 'Angers',
        date_maj: '2023-02-12T00:00:00.000Z',
        id: 'mediation-numerique-angers-3',
        latitude: 47.4681383,
        longitude: -0.5578638,
        nom: "Centre d'Information et d'Orientation d'Angers - Segré",
        pivot: '',
        source: 'mediation-numerique-angers',
        profils: 'jeunes-16-26,familles-enfants,adultes,seniors-65',
        frais: 'pass-numerique',
        types: 'accompagnement',
        thematiques: 'numerique,numerique--utiliser-le-numerique-au-quotidien'
      }
    ]);
  });

  it('should merge two services with the same structure id', (): void => {
    const structure: SchemaStructureDataInclusion = {
      adresse: '51 rue de la république',
      code_postal: '75013',
      commune: 'Paris',
      date_maj: '2022-11-07',
      id: '1',
      nom: 'Médiation république',
      siret: '43493312300029',
      source: 'Hubik'
    };

    const service1: SchemaServiceDataInclusion = {
      id: 'structure-1-mediation-numerique',
      nom: 'Médiation numérique',
      source: 'Hubik',
      structure_id: '1',
      thematiques: ['numerique--devenir-autonome-dans-les-demarches-administratives']
    };

    const service2: SchemaServiceDataInclusion = {
      id: 'structure-1-mediation-numerique',
      nom: 'Médiation numérique',
      source: 'Hubik',
      structure_id: '1',
      thematiques: ['numerique--prendre-en-main-un-smartphone-ou-une-tablette']
    };

    const dataInclusionMerged: DataInclusionMerged[] = structuresWithServicesNumeriques([structure], [service1, service2]);

    expect(dataInclusionMerged).toStrictEqual<DataInclusionMerged[]>([
      {
        code_postal: '75013',
        commune: 'Paris',
        adresse: '51 rue de la république',
        date_maj: '2022-11-07T00:00:00.000Z',
        id: 'Hubik-1',
        nom: 'Médiation république',
        pivot: '43493312300029',
        source: 'Hubik',
        thematiques:
          'numerique--devenir-autonome-dans-les-demarches-administratives,numerique--prendre-en-main-un-smartphone-ou-une-tablette'
      }
    ]);
  });

  it('should not merge two services with the same structure id when service has its own location', (): void => {
    const structure: SchemaStructureDataInclusion = {
      adresse: '51 rue de la république',
      code_postal: '75013',
      commune: 'Paris',
      date_maj: '2022-11-07',
      id: 'structure-1',
      nom: 'Médiation république',
      siret: '43493312300029',
      source: 'Hubik'
    };

    const service1: SchemaServiceDataInclusion = {
      id: 'service-1',
      nom: 'Médiation numérique',
      source: 'Hubik',
      structure_id: 'structure-1',
      thematiques: ['numerique--devenir-autonome-dans-les-demarches-administratives']
    };

    const service2: Partial<SchemaStructureDataInclusionAdresseFields> &
      SchemaServiceDataInclusion &
      SchemaStructureDataInclusionLocalisationFields = {
      id: 'service-2',
      nom: 'Médiation numérique',
      source: 'Hubik',
      structure_id: 'structure-1',
      thematiques: ['numerique--prendre-en-main-un-smartphone-ou-une-tablette'],
      adresse: '12 rue Baudricourt',
      code_postal: '75013',
      commune: 'Paris',
      latitude: 4.8375548,
      longitude: 45.7665478
    };

    const dataInclusionMerged: DataInclusionMerged[] = structuresWithServicesNumeriques([structure], [service1, service2]);

    expect(dataInclusionMerged).toStrictEqual<DataInclusionMerged[]>([
      {
        code_postal: '75013',
        commune: 'Paris',
        adresse: '51 rue de la république',
        date_maj: '2022-11-07T00:00:00.000Z',
        id: 'Hubik-structure-1',
        nom: 'Médiation république',
        pivot: '43493312300029',
        source: 'Hubik',
        thematiques: 'numerique--devenir-autonome-dans-les-demarches-administratives'
      },
      {
        code_postal: '75013',
        commune: 'Paris',
        adresse: '12 rue Baudricourt',
        latitude: 4.8375548,
        longitude: 45.7665478,
        date_maj: '2022-11-07T00:00:00.000Z',
        id: 'Hubik-service-2',
        nom: 'Médiation numérique',
        pivot: '43493312300029',
        source: 'Hubik',
        structure_parente: 'structure-1',
        thematiques: 'numerique--prendre-en-main-un-smartphone-ou-une-tablette'
      }
    ]);
  });
});
