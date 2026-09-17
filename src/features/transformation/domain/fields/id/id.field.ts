import { Id } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { LieuxMediationNumeriqueMatching, DataSource } from '../../matching';

const idFragment = (matching: LieuxMediationNumeriqueMatching, index: number, source: DataSource): string =>
  matching.id == null ? index.toString() : (source[matching.id.colonne]?.toString() ?? '');

const sourceIfAny = (source: DataSource, sourceName: string, colonne?: string): string =>
  colonne == null || source[colonne] == null || (source[colonne] as string) === '' ? sourceName : (source[colonne] as string);

export const processId = (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching,
  index: number,
  sourceName: string
): Id =>
  Id(
    `${sourceIfAny(source, sourceName, matching.source?.colonne)}_${idFragment(matching, index, source)}`.replace(/\s+/g, '-')
  );
