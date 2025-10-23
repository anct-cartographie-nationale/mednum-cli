import { describe, it, expect } from 'vitest';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { processNom } from './nom.field';

describe('nom field', (): void => {
  it('should get nom from data source using matching information', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: {
        colonne: 'Nom du lieu ou de la structure *'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      'Nom du lieu ou de la structure *': 'Anonymal'
    };

    const nom: string = processNom(source, matching);

    expect(nom).toBe('Anonymal');
  });

  it.each([
    "Découvrir et m'approprier les services de francetravail.fr",
    'Réussir mes échanges avec France Travail',
    'Mobiliser mes services numériques France Travail',
    'Ordinateur',
    'Wifi'
  ])('should get empty nom when source nom is equal to "%s"', (invalidNom: string): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      nom: {
        colonne: 'Nom du lieu ou de la structure *'
      }
    } as LieuxMediationNumeriqueMatching;

    const source: DataSource = {
      'Nom du lieu ou de la structure *': invalidNom
    };

    const nom = () => processNom(source, matching);

    expect(nom).toThrow("Le Nom  n'est pas valide");
  });
});
