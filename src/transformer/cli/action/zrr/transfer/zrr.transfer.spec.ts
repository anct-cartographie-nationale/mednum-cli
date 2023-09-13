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
        codgeo: '01041',
        zrr_simp: 'NC - Commune non classée'
      }
    ];

    const zrrMap: Map<string, boolean> = zrrMapFromTransfer(transfer);

    expect(zrrMap).toStrictEqual(new Map<string, boolean>([['01041', false]]));
  });

  it('should get true for code Insee 01041 that is ZRR', (): void => {
    const transfer: ZrrTransfer[] = [
      {
        codgeo: '01080',
        zrr_simp: 'C - Classée en ZRR'
      }
    ];

    const zrrMap: Map<string, boolean> = zrrMapFromTransfer(transfer);

    expect(zrrMap).toStrictEqual(new Map<string, boolean>([['01080', true]]));
  });

  it('should multiple items in ZRR map', (): void => {
    const transfer: ZrrTransfer[] = [
      {
        codgeo: '01080',
        zrr_simp: 'C - Classée en ZRR'
      },
      {
        codgeo: '01041',
        zrr_simp: 'NC - Commune non classée'
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
