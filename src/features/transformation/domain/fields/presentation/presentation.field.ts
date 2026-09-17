import { type Model, Presentation } from '@gouvfr-anct/lieux-de-mediation-numerique';

type PresentationField = Model.InputOf<typeof Presentation>;
import type { LieuxMediationNumeriqueMatching, DataSource } from '../../matching';

const cleanPresentationFormat = (presentation: string): string =>
  presentation.replace(/\n/gu, '').replace(/\\/gu, '').replace(/\r/gu, '');

const resumeIfAny = (source: DataSource, colonne?: string): { resume?: string } =>
  colonne == null ? {} : { resume: cleanPresentationFormat(source[colonne]?.toString() ?? '') };

const detailIfAny = (source: DataSource, colonne?: string): { detail?: string } =>
  colonne == null ? {} : { detail: cleanPresentationFormat(source[colonne]?.toString() ?? '') };

const PRESENTATION_RESUME_MAX_LENGTH: 280 = 280 as const;

const shouldMoveLongResumeToDetails = (presentations: PresentationField): boolean =>
  (presentations.detail?.length ?? 0) === 0 && (presentations.resume?.length ?? 0) > PRESENTATION_RESUME_MAX_LENGTH;

const fixPresentationOrder = (presentations: PresentationField): PresentationField =>
  shouldMoveLongResumeToDetails(presentations) ? { detail: presentations.resume ?? '' } : presentations;

const sansResumeTropLong = (presentations: PresentationField): PresentationField =>
  (presentations.resume?.length ?? 0) > PRESENTATION_RESUME_MAX_LENGTH
    ? Object.fromEntries(Object.entries(presentations).filter(([clef]: [string, unknown]): boolean => clef !== 'resume'))
    : presentations;

export const processPresentation = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Presentation =>
  Presentation(
    sansResumeTropLong(
      fixPresentationOrder({
        ...resumeIfAny(source, matching.presentation_resume?.colonne),
        ...detailIfAny(source, matching.presentation_detail?.colonne)
      })
    )
  );
