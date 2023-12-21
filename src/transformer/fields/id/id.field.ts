import { Id } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource, Colonne } from '../../input';

const idIsEmptyInSource = (source: DataSource, id: Colonne): boolean => source[id.colonne] == null || source[id.colonne] === '';

export const processId = (source: DataSource, matching: LieuxMediationNumeriqueMatching, index: number): Id =>
  Id(
    (matching.id == null || idIsEmptyInSource(source, matching.id)
      ? index.toString()
      : source[matching.id.colonne]?.toString()) ?? index.toString()
  );
