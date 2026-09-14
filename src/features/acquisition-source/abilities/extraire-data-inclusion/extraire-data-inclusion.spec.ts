import type { SchemaServiceDataInclusion, SchemaStructureDataInclusion } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { beforeEach, describe, expect, it } from 'vitest';
import { provide } from '../../../../libraries/injection';
import type { DataInclusionMerged } from './domain';
import { extraireDataInclusion } from './extraire-data-inclusion';
import { FETCH_DATA_INCLUSION, WRITE_EXTRACTION } from './keys';

type Written = { outputFile: string; records: DataInclusionMerged[] };

const written: Written[] = [];
const fetchCalls: { apiKey: string; sources: string }[] = [];

const STRUCTURE = {
  id: '1',
  source: 'dora',
  nom: 'La Maison du Numérique',
  adresse: '12 rue des Lilas',
  code_postal: '75001',
  commune: 'Paris',
  date_maj: '2026-01-15'
} as unknown as SchemaStructureDataInclusion;

const SERVICE = {
  id: 's1',
  structure_id: '1',
  source: 'dora',
  nom: 'Accompagnement numérique',
  thematiques: ['numerique--accompagner-les-demarches-en-ligne']
} as unknown as SchemaServiceDataInclusion;

const provideImplementations = (structures: SchemaStructureDataInclusion[], services: SchemaServiceDataInclusion[]): void => {
  provide(FETCH_DATA_INCLUSION, async (apiKey: string, sources: string) => {
    fetchCalls.push({ apiKey, sources });
    return { structures, services };
  });
  provide(WRITE_EXTRACTION, (outputFile: string, records: DataInclusionMerged[]): void => {
    written.push({ outputFile, records });
  });
};

describe('extraireDataInclusion', (): void => {
  beforeEach((): void => {
    written.length = 0;
    fetchCalls.length = 0;
  });

  it('interroge data.inclusion avec la clé et le filtre fournis', async (): Promise<void> => {
    provideImplementations([STRUCTURE], [SERVICE]);

    await extraireDataInclusion({ dataInclusionApiKey: 'une-cle', filter: 'dora', outputFile: './dora.json' });

    expect(fetchCalls).toStrictEqual([{ apiKey: 'une-cle', sources: 'dora' }]);
  });

  it('écrit les structures fusionnées avec leurs services numériques', async (): Promise<void> => {
    provideImplementations([STRUCTURE], [SERVICE]);

    await extraireDataInclusion({ dataInclusionApiKey: 'une-cle', filter: 'dora', outputFile: './dora.json' });

    expect(written[0]?.outputFile).toBe('./dora.json');
    expect(written[0]?.records).toHaveLength(1);
    expect(written[0]?.records[0]?.nom).toBe('La Maison du Numérique');
  });

  it('écarte les enregistrements dont la source ne correspond pas au filtre', async (): Promise<void> => {
    provideImplementations([STRUCTURE], [SERVICE]);

    await extraireDataInclusion({ dataInclusionApiKey: 'une-cle', filter: 'fredo', outputFile: './fredo.json' });

    expect(written[0]?.records).toStrictEqual([]);
  });

  it('écarte les services qui ne sont pas numériques', async (): Promise<void> => {
    provideImplementations([STRUCTURE], [{ ...SERVICE, thematiques: ['mobilite'] } as unknown as SchemaServiceDataInclusion]);

    await extraireDataInclusion({ dataInclusionApiKey: 'une-cle', filter: 'dora', outputFile: './dora.json' });

    expect(written[0]?.records).toStrictEqual([]);
  });
});
