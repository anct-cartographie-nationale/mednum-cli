/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { removeDuplicates } from './remove-duplicates';

describe('remove duplicates', (): void => {
  it('should not remove lieux when there is no duplicates', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '574-mediation-numerique-hinaura',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey (chez Aconit)',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962
      } as SchemaLieuMediationNumerique,
      {
        id: '537-mediation-numerique-hinaura',
        nom: 'La Turbine.Coop',
        adresse: '5 esplanade Andry Farcy 38000 Grenoble',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: '574-mediation-numerique-hinaura',
        nom: 'Numerinaute',
        adresse: '12 Rue Joseph Rey (chez Aconit)',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.186115,
        longitude: 5.716962
      } as SchemaLieuMediationNumerique,
      {
        id: '537-mediation-numerique-hinaura',
        nom: 'La Turbine.Coop',
        adresse: '5 esplanade Andry Farcy 38000 Grenoble',
        code_postal: '38000',
        commune: 'Grenoble',
        latitude: 45.187654,
        longitude: 5.704953
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should remove oldest lieux when there is two duplicate', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '1',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'hinaura'
      } as SchemaLieuMediationNumerique,
      {
        id: '2',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2019-08-01',
        source: 'francil-in'
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: '1',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'hinaura'
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should merge extra field from lieu 2 duplicate', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '1',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'hinaura'
      } as SchemaLieuMediationNumerique,
      {
        id: '2',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-01-16',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'francil-in'
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: '1',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura'
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should merge extra field from lieu 1 duplicate', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '1',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-01-16',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura'
      } as SchemaLieuMediationNumerique,
      {
        id: '2',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in'
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: '2',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'francil-in'
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should merge extra field from lieu 2 duplicate which source that is not conseiller numerique', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '1',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'conseiller-numerique'
      } as SchemaLieuMediationNumerique,
      {
        id: '2',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-01-16',
        courriel: 'commune-de-durtal@france-services.fr'
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: '1',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'conseiller-numerique',
        courriel: 'commune-de-durtal@france-services.fr'
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should not merge extra field from lieu 2 duplicate when duplicate is too old', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '1',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'hinaura'
      } as SchemaLieuMediationNumerique,
      {
        id: '2',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2019-01-16',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'francil-in'
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: '1',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'hinaura'
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should not merge extra field from lieu 1 duplicate when duplicate is too old', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '1',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2019-01-16',
        courriel: 'commune-de-durtal@france-services.fr',
        source: 'hinaura'
      } as SchemaLieuMediationNumerique,
      {
        id: '2',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in'
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: '2',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'francil-in'
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should not merge extra field from lieu 2 duplicate with conseiller-numerique fields when duplicate is too old', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '1',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'conseiller-numerique'
      } as SchemaLieuMediationNumerique,
      {
        id: '2',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2019-01-16',
        courriel: 'commune-de-durtal@france-services.fr'
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: '1',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2023-05-03',
        source: 'conseiller-numerique'
      } as SchemaLieuMediationNumerique
    ]);
  });

  it('should not merge extra field from lieu 1 duplicate with conseiller-numerique fields when duplicate is too old', (): void => {
    const lieux: SchemaLieuMediationNumerique[] = [
      {
        id: '1',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'Durtal',
        latitude: 47.6699154795,
        longitude: -0.2551539846,
        date_maj: '2019-01-16',
        courriel: 'commune-de-durtal@france-services.fr'
      } as SchemaLieuMediationNumerique,
      {
        id: '2',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'conseiller-numerique'
      } as SchemaLieuMediationNumerique
    ];

    const lieuxWithoutDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date('2023-05-30'))(lieux);

    expect(lieuxWithoutDuplicates).toStrictEqual([
      {
        id: '2',
        nom: 'France Services Durtal',
        adresse: '11 rue Joseph Cugnot',
        code_postal: '49430',
        commune: 'DURTAL',
        latitude: 47.671271,
        longitude: -0.256457,
        date_maj: '2023-05-03',
        source: 'conseiller-numerique'
      } as SchemaLieuMediationNumerique
    ]);
  });
});
