import { LieuxMediationNumeriqueMatching, DataSource, Colonne } from '../../input';

const canProcessPrive = (source: DataSource, prive?: Colonne): prive is Colonne =>
  prive?.colonne != null && source[prive.colonne] != null && source[prive.colonne] !== '';

export const processPrive = (source: DataSource, matching: LieuxMediationNumeriqueMatching): boolean =>
  canProcessPrive(source, matching.prive) ? Boolean(source[matching.prive.colonne]) : false;
