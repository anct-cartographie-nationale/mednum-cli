/* eslint-disable max-lines-per-function */

import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';

const HEADERS: (keyof SchemaLieuMediationNumerique)[] = [
  'id',
  'pivot',
  'nom',
  'commune',
  'code_postal',
  'code_insee',
  'adresse',
  'complement_adresse',
  'latitude',
  'longitude',
  'cle_ban',
  'typologie',
  'telephone',
  'courriel',
  'site_web',
  'horaires',
  'presentation_resume',
  'presentation_detail',
  'source',
  'structure_parente',
  'date_maj',
  'services',
  'publics_accueillis',
  'conditions_acces',
  'labels_nationaux',
  'labels_autres',
  'modalites_accompagnement',
  'accessibilite',
  'prise_rdv'
];

const toDoubleQuoted = (header?: string): string => (header == null ? '' : `"${header}"`);

const fieldsArrayFrom = (lieuMediationNumerique: SchemaLieuMediationNumerique): (string | undefined)[] => [
  lieuMediationNumerique.id,
  lieuMediationNumerique.pivot,
  lieuMediationNumerique.nom.replace(/"/gu, ''),
  lieuMediationNumerique.commune,
  lieuMediationNumerique.code_postal,
  lieuMediationNumerique.code_insee,
  lieuMediationNumerique.adresse,
  lieuMediationNumerique.complement_adresse,
  lieuMediationNumerique.latitude?.toString(),
  lieuMediationNumerique.longitude?.toString(),
  lieuMediationNumerique.cle_ban,
  lieuMediationNumerique.typologie,
  lieuMediationNumerique.telephone,
  lieuMediationNumerique.courriel,
  lieuMediationNumerique.site_web,
  lieuMediationNumerique.horaires,
  lieuMediationNumerique.presentation_resume,
  lieuMediationNumerique.presentation_detail,
  lieuMediationNumerique.source,
  lieuMediationNumerique.structure_parente,
  lieuMediationNumerique.date_maj,
  lieuMediationNumerique.services,
  lieuMediationNumerique.publics_accueillis,
  lieuMediationNumerique.conditions_acces,
  lieuMediationNumerique.labels_nationaux,
  lieuMediationNumerique.labels_autres,
  lieuMediationNumerique.modalites_accompagnement,
  lieuMediationNumerique.accessibilite,
  lieuMediationNumerique.prise_rdv
];

export const csvLineFrom = (cells: (string | undefined)[]): string => cells.map(toDoubleQuoted).join(',');

const toLieuMediationNumeriqueCsvLine = (lieuMediationNumerique: SchemaLieuMediationNumerique): string =>
  csvLineFrom(fieldsArrayFrom(lieuMediationNumerique));

export const toLieuxMediationNumeriqueCsv = (lieuxMediationNumerique: SchemaLieuMediationNumerique[]): string =>
  `${csvLineFrom(HEADERS)}\n${lieuxMediationNumerique.map(toLieuMediationNumeriqueCsvLine).join('\n')}`;
