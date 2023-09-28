/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { SourceMap, sourceMapFromTransfer, SourceTransfer } from './source.transfer';

describe('zrr transfer', (): void => {
  it('should not get any zrr in map when transfer is empty', (): void => {
    const transfer: SourceTransfer[] = [];

    const sourceMap: SourceMap = sourceMapFromTransfer(transfer);

    expect(sourceMap).toStrictEqual(new Map<string, string>());
  });

  it('should get true for code Insee 01080 that is ZRR', (): void => {
    const transfer: SourceTransfer[] = [
      {
        name: 'Hinaura',
        hash: '39839892cbee68669c74545d3e868f04ecc22a19b0e8567410a47661c2464333'
      }
    ];

    const sourceMap: SourceMap = sourceMapFromTransfer(transfer);

    expect(sourceMap).toStrictEqual(
      new Map<string, string>([['Hinaura', '39839892cbee68669c74545d3e868f04ecc22a19b0e8567410a47661c2464333']])
    );
  });
});
