import { describe, expect, it } from 'vitest';
import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { excludeById } from './exclude-by-id';

const LIEU: SchemaLieuMediationNumerique = {
  id: '1',
  nom: 'Lieu',
  commune: 'Paris',
  code_postal: '75001',
  adresse: '123 Rue de Test',
  date_maj: '2023-10-01',
  pivot: '0000000000000'
};

const EXCLUDED_LIEU: SchemaLieuMediationNumerique = {
  id: '2',
  nom: 'Autre Lieu',
  commune: 'Lyon',
  code_postal: '69001',
  adresse: '456 Avenue de Exemple',
  date_maj: '2023-09-15',
  pivot: '1111111111111'
};

describe('Exclude by id', () => {
  it('should not filter anything when there is nothing to filter', () => {
    const idsToExclude: string[] = [];

    const filteredLieux = excludeById(idsToExclude)(LIEU);

    expect(filteredLieux).toEqual(true);
  });

  it('should exclude lieux matching id', () => {
    const idsToExclude: string[] = ['2'];

    const filteredLieux = excludeById(idsToExclude)(EXCLUDED_LIEU);

    expect(filteredLieux).toEqual(false);
  });
});
