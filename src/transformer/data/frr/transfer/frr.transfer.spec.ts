import { describe, it, expect } from 'vitest';
import { frrMapFromTransfer, FrrTransfer } from './frr.transfer';

describe('frr transfer', (): void => {
  it('should not get any frr in map when transfer is empty', (): void => {
    const transfer: FrrTransfer[] = [];

    const frrMap: Map<string, boolean> = frrMapFromTransfer(transfer);

    expect(frrMap).toStrictEqual(new Map<string, boolean>());
  });

  it('should get true for code Insee 01080 that is classified in FRR', (): void => {
    const transfer: FrrTransfer[] = [{ codgeo: '01080', codefrr: '4' }];

    const frrMap: Map<string, boolean> = frrMapFromTransfer(transfer);

    expect(frrMap).toStrictEqual(new Map<string, boolean>([['01080', true]]));
  });

  it('should ignore communes not classified in FRR (codefrr -9999)', (): void => {
    const transfer: FrrTransfer[] = [
      { codgeo: '01080', codefrr: '4' },
      { codgeo: '01001', codefrr: '-9999' }
    ];

    const frrMap: Map<string, boolean> = frrMapFromTransfer(transfer);

    expect(frrMap).toStrictEqual(new Map<string, boolean>([['01080', true]]));
  });

  it('should keep every FRR classification value other than -9999', (): void => {
    const transfer: FrrTransfer[] = [
      { codgeo: '01060', codefrr: '1' },
      { codgeo: '01999', codefrr: '2' },
      { codgeo: '02000', codefrr: '3' },
      { codgeo: '01080', codefrr: '4' },
      { codgeo: '01029', codefrr: '5' }
    ];

    const frrMap: Map<string, boolean> = frrMapFromTransfer(transfer);

    expect(frrMap).toStrictEqual(
      new Map<string, boolean>([
        ['01060', true],
        ['01999', true],
        ['02000', true],
        ['01080', true],
        ['01029', true]
      ])
    );
  });
});
