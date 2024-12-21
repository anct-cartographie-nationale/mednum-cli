import { describe, it, expect } from 'vitest';
import { SourceMap, sourceMapFromTransfer, SourceTransfer } from './source.transfer';

describe('source transfer', (): void => {
  it('should transform empty source transfer to empty source map', (): void => {
    const transfer: SourceTransfer[] = [];

    const sourceMap: SourceMap = sourceMapFromTransfer(transfer);

    expect(sourceMap).toStrictEqual(new Map<string, string>());
  });

  it('should transform source transfer to source map with one item indexed by name', (): void => {
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
