import { readJsonFileIfExists } from '../../../libraries/file-system';
import type { AccesLibreErp } from '../../../libraries/acces-libre';
import { type AccesLibreIndex, accesLibreIndex } from '../domain';
import type { LoadAccesLibre } from '../keys';

export const accesLibreFromFile =
  (filePath?: string): LoadAccesLibre =>
  (): AccesLibreIndex =>
    accesLibreIndex(filePath == null ? [] : ((readJsonFileIfExists(filePath) ?? []) as AccesLibreErp[]));
