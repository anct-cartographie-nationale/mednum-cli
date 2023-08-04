/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { zrrMapFromTransfer, ZrrTransfer } from './zrr.transfer';

describe('zrr transfer', (): void => {
  it('should not get any zrr in map when transfer is empty', (): void => {
    const transfer: ZrrTransfer[] = [];

    const zrrMap: Map<string, boolean> = zrrMapFromTransfer(transfer);

    expect(zrrMap).toStrictEqual(new Map<string, boolean>());
  });

  it('should get false for code Insee 01041 that is not ZRR', (): void => {
    const transfer: ZrrTransfer[] = [
      {
        com2018: '01041',
        nom_region: 'Auvergne-Rhône-Alpes',
        statut_zrr: 'Non classée',
        commune_2018: 'Bettant',
        nom_dept: 'Ain',
        population_2015: 753
      }
    ];

    const zrrMap: Map<string, boolean> = zrrMapFromTransfer(transfer);

    expect(zrrMap).toStrictEqual(new Map<string, boolean>([['01041', false]]));
  });

  it('should get true for code Insee 01041 that is ZRR', (): void => {
    const transfer: ZrrTransfer[] = [
      {
        com2018: '01080',
        nom_region: 'Auvergne-Rhône-Alpes',
        statut_zrr: 'Bénéficiaire',
        commune_2018: 'Champdor-Corcelles',
        nom_dept: 'Ain',
        population_2015: 663
      }
    ];

    const zrrMap: Map<string, boolean> = zrrMapFromTransfer(transfer);

    expect(zrrMap).toStrictEqual(new Map<string, boolean>([['01080', true]]));
  });

  it('should multiple items in ZRR map', (): void => {
    const transfer: ZrrTransfer[] = [
      {
        com2018: '01080',
        nom_region: 'Auvergne-Rhône-Alpes',
        statut_zrr: 'Bénéficiaire',
        commune_2018: 'Champdor-Corcelles',
        nom_dept: 'Ain',
        population_2015: 663
      },
      {
        com2018: '01041',
        nom_region: 'Auvergne-Rhône-Alpes',
        statut_zrr: 'Non classée',
        commune_2018: 'Bettant',
        nom_dept: 'Ain',
        population_2015: 753
      }
    ];

    const zrrMap: Map<string, boolean> = zrrMapFromTransfer(transfer);

    expect(zrrMap).toStrictEqual(
      new Map<string, boolean>([
        ['01080', true],
        ['01041', false]
      ])
    );
  });
});
