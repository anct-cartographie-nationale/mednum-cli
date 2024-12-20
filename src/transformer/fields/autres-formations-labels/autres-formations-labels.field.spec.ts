import { Adresse, Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { type Polygon } from 'geojson';
import { isInQpv, isInZrr } from '../../data';
import { LieuxMediationNumeriqueMatching } from '../../input';
import { processAutresFormationsLabels } from './autres-formations-labels.field';

const QPV_IN_02691_SHAPE: Polygon = {
  coordinates: [
    [
      [3.3155745992, 49.8361707927],
      [3.315905846, 49.8362365181],
      [3.316198636, 49.8362329679],
      [3.3162348085, 49.8362400703],
      [3.3165592002, 49.8361394968],
      [3.3166289092, 49.8361788491],
      [3.3167165082, 49.8360047984],
      [3.3155745992, 49.8361707927]
    ]
  ],
  type: 'Polygon'
};

const ADRESSE_OUT_OF_QPV_AND_ZRR: Adresse = Adresse({
  voie: '128, Rue Jean Jaurès',
  code_postal: '57100',
  code_insee: '02691',
  commune: 'Metz'
});

const LOCALISATION_OUT_OF_QPV_AND_ZRR: Localisation = Localisation({ latitude: 46.204, longitude: 5.225 });

const ADRESSE_IN_QPV: Adresse = Adresse({
  voie: '128, Rue Jean Jaurès',
  code_postal: '57100',
  code_insee: '02691',
  commune: 'Metz'
});

const ADRESSE_IN_ZRR: Adresse = Adresse({
  voie: '128, Rue Jean Jaurès',
  code_postal: '57100',
  code_insee: '01160',
  commune: 'Metz'
});

const LOCALISATION_IN_QPV: Localisation = Localisation({ latitude: 49.83615, longitude: 3.3162 });

describe('labels autres field', (): void => {
  it('should not get labels autres for empty value', (): void => {
    const labelsAutres: string[] = processAutresFormationsLabels(
      {},
      {} as LieuxMediationNumeriqueMatching,
      isInQpv(new Map([['02691', [QPV_IN_02691_SHAPE]]])),
      isInZrr(new Map([['01160', true]])),
      ADRESSE_OUT_OF_QPV_AND_ZRR,
      LOCALISATION_OUT_OF_QPV_AND_ZRR
    );

    expect(labelsAutres).toStrictEqual([]);
  });

  it('should not get empty string labels', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      autres_formations_labels: [
        {
          cible: ''
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const labelsAutres: string[] = processAutresFormationsLabels(
      {},
      matching,
      isInQpv(new Map([['02691', [QPV_IN_02691_SHAPE]]])),
      isInZrr(new Map([['01160', true]])),
      ADRESSE_OUT_OF_QPV_AND_ZRR,
      LOCALISATION_OUT_OF_QPV_AND_ZRR
    );

    expect(labelsAutres).toStrictEqual([]);
  });

  it('should get SudLabs default labels autres', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      autres_formations_labels: [
        {
          cible: 'SudLabs'
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const labelsAutres: string[] = processAutresFormationsLabels(
      {},
      matching,
      isInQpv(new Map([['02691', [QPV_IN_02691_SHAPE]]])),
      isInZrr(new Map([['01160', true]])),
      ADRESSE_OUT_OF_QPV_AND_ZRR,
      LOCALISATION_OUT_OF_QPV_AND_ZRR
    );

    expect(labelsAutres).toStrictEqual(['SudLabs']);
  });

  it('should get matching SudLabs and Nièvre médiation numérique labels autres', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      autres_formations_labels: [
        {
          colonnes: ['label'],
          termes: ['Nièvre médiation'],
          cible: 'Nièvre médiation'
        },
        {
          colonnes: ['label'],
          termes: ['SudLabs'],
          cible: 'SudLabs'
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const labelsAutres: string[] = processAutresFormationsLabels(
      {
        label: 'Nièvre médiation et SudLabs'
      },
      matching,
      isInQpv(new Map([['02691', [QPV_IN_02691_SHAPE]]])),
      isInZrr(new Map([['01160', true]])),
      ADRESSE_OUT_OF_QPV_AND_ZRR,
      LOCALISATION_OUT_OF_QPV_AND_ZRR
    );

    expect(labelsAutres).toStrictEqual(['Nièvre médiation', 'SudLabs']);
  });

  it('should not get any matching label autre', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      autres_formations_labels: [
        {
          colonnes: ['label'],
          termes: ['Nièvre médiation'],
          cible: 'Nièvre médiation'
        },
        {
          colonnes: ['label'],
          termes: ['SudLabs'],
          cible: 'SudLabs'
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const labelsAutres: string[] = processAutresFormationsLabels(
      {
        label: 'pas de labels'
      },
      matching,
      isInQpv(new Map([['02691', [QPV_IN_02691_SHAPE]]])),
      isInZrr(new Map([['01160', true]])),
      ADRESSE_OUT_OF_QPV_AND_ZRR,
      LOCALISATION_OUT_OF_QPV_AND_ZRR
    );

    expect(labelsAutres).toStrictEqual([]);
  });

  it('should get exact label autre from source with single column', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      autres_formations_labels: [
        {
          colonnes: ['label_1']
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const labelsAutres: string[] = processAutresFormationsLabels(
      {
        label_1: 'label 1'
      },
      matching,
      isInQpv(new Map([['02691', [QPV_IN_02691_SHAPE]]])),
      isInZrr(new Map([['01160', true]])),
      ADRESSE_OUT_OF_QPV_AND_ZRR,
      LOCALISATION_OUT_OF_QPV_AND_ZRR
    );

    expect(labelsAutres).toStrictEqual(['label 1']);
  });

  it('should get exact label autre from source with multiple columns', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      autres_formations_labels: [
        {
          colonnes: ['label_1', 'label_2']
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const labelsAutres: string[] = processAutresFormationsLabels(
      {
        label_1: 'label 1',
        label_2: 'label 2'
      },
      matching,
      isInQpv(new Map([['02691', [QPV_IN_02691_SHAPE]]])),
      isInZrr(new Map([['01160', true]])),
      ADRESSE_OUT_OF_QPV_AND_ZRR,
      LOCALISATION_OUT_OF_QPV_AND_ZRR
    );

    expect(labelsAutres).toStrictEqual(['label 1', 'label 2']);
  });

  it('should get QPV when code INSEE match a QPV area and localisation is in QPV area', (): void => {
    const labelsAutres: string[] = processAutresFormationsLabels(
      {},
      {} as LieuxMediationNumeriqueMatching,
      isInQpv(new Map([['02691', [QPV_IN_02691_SHAPE]]])),
      isInZrr(new Map([['01160', true]])),
      ADRESSE_IN_QPV,
      LOCALISATION_IN_QPV
    );

    expect(labelsAutres).toStrictEqual(['QPV']);
  });

  it('should get QPV with SudLabs default labels autres', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      autres_formations_labels: [
        {
          cible: 'SudLabs'
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const labelsAutres: string[] = processAutresFormationsLabels(
      {},
      matching,
      isInQpv(new Map([['02691', [QPV_IN_02691_SHAPE]]])),
      isInZrr(new Map([['01160', true]])),
      ADRESSE_IN_QPV,
      LOCALISATION_IN_QPV
    );

    expect(labelsAutres).toStrictEqual(['QPV', 'SudLabs']);
  });

  it('should get ZRR when code INSEE match a ZRR', (): void => {
    const labelsAutres: string[] = processAutresFormationsLabels(
      {},
      {} as LieuxMediationNumeriqueMatching,
      isInQpv(new Map([['02691', [QPV_IN_02691_SHAPE]]])),
      isInZrr(new Map([['01160', true]])),
      ADRESSE_IN_ZRR,
      LOCALISATION_IN_QPV
    );

    expect(labelsAutres).toStrictEqual(['ZRR']);
  });

  it('should get QPV and ZRR when code INSEE match the both cases', (): void => {
    const labelsAutres: string[] = processAutresFormationsLabels(
      {},
      {} as LieuxMediationNumeriqueMatching,
      isInQpv(new Map([['02691', [QPV_IN_02691_SHAPE]]])),
      isInZrr(new Map([['02691', true]])),
      ADRESSE_IN_QPV,
      LOCALISATION_IN_QPV
    );

    expect(labelsAutres).toStrictEqual(['QPV', 'ZRR']);
  });

  it('should get only one QPV if QPV is set in source', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      autres_formations_labels: [
        {
          cible: 'QPV'
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const labelsAutres: string[] = processAutresFormationsLabels(
      { labels_autres: 'QPV' },
      matching,
      isInQpv(new Map([['02691', [QPV_IN_02691_SHAPE]]])),
      isInZrr(new Map([['02691', false]])),
      ADRESSE_IN_QPV,
      LOCALISATION_IN_QPV
    );

    expect(labelsAutres).toStrictEqual(['QPV']);
  });
});
