import type { LieuMediationNumerique, Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { describe, expect, it } from 'vitest';
import { isLocated, toLieuxMediationNumerique, UNLOCATED_FIELD } from './to-lieux-mediation-numerique';
import { AddressCache } from './address-cache';
import { type LocationEnriched, UNRESOLVED_REASONS } from './geocoding';
import type { LieuxMediationNumeriqueMatching } from './matching';
import { Report } from './report';
import type { TransformationRepository } from './transformation-repository';
import { findCommune } from '../../enrichissement-territorial';

const lieu = (localisation?: Localisation): LieuMediationNumerique =>
  ({ nom: 'Un lieu', ...(localisation == null ? {} : { localisation }) }) as LieuMediationNumerique;

describe('isLocated', (): void => {
  it('retient un lieu que le géocodage a su situer', (): void => {
    expect(isLocated(lieu({ latitude: 48.868989, longitude: 2.33115 } as Localisation))).toBe(true);
  });

  it('écarte un lieu sans coordonnées, qu’aucune carte ne saurait porter', (): void => {
    expect(isLocated(lieu())).toBe(false);
  });
});

const MATCHING = {
  id: { colonne: 'id' },
  nom: { colonne: 'nom' },
  adresse: { colonne: 'adresse' },
  code_postal: { colonne: 'cp' },
  commune: { colonne: 'ville' },
  services: [
    {
      colonnes: ['services'],
      termes: ['Utilisation sécurisée du numérique'],
      cible: 'Utilisation sécurisée du numérique'
    }
  ],
  date_maj: { colonne: 'maj' },
  latitude: { colonne: 'latitude' },
  longitude: { colonne: 'longitude' }
} as unknown as LieuxMediationNumeriqueMatching;

const REPOSITORY: TransformationRepository = {
  config: MATCHING,
  findCommune: findCommune([]),
  isInQpv: (): boolean => false,
  isInFrr: (): boolean => false,
  geocode: () => async (): Promise<Localisation> => null as unknown as Localisation
};

const SOURCE = {
  id: '1',
  nom: 'Un lieu introuvable',
  adresse: 'Mairie',
  cp: '42920',
  ville: 'Chalmazel',
  services: 'Utilisation sécurisée du numérique',
  maj: '2026-09-16'
};

const ecarte = async (locationEnriched: LocationEnriched, report: Report): Promise<LieuMediationNumerique | undefined> =>
  toLieuxMediationNumerique(REPOSITORY, 'Essai', report, AddressCache(), locationEnriched)(SOURCE, 0);

describe('toLieuxMediationNumerique, quand le référentiel n’a pas reconnu l’adresse', (): void => {
  it('n’émet aucun lieu', async (): Promise<void> => {
    expect(await ecarte({ statut: 'no_from_storage', addresseOriginale: 'Mairie 42920 Chalmazel' }, Report())).toBeUndefined();
  });

  it('porte le retrait au rapport, pour qu’aucun lieu ne disparaisse en silence', async (): Promise<void> => {
    const report: Report = Report();

    await ecarte(
      { statut: 'no_from_storage', addresseOriginale: 'Mairie 42920 Chalmazel', motif: UNRESOLVED_REASONS.neverAnswered },
      report
    );

    const erreurs = report.records().flatMap((record) => record.errors);
    expect(erreurs).toHaveLength(1);
    expect(erreurs[0]).toMatchObject({ field: UNLOCATED_FIELD, entryName: 'Un lieu introuvable' });
    expect(erreurs[0]?.message).toContain('Mairie 42920 Chalmazel');
    expect(erreurs[0]?.message).toContain(UNRESOLVED_REASONS.neverAnswered);
  });

  it('ne prête pas son motif à un lieu écarté pour une autre raison, déjà consignée', async (): Promise<void> => {
    const report: Report = Report();
    const sansNom = { ...SOURCE, nom: '' };

    const lieuEmis = await toLieuxMediationNumerique(REPOSITORY, 'Essai', report, AddressCache(), {
      statut: 'no_from_storage',
      addresseOriginale: 'Mairie 42920 Chalmazel',
      motif: UNRESOLVED_REASONS.neverAnswered
    })(sansNom, 0);

    const erreurs = report.records().flatMap((record) => record.errors);
    expect(lieuEmis).toBeUndefined();
    expect(erreurs.map(({ field }) => field)).not.toContain(UNLOCATED_FIELD);
    expect(erreurs).toHaveLength(1);
  });

  it('émet le lieu et ne rapporte rien lorsque le géocodage a abouti', async (): Promise<void> => {
    const report: Report = Report();
    const donnees = { data: { latitude: 45.7, longitude: 3.9 }, statut: 'from_api' as const };

    const lieuEmis = await toLieuxMediationNumerique(
      REPOSITORY,
      'Essai',
      report,
      AddressCache(),
      donnees
    )({ ...SOURCE, ...donnees.data }, 0);

    expect(lieuEmis).toBeDefined();
    expect(report.records().flatMap((record) => record.errors)).toHaveLength(0);
  });
});
