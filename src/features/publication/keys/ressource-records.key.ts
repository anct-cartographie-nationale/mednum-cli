import { type InjectionKey, keyFor } from '../../../libraries/injection/index.js';

export type ReadRessourceRecords = (source: string) => unknown[];

export const READ_RESSOURCE_RECORDS: InjectionKey<ReadRessourceRecords> = keyFor<ReadRessourceRecords>(
  'publication.read-ressource-records'
);
