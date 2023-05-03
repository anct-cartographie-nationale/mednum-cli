/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { SchemaServiceDataInclusion, SchemaStructureDataInclusion } from '@gouvfr-anct/lieux-de-mediation-numerique';

type DataInclusionMergedGeneral = {
  id: string;
  nom: string;
  pivot: string;
  structure_parente?: string;
  thematiques?: string;
  typologie?: string;
  accessibilite?: string;
};

type DataInclusionMergedLocalisation = {
  latitude?: number;
  longitude?: number;
};

type DataInclusionMergedLabels = {
  labels_nationaux?: string;
  labels_autres?: string;
};

type DataInclusionMergedContact = {
  courriel?: string;
  telephone?: string;
  site_web?: string;
  prise_rdv?: string;
};

type DataInclusionMergedAddress = {
  code_postal: string;
  commune: string;
  adresse: string;
  complement_adresse?: string;
  code_insee?: string;
};

type DataInclusionMergedPresentation = {
  presentation_detail?: string;
  presentation_resume?: string;
};

type DataInclusionMergedCollecte = {
  source: string;
  date_maj: string;
};

type DataInclusionMergedAcces = {
  frais?: string;
  profils?: string;
  types?: string;
  horaires?: string;
};

export type DataInclusionMerged = DataInclusionMergedAcces &
  DataInclusionMergedAddress &
  DataInclusionMergedCollecte &
  DataInclusionMergedContact &
  DataInclusionMergedGeneral &
  DataInclusionMergedLabels &
  DataInclusionMergedLocalisation &
  DataInclusionMergedPresentation;

const dataInclusionMergedGeneral = (
  structure: SchemaStructureDataInclusion,
  service: SchemaServiceDataInclusion
): DataInclusionMergedGeneral => ({
  id: structure.id,
  nom: structure.nom,
  pivot: structure.siret ?? '',
  ...(structure.structure_parente == null ? {} : { structure_parente: structure.structure_parente }),
  thematiques: service.thematiques?.join(',') ?? '',
  ...(structure.typologie == null ? {} : { typologie: structure.typologie }),
  ...(structure.accessibilite == null ? {} : { accessibilite: structure.accessibilite })
});

const dataInclusionMergedAddress = (structure: SchemaStructureDataInclusion): DataInclusionMergedAddress => ({
  adresse: structure.adresse,
  code_postal: structure.code_postal,
  commune: structure.commune,
  ...(structure.code_insee == null ? {} : { code_insee: structure.code_insee }),
  ...(structure.complement_adresse == null ? {} : { complement_adresse: structure.complement_adresse })
});

const dataInclusionMergedLocalisation = (structure: SchemaStructureDataInclusion): DataInclusionMergedLocalisation => ({
  ...(structure.latitude == null ? {} : { latitude: structure.latitude }),
  ...(structure.longitude == null ? {} : { longitude: structure.longitude })
});

const dataInclusionMergedContact = (
  structure: SchemaStructureDataInclusion,
  service: SchemaServiceDataInclusion
): DataInclusionMergedContact => ({
  ...(structure.courriel == null ? {} : { courriel: structure.courriel }),
  ...(structure.telephone == null ? {} : { telephone: structure.telephone }),
  ...(structure.site_web == null ? {} : { site_web: structure.site_web }),
  ...(service.prise_rdv == null ? {} : { prise_rdv: service.prise_rdv })
});

const dataInclusionMergedCollecte = (structure: SchemaStructureDataInclusion): DataInclusionMergedCollecte => ({
  date_maj: new Date(structure.date_maj).toISOString(),
  source: 'Hubik'
});

const dataInclusionMergedPresentation = (structure: SchemaStructureDataInclusion): DataInclusionMergedPresentation => ({
  ...(structure.presentation_detail == null ? {} : { presentation_detail: structure.presentation_detail }),
  ...(structure.presentation_resume == null ? {} : { presentation_resume: structure.presentation_resume })
});

const dataInclusionMergedLabels = (structure: SchemaStructureDataInclusion): DataInclusionMergedLabels => ({
  ...(structure.labels_autres == null ? {} : { labels_autres: structure.labels_autres.join(',') }),
  ...(structure.labels_nationaux == null ? {} : { labels_nationaux: structure.labels_nationaux.join(',') })
});
const dataInclusionMergedAcces = (
  structure: SchemaStructureDataInclusion,
  service: SchemaServiceDataInclusion
): DataInclusionMergedAcces => ({
  ...(service.frais == null || service.frais.length === 0 ? {} : { frais: service.frais.join(',') }),
  ...(service.profils == null || service.profils.length === 0 ? {} : { profils: service.profils.join(',') }),
  ...(service.types == null || service.types.length === 0 ? {} : { types: service.types.join(',') }),
  ...(structure.horaires_ouverture == null ? {} : { horaires: structure.horaires_ouverture })
});

export const mergeStructureAndService = (
  structure: SchemaStructureDataInclusion,
  service: SchemaServiceDataInclusion
): DataInclusionMerged => ({
  ...dataInclusionMergedGeneral(structure, service),
  ...dataInclusionMergedAddress(structure),
  ...dataInclusionMergedLocalisation(structure),
  ...dataInclusionMergedContact(structure, service),
  ...dataInclusionMergedCollecte(structure),
  ...dataInclusionMergedPresentation(structure),
  ...dataInclusionMergedLabels(structure),
  ...dataInclusionMergedAcces(structure, service)
});
