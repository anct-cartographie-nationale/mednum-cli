import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';

const resumeIfAny = (source: DataSource, colonne?: string): { resume?: string } =>
  colonne == null ? {} : { resume: source[colonne] ?? '' };

const detailIfAny = (source: DataSource, colonne?: string): { detail?: string } =>
  colonne == null ? {} : { detail: source[colonne] ?? '' };

export const processPresentation = (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching
): { resume?: string; detail?: string } => ({
  ...resumeIfAny(source, matching.presentation_resume?.colonne),
  ...detailIfAny(source, matching.presentation_detail?.colonne)
});
