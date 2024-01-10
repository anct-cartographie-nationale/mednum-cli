/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { MultiPolygon, Polygon } from '@turf/turf';
import { QpvShapesMap } from '../../../fields';
import { qpvShapesMapFromTransfer, QpvTransfer } from './qpv.transfer';

const QPV_IN_01053_SHAPE: Polygon = {
  coordinates: [
    [
      [5.2368096446, 46.2111175423],
      [5.236787916, 46.2109630552],
      [5.2353574066, 46.2099668888],
      [5.2340913402, 46.2090846346],
      [5.2335667545, 46.2093300498],
      [5.233119833, 46.2095072928],
      [5.2329307078, 46.2095672303],
      [5.2368096446, 46.2111175423]
    ]
  ],
  type: 'Polygon'
};

const QPV_IN_01053: QpvTransfer = {
  geo_shape: { type: 'Feature', geometry: QPV_IN_01053_SHAPE, properties: {} },
  list_com_2023: '01053'
};

const QPV_1_IN_02691_SHAPE: Polygon = {
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

const QPV_1_IN_02691: QpvTransfer = {
  geo_shape: { type: 'Feature', geometry: QPV_1_IN_02691_SHAPE, properties: {} },
  list_com_2023: '02691'
};

const QPV_2_IN_02691_SHAPE: Polygon = {
  coordinates: [
    [
      [3.2688389444, 49.8542289588],
      [3.2698198806, 49.8535784719],
      [3.2703779095, 49.8534867139],
      [3.2716256344, 49.8534659146],
      [3.2722010342, 49.8532658839],
      [3.272547131, 49.8536591022],
      [3.2728391099, 49.8539651074],
      [3.2688389444, 49.8542289588]
    ]
  ],
  type: 'Polygon'
};

const QPV_2_IN_02691: QpvTransfer = {
  geo_shape: { type: 'Feature', geometry: QPV_2_IN_02691_SHAPE, properties: {} },
  list_com_2023: '02691'
};

const QPV_MULTIPOLYGON_IN_02691_SHAPE: MultiPolygon = {
  coordinates: [
    [
      [
        [3.3155745992, 49.8361707927],
        [3.315905846, 49.8362365181],
        [3.316198636, 49.8362329679],
        [3.3162348085, 49.8362400703],
        [3.3165592002, 49.8361394968],
        [3.3166289092, 49.8361788491],
        [3.3167165082, 49.8360047984],
        [3.3155745992, 49.8361707927]
      ],
      [
        [3.2688389444, 49.8542289588],
        [3.2698198806, 49.8535784719],
        [3.2703779095, 49.8534867139],
        [3.2716256344, 49.8534659146],
        [3.2722010342, 49.8532658839],
        [3.272547131, 49.8536591022],
        [3.2728391099, 49.8539651074],
        [3.2688389444, 49.8542289588]
      ]
    ]
  ],
  type: 'MultiPolygon'
};

const QPV_MULTIPOLYGON_IN_02691: QpvTransfer = {
  geo_shape: { type: 'Feature', geometry: QPV_MULTIPOLYGON_IN_02691_SHAPE, properties: {} },
  list_com_2023: '02691'
};

describe('qpv transfer', (): void => {
  it('should not convert single QPV to QPV shapes map', (): void => {
    const qpvTransferData: QpvTransfer[] = [QPV_IN_01053];

    const qpvShapesMap: QpvShapesMap = qpvShapesMapFromTransfer(qpvTransferData);

    expect(qpvShapesMap).toStrictEqual(new Map<string, Polygon[]>([[QPV_IN_01053.list_com_2023, [QPV_IN_01053_SHAPE]]]));
  });

  it('should convert single QPV to QPV shapes map', (): void => {
    const qpvTransferData: QpvTransfer[] = [QPV_IN_01053];

    const qpvShapesMap: QpvShapesMap = qpvShapesMapFromTransfer(qpvTransferData);

    expect(qpvShapesMap).toStrictEqual(new Map<string, Polygon[]>([[QPV_IN_01053.list_com_2023, [QPV_IN_01053_SHAPE]]]));
  });

  it('should convert multiple QPV to QPV shapes map', (): void => {
    const qpvTransferData: QpvTransfer[] = [QPV_IN_01053, QPV_1_IN_02691];

    const qpvShapesMap: QpvShapesMap = qpvShapesMapFromTransfer(qpvTransferData);

    expect(qpvShapesMap).toStrictEqual(
      new Map<string, Polygon[]>([
        [QPV_IN_01053.list_com_2023, [QPV_IN_01053_SHAPE]],
        [QPV_1_IN_02691.list_com_2023, [QPV_1_IN_02691_SHAPE]]
      ])
    );
  });

  it('should convert multiple QPV with same code INSEE to QPV shapes map', (): void => {
    const qpvTransferData: QpvTransfer[] = [QPV_IN_01053, QPV_1_IN_02691, QPV_2_IN_02691];

    const qpvShapesMap: QpvShapesMap = qpvShapesMapFromTransfer(qpvTransferData);

    expect(qpvShapesMap).toStrictEqual(
      new Map<string, Polygon[]>([
        [QPV_IN_01053.list_com_2023, [QPV_IN_01053_SHAPE]],
        [QPV_1_IN_02691.list_com_2023, [QPV_1_IN_02691_SHAPE, QPV_2_IN_02691_SHAPE]]
      ])
    );
  });

  it('should convert multipolyon to list of polygons in qpv shapes map', (): void => {
    const qpvTransferData: QpvTransfer[] = [QPV_MULTIPOLYGON_IN_02691];

    const qpvShapesMap: QpvShapesMap = qpvShapesMapFromTransfer(qpvTransferData);

    expect(qpvShapesMap).toStrictEqual(
      new Map<string, Polygon[]>([[QPV_1_IN_02691.list_com_2023, [QPV_1_IN_02691_SHAPE, QPV_2_IN_02691_SHAPE]]])
    );
  });
});
