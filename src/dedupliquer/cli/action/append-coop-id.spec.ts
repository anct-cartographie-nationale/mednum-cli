import { describe, expect, it } from 'vitest';
import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { appendCoopId } from './append-coop-id';

describe('append coop id', () => {
  it('should not do anything when there is no coop id in data', () => {
    const lieu: SchemaLieuMediationNumerique = {
      id: '1',
      nom: 'Test Lieu',
      commune: 'Paris',
      code_postal: '75001',
      adresse: '123 Rue de Test',
      code_insee: '12345',
      source: 'test-source',
      typologie: 'RFS',
      latitude: 48.8566,
      longitude: 2.3522,
      date_maj: '2023-10-01',
      pivot: '0000000000000'
    };

    const result: SchemaLieuMediationNumerique & { structure_coop_id?: string } = appendCoopId(lieu);

    expect(result.structure_coop_id).toBeUndefined();
  });

  it('should add coop id when there is coop id in data', () => {
    const lieu: SchemaLieuMediationNumerique = {
      id: 'Numi_Coop-numérique_ab44105b-ed1a-4922-bff6-78e9cc1bda78',
      nom: 'Test Lieu',
      commune: 'Paris',
      code_postal: '75001',
      adresse: '123 Rue de Test',
      code_insee: '12345',
      source: 'test-source',
      typologie: 'RFS',
      latitude: 48.8566,
      longitude: 2.3522,
      date_maj: '2023-10-01',
      pivot: '0000000000000'
    };

    const result: SchemaLieuMediationNumerique & { structure_coop_id?: string } = appendCoopId(lieu);

    expect(result.structure_coop_id).toBe('ab44105b-ed1a-4922-bff6-78e9cc1bda78');
  });
});
