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
  'typologie',
  'telephone',
  'courriels',
  'site_web',
  'horaires',
  'presentation_resume',
  'presentation_detail',
  'source',
  'itinerance',
  'structure_parente',
  'date_maj',
  'services',
  'publics_specifiquement_adresses',
  'prise_en_charge_specifique',
  'frais_a_charge',
  'dispositif_programmes_nationaux',
  'formations_labels',
  'autres_formations_labels',
  'modalites_acces',
  'modalites_accompagnement',
  'fiche_acces_libre',
  'prise_rdv'
];

const toDoubleQuoted = (header?: string): string => (header == null ? '' : `"${header}"`);

const fieldsArrayFrom = (lieuMediationNumerique: SchemaLieuMediationNumerique): (string | undefined)[] => [
  lieuMediationNumerique.id,
  lieuMediationNumerique.pivot,
  lieuMediationNumerique.nom.replace(/"/gu, '').replace(/\n/gu, ''),
  lieuMediationNumerique.commune,
  lieuMediationNumerique.code_postal,
  lieuMediationNumerique.code_insee,
  lieuMediationNumerique.adresse.replace(/"/gu, '').replace(/\n/gu, '').replace(/\s$/gu, '').replace(/\s+/gu, ' '),
  lieuMediationNumerique.complement_adresse?.replace(/"/gu, '').replace(/\n/gu, '').replace(/\s$/gu, '').replace(/\s+/gu, ' '),
  lieuMediationNumerique.latitude?.toString(),
  lieuMediationNumerique.longitude?.toString(),
  lieuMediationNumerique.typologie,
  lieuMediationNumerique.telephone,
  lieuMediationNumerique.courriels,
  lieuMediationNumerique.site_web,
  lieuMediationNumerique.horaires?.replace(/"/gu, '').replace(/\n/gu, ''),
  lieuMediationNumerique.presentation_resume?.replace(/"/gu, '＂').replace(/\n/gu, ''),
  lieuMediationNumerique.presentation_detail?.replace(/"/gu, '＂').replace(/\n/gu, ''),
  lieuMediationNumerique.source,
  lieuMediationNumerique.itinerance,
  lieuMediationNumerique.structure_parente,
  lieuMediationNumerique.date_maj,
  lieuMediationNumerique.services?.replace(/"/gu, '＂').replace(/\n/gu, ''),
  lieuMediationNumerique.publics_specifiquement_adresses,
  lieuMediationNumerique.prise_en_charge_specifique,
  lieuMediationNumerique.frais_a_charge,
  lieuMediationNumerique.dispositif_programmes_nationaux,
  lieuMediationNumerique.formations_labels,
  lieuMediationNumerique.autres_formations_labels?.replace(/"/gu, '＂').replace(/\n/gu, ''),
  lieuMediationNumerique.modalites_acces,
  lieuMediationNumerique.modalites_accompagnement,
  lieuMediationNumerique.fiche_acces_libre,
  lieuMediationNumerique.prise_rdv
];

export const csvLineFrom = (cells: (string | undefined)[]): string => cells.map(toDoubleQuoted).join(',');

const toLieuMediationNumeriqueCsvLine = (lieuMediationNumerique: SchemaLieuMediationNumerique): string =>
  csvLineFrom(fieldsArrayFrom(lieuMediationNumerique));

export const mediationNumeriqueToCsv = (lieuxMediationNumerique: SchemaLieuMediationNumerique[]): string =>
  `${csvLineFrom(HEADERS)}\n${lieuxMediationNumerique.map(toLieuMediationNumeriqueCsvLine).join('\n')}`;
