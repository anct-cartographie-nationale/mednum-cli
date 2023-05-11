/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Output } from '../../output-file';
import { generatePublishMetadata, PublishMetadata } from './generate-publish-metadata';

describe('publish metadata', (): void => {
  it('should generate publish metadata file content for Hinaura Auvergne-Rhône-Alpes', (): void => {
    const output: Output = {
      name: 'le hub Hinaura',
      path: './assets/output/hinaura',
      territoire: 'Auvergne-Rhône-Alpes'
    };
    const publishMetadata: PublishMetadata = generatePublishMetadata(
      output,
      [{ date_maj: new Date('2023-01-05') } as LieuMediationNumerique],
      new Date('2023-01-07')
    );

    expect(publishMetadata).toStrictEqual({
      title: 'Lieux de médiation numérique sur le territoire Auvergne-Rhône-Alpes fournis par le hub Hinaura',
      description:
        'Lieux de médiation numérique proposant un accompagnement au public fournis par le hub Hinaura sur le territoire Auvergne-Rhône-Alpes.\nCe jeu de données répond aux spécifications du schéma "Lieux de médiation numérique" disponible sur le site [schema.data.gouv.fr](https://schema.data.gouv.fr/LaMednum/standard-mediation-num)',
      tags: [
        'inclusion',
        'inclusion-numerique',
        'lieux-d-inclusion-numerique',
        'mediation',
        'mediation-numerique',
        'lieux-de-mediation-numerique'
      ],
      frequency: 'daily',
      license: 'lov2',
      granularity: 'poi',
      start: '2023-01-05',
      end: '2023-01-05',
      ressources: [
        {
          source: './assets/output/hinaura/20230107-le-hub-hinaura-lieux-de-mediation-numeriques-auvergne-rhone-alpes.csv',
          schema: 'LaMednum/standard-mediation-num',
          description:
            'Lieux de médiation numérique sur le territoire Auvergne-Rhône-Alpes fournis par le hub Hinaura au format CSV.'
        },
        {
          source: './assets/output/hinaura/20230107-le-hub-hinaura-lieux-de-mediation-numeriques-auvergne-rhone-alpes.json',
          schema: 'LaMednum/standard-mediation-num',
          description:
            'Lieux de médiation numérique sur le territoire Auvergne-Rhône-Alpes fournis par le hub Hinaura au format JSON.\nVous pouvez utiliser l’url stable associé à cette ressource pour alimenter une version locale de la cartographie des lieux de médiation numérique.'
        },
        {
          source: './assets/output/hinaura/services-inclusion-20230107-le-hub-hinaura.json',
          schema: 'betagouv/data-inclusion-schema',
          description:
            "Services de médiation numérique rattachés à une structure de l'inclusion fournis par le hub Hinaura sur le territoire Auvergne-Rhône-Alpes"
        },
        {
          source: './assets/output/hinaura/structures-inclusion-20230107-le-hub-hinaura.json',
          schema: 'betagouv/data-inclusion-schema',
          description:
            "Structures de l'inclusion qui proposent des services de médiation numérique fournis par le hub Hinaura sur le territoire Auvergne-Rhône-Alpes"
        }
      ]
    });
  });

  it('should generate publish metadata file content for département Maine-et-Loire', (): void => {
    const output: Output = {
      name: 'le département Maine-et-Loire',
      path: './assets/output/maine-et-loire',
      territoire: 'Maine-et-Loire'
    };
    const publishMetadata: PublishMetadata = generatePublishMetadata(
      output,
      [{ date_maj: new Date('2023-01-05') } as LieuMediationNumerique],
      new Date('2023-01-07')
    );

    expect(publishMetadata).toStrictEqual({
      title: 'Lieux de médiation numérique sur le territoire Maine-et-Loire fournis par le département Maine-et-Loire',
      description:
        'Lieux de médiation numérique proposant un accompagnement au public fournis par le département Maine-et-Loire sur le territoire Maine-et-Loire.\nCe jeu de données répond aux spécifications du schéma "Lieux de médiation numérique" disponible sur le site [schema.data.gouv.fr](https://schema.data.gouv.fr/LaMednum/standard-mediation-num)',
      tags: [
        'inclusion',
        'inclusion-numerique',
        'lieux-d-inclusion-numerique',
        'mediation',
        'mediation-numerique',
        'lieux-de-mediation-numerique'
      ],
      frequency: 'daily',
      license: 'lov2',
      granularity: 'poi',
      start: '2023-01-05',
      end: '2023-01-05',
      ressources: [
        {
          source:
            './assets/output/maine-et-loire/20230107-le-departement-maine-et-loire-lieux-de-mediation-numeriques-maine-et-loire.csv',
          schema: 'LaMednum/standard-mediation-num',
          description:
            'Lieux de médiation numérique sur le territoire Maine-et-Loire fournis par le département Maine-et-Loire au format CSV.'
        },
        {
          source:
            './assets/output/maine-et-loire/20230107-le-departement-maine-et-loire-lieux-de-mediation-numeriques-maine-et-loire.json',
          schema: 'LaMednum/standard-mediation-num',
          description:
            'Lieux de médiation numérique sur le territoire Maine-et-Loire fournis par le département Maine-et-Loire au format JSON.\nVous pouvez utiliser l’url stable associé à cette ressource pour alimenter une version locale de la cartographie des lieux de médiation numérique.'
        },
        {
          source: './assets/output/maine-et-loire/services-inclusion-20230107-le-departement-maine-et-loire.json',
          schema: 'betagouv/data-inclusion-schema',
          description:
            "Services de médiation numérique rattachés à une structure de l'inclusion fournis par le département Maine-et-Loire sur le territoire Maine-et-Loire"
        },
        {
          source: './assets/output/maine-et-loire/structures-inclusion-20230107-le-departement-maine-et-loire.json',
          schema: 'betagouv/data-inclusion-schema',
          description:
            "Structures de l'inclusion qui proposent des services de médiation numérique fournis par le département Maine-et-Loire sur le territoire Maine-et-Loire"
        }
      ]
    });
  });

  it('should generate publish metadata file content with date cover', (): void => {
    const output: Output = {
      name: 'le département Maine-et-Loire',
      path: './assets/output/maine-et-loire',
      territoire: 'Maine-et-Loire'
    };
    const publishMetadata: PublishMetadata = generatePublishMetadata(
      output,
      [
        { date_maj: new Date('2022-07-26') } as LieuMediationNumerique,
        { date_maj: new Date('2018-11-01') } as LieuMediationNumerique,
        { date_maj: new Date('2016-06-12') } as LieuMediationNumerique,
        { date_maj: new Date('2023-01-09') } as LieuMediationNumerique,
        { date_maj: new Date('2020-05-12') } as LieuMediationNumerique
      ],
      new Date('2023-01-07')
    );

    expect(publishMetadata).toStrictEqual({
      title: 'Lieux de médiation numérique sur le territoire Maine-et-Loire fournis par le département Maine-et-Loire',
      description:
        'Lieux de médiation numérique proposant un accompagnement au public fournis par le département Maine-et-Loire sur le territoire Maine-et-Loire.\nCe jeu de données répond aux spécifications du schéma "Lieux de médiation numérique" disponible sur le site [schema.data.gouv.fr](https://schema.data.gouv.fr/LaMednum/standard-mediation-num)',
      tags: [
        'inclusion',
        'inclusion-numerique',
        'lieux-d-inclusion-numerique',
        'mediation',
        'mediation-numerique',
        'lieux-de-mediation-numerique'
      ],
      frequency: 'daily',
      license: 'lov2',
      granularity: 'poi',
      start: '2016-06-12',
      end: '2023-01-09',
      ressources: [
        {
          source:
            './assets/output/maine-et-loire/20230107-le-departement-maine-et-loire-lieux-de-mediation-numeriques-maine-et-loire.csv',
          schema: 'LaMednum/standard-mediation-num',
          description:
            'Lieux de médiation numérique sur le territoire Maine-et-Loire fournis par le département Maine-et-Loire au format CSV.'
        },
        {
          source:
            './assets/output/maine-et-loire/20230107-le-departement-maine-et-loire-lieux-de-mediation-numeriques-maine-et-loire.json',
          schema: 'LaMednum/standard-mediation-num',
          description:
            'Lieux de médiation numérique sur le territoire Maine-et-Loire fournis par le département Maine-et-Loire au format JSON.\nVous pouvez utiliser l’url stable associé à cette ressource pour alimenter une version locale de la cartographie des lieux de médiation numérique.'
        },
        {
          source: './assets/output/maine-et-loire/services-inclusion-20230107-le-departement-maine-et-loire.json',
          schema: 'betagouv/data-inclusion-schema',
          description:
            "Services de médiation numérique rattachés à une structure de l'inclusion fournis par le département Maine-et-Loire sur le territoire Maine-et-Loire"
        },
        {
          source: './assets/output/maine-et-loire/structures-inclusion-20230107-le-departement-maine-et-loire.json',
          schema: 'betagouv/data-inclusion-schema',
          description:
            "Structures de l'inclusion qui proposent des services de médiation numérique fournis par le département Maine-et-Loire sur le territoire Maine-et-Loire"
        }
      ]
    });
  });
});
