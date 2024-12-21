import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Output } from '../../output-file';
import { PublishRessource } from '../../../publier/models';
import { dataInclusionFileName } from '../../data-inclusion';
import { mediationNumeriqueFileName } from '../../mediation-numerique';

export type PublishMetadata = {
  title: string;
  description: string;
  tags: string[];
  frequency: string;
  license: string;
  granularity: string;
  start: string;
  end: string;
  ressources: PublishRessource[];
};

const DATASET_TAGS: string[] = [
  'inclusion',
  'inclusion-numerique',
  'lieux-d-inclusion-numerique',
  'mediation',
  'mediation-numerique',
  'lieux-de-mediation-numerique'
];

const mendumJsonRessource = (output: Output, date: Date, suffix?: string): PublishRessource => ({
  source: `${output.path}/${mediationNumeriqueFileName(
    date,
    output.name.toLowerCase().replace(/\s/g, '-'),
    output.territoire.toLowerCase().replace(/\s/g, '-'),
    'csv',
    suffix
  )}`,
  schema: 'LaMednum/standard-mediation-num',
  description: `Lieux de médiation numérique sur le territoire ${output.territoire} fournis par ${output.name} au format CSV.`
});

const mendumCsvRessource = (output: Output, date: Date, suffix?: string): PublishRessource => ({
  source: `${output.path}/${mediationNumeriqueFileName(
    date,
    output.name.toLowerCase().replace(/\s/g, '-'),
    output.territoire.toLowerCase().replace(/\s/g, '-'),
    'json',
    suffix
  )}`,
  schema: 'LaMednum/standard-mediation-num',
  description: `Lieux de médiation numérique sur le territoire ${output.territoire} fournis par ${output.name} au format JSON.\nVous pouvez utiliser l’url stable associé à cette ressource pour alimenter une version locale de la cartographie des lieux de médiation numérique.`
});

const dataInclusionServicesRessource = (output: Output, date: Date, suffix?: string): PublishRessource => ({
  source: `${output.path}/${dataInclusionFileName(
    date,
    output.name.toLowerCase().replace(/\s/g, '-'),
    'services',
    'json',
    suffix
  )}`,
  schema: 'gip-inclusion/data-inclusion-schema',
  description: `Services de médiation numérique rattachés à une structure de l'inclusion fournis par ${output.name} sur le territoire ${output.territoire}`
});

const dataInclusionStructuresRessource = (output: Output, date: Date, suffix?: string): PublishRessource => ({
  source: `${output.path}/${dataInclusionFileName(
    date,
    output.name.toLowerCase().replace(/\s/g, '-'),
    'structures',
    'json',
    suffix
  )}`,
  schema: 'gip-inclusion/data-inclusion-schema',
  description: `Structures de l'inclusion qui proposent des services de médiation numérique fournis par ${output.name} sur le territoire ${output.territoire}`
});

const byDateMajAsc = (
  lieuMediationNumeriqueA: LieuMediationNumerique,
  lieuMediationNumeriqueB: LieuMediationNumerique
): number => lieuMediationNumeriqueA.date_maj.getTime() - lieuMediationNumeriqueB.date_maj.getTime();

const byDateMajDesc = (
  lieuMediationNumeriqueA: LieuMediationNumerique,
  lieuMediationNumeriqueB: LieuMediationNumerique
): number => lieuMediationNumeriqueB.date_maj.getTime() - lieuMediationNumeriqueA.date_maj.getTime();

const formatDate = (date: Date | undefined): string => date?.toISOString().split('T').at(0) ?? '';

export const generatePublishMetadata = (
  output: Output,
  lieuxDeMediationNumerique: LieuMediationNumerique[],
  date: Date,
  suffix?: string
): PublishMetadata => ({
  title: `Lieux de médiation numérique sur le territoire ${output.territoire} fournis par ${output.name}`,
  description: `Lieux de médiation numérique proposant un accompagnement au public fournis par ${output.name} sur le territoire ${output.territoire}.\nCe jeu de données répond aux spécifications du schéma "Lieux de médiation numérique" disponible sur le site [schema.data.gouv.fr](https://schema.data.gouv.fr/LaMednum/standard-mediation-num)`,
  tags: DATASET_TAGS,
  frequency: 'daily',
  license: 'lov2',
  granularity: 'poi',
  start: formatDate(lieuxDeMediationNumerique.sort(byDateMajAsc).at(0)?.date_maj),
  end: formatDate(lieuxDeMediationNumerique.sort(byDateMajDesc).at(0)?.date_maj),
  ressources: [
    mendumJsonRessource(output, date, suffix),
    mendumCsvRessource(output, date, suffix),
    dataInclusionServicesRessource(output, date, suffix),
    dataInclusionStructuresRessource(output, date, suffix)
  ]
});
