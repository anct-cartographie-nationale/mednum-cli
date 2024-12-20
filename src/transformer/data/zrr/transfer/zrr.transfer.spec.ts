import { zrrMapFromTransfer, ZrrTransfer } from './zrr.transfer';

describe('zrr transfer', (): void => {
  it('should not get any zrr in map when transfer is empty', (): void => {
    const transfer: ZrrTransfer[] = [];

    const zrrMap: Map<string, boolean> = zrrMapFromTransfer(transfer);

    expect(zrrMap).toStrictEqual(new Map<string, boolean>());
  });

  it('should get true for code Insee 01080 that is ZRR', (): void => {
    const transfer: ZrrTransfer[] = [
      {
        codgeo: '01080'
      }
    ];

    const zrrMap: Map<string, boolean> = zrrMapFromTransfer(transfer);

    expect(zrrMap).toStrictEqual(new Map<string, boolean>([['01080', true]]));
  });
});
