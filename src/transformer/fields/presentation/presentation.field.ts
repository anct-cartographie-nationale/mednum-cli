import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';

const cleanPresentationFormat = (presentation: string): string =>
  presentation.replace(/\n/gu, '').replace(/\\/gu, '').replace(/\r/gu, '');

const resumeIfAny = (source: DataSource, colonne?: string): { resume?: string } =>
  colonne == null ? {} : { resume: cleanPresentationFormat(source[colonne]?.toString() ?? '') };

const detailIfAny = (source: DataSource, colonne?: string): { detail?: string } =>
  colonne == null ? {} : { detail: cleanPresentationFormat(source[colonne]?.toString() ?? '') };

export const processPresentation = (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching
): { resume?: string; detail?: string } => ({
  ...resumeIfAny(source, matching.presentation_resume?.colonne),
  ...detailIfAny(source, matching.presentation_detail?.colonne)
});
