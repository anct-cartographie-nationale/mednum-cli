import { describe, it, expect } from 'vitest';
import type { LieuxMediationNumeriqueMatching, DataSource } from '../../matching';
import { processId } from './id.field';

const AVEC_COLONNE: LieuxMediationNumeriqueMatching = {
  id: { colonne: 'ID' },
  source: { colonne: 'source' },
  nom: { colonne: 'nom' },
  commune: { colonne: 'commune' },
  adresse: { colonne: 'adresse' }
} as LieuxMediationNumeriqueMatching;

const SANS_COLONNE: LieuxMediationNumeriqueMatching = {
  nom: { colonne: 'nom' },
  commune: { colonne: 'commune' },
  adresse: { colonne: 'adresse' }
} as LieuxMediationNumeriqueMatching;

const LIEU: DataSource = { nom: 'Médiathèque Jacques Demy', commune: 'Nantes', adresse: '24 quai de la Fosse' };

describe('id field', (): void => {
  it('reprend l’identifiant de la source quand elle en fournit un', (): void => {
    expect(processId({ ID: 'a91cae7af848a1c65', source: 'Hinaura' }, AVEC_COLONNE, 'Default')).toBe(
      'Hinaura_a91cae7af848a1c65'
    );
  });

  it('dérive l’identifiant du contenu quand la source n’a pas de colonne identifiant', (): void => {
    expect(processId(LIEU, SANS_COLONNE, 'Paca')).toMatch(/^Paca_[0-9a-f]{16}$/u);
  });

  it('dérive l’identifiant du contenu quand la colonne existe mais que la valeur est vide', (): void => {
    expect(processId({ ...LIEU, ID: '' }, AVEC_COLONNE, 'Loire Atlantique')).toMatch(/^Loire-Atlantique_[0-9a-f]{16}$/u);
  });

  it('rend le même identifiant pour le même contenu, quel que soit le rang de la ligne', (): void => {
    expect(processId(LIEU, SANS_COLONNE, 'Paca')).toBe(processId({ ...LIEU }, SANS_COLONNE, 'Paca'));
  });

  it('distingue deux lieux qui ne diffèrent que par l’adresse', (): void => {
    expect(processId(LIEU, SANS_COLONNE, 'Paca')).not.toBe(
      processId({ ...LIEU, adresse: '25 quai de la Fosse' }, SANS_COLONNE, 'Paca')
    );
  });

  it('distingue deux lieux homonymes de communes différentes', (): void => {
    expect(processId(LIEU, SANS_COLONNE, 'Paca')).not.toBe(processId({ ...LIEU, commune: 'Rezé' }, SANS_COLONNE, 'Paca'));
  });

  it('ignore la casse et les accents, que la source écrit sans constance', (): void => {
    expect(processId(LIEU, SANS_COLONNE, 'Paca')).toBe(
      processId({ nom: 'MEDIATHEQUE  JACQUES DEMY', commune: 'NANTES', adresse: '24 QUAI DE LA FOSSE' }, SANS_COLONNE, 'Paca')
    );
  });
});
