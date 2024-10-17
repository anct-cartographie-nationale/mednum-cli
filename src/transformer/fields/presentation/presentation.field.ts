import { Presentation as PresentationField } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';

const cleanPresentationFormat = (presentation: string): string =>
  presentation.replace(/\n/gu, '').replace(/\\/gu, '').replace(/\r/gu, '');

const resumeIfAny = (source: DataSource, colonne?: string): { resume?: string } =>
  colonne == null ? {} : { resume: cleanPresentationFormat(source[colonne]?.toString() ?? '') };

const detailIfAny = (source: DataSource, colonne?: string): { detail?: string } =>
  colonne == null ? {} : { detail: cleanPresentationFormat(source[colonne]?.toString() ?? '') };

const PRESENTATION_RESUME_MAX_LENGTH: 280 = 280 as const;

const shouldMoveLongResumeToDetails = (presentations: PresentationField): presentations is { resume: string } =>
  (presentations.detail?.length ?? 0) === 0 && (presentations.resume?.length ?? 0) > PRESENTATION_RESUME_MAX_LENGTH;

const fixPresentationOrder = (presentations: PresentationField): PresentationField =>
  shouldMoveLongResumeToDetails(presentations) ? { detail: presentations.resume } : presentations;

export const processPresentation = (source: DataSource, matching: LieuxMediationNumeriqueMatching): PresentationField =>
  fixPresentationOrder({
    ...resumeIfAny(source, matching.presentation_resume?.colonne),
    ...detailIfAny(source, matching.presentation_detail?.colonne)
  });
