import { describe, expect, it } from 'vitest';
import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { withoutObsoleteLabels } from './without-obsolete-labels';

const LIEU: SchemaLieuMediationNumerique = {
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

describe('without obsolete labels', (): void => {
  it('should not change a lieu without autres_formations_labels', (): void => {
    expect(withoutObsoleteLabels(LIEU)).toBe(LIEU);
  });

  it('should keep autres_formations_labels untouched when there is no obsolete label', (): void => {
    const lieu: SchemaLieuMediationNumerique = { ...LIEU, autres_formations_labels: 'QPV|FRR' };

    expect(withoutObsoleteLabels(lieu)).toStrictEqual(lieu);
  });

  it('should drop the obsolete ZRR label and keep the others', (): void => {
    const lieu: SchemaLieuMediationNumerique = { ...LIEU, autres_formations_labels: 'QPV|FRR|ZRR' };

    expect(withoutObsoleteLabels(lieu)).toStrictEqual({ ...LIEU, autres_formations_labels: 'QPV|FRR' });
  });

  it('should drop the obsolete ZRR label regardless of case and surrounding spaces', (): void => {
    const lieu: SchemaLieuMediationNumerique = { ...LIEU, autres_formations_labels: 'FRR| zrr |Zrr' };

    expect(withoutObsoleteLabels(lieu)).toStrictEqual({ ...LIEU, autres_formations_labels: 'FRR' });
  });

  it('should remove autres_formations_labels entirely when only obsolete labels remain', (): void => {
    const lieu: SchemaLieuMediationNumerique = { ...LIEU, autres_formations_labels: 'ZRR' };

    const result: SchemaLieuMediationNumerique = withoutObsoleteLabels(lieu);

    expect(result).toStrictEqual(LIEU);
    expect('autres_formations_labels' in result).toBe(false);
  });
});
