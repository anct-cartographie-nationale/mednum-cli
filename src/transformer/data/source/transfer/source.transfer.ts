export type SourceTransfer = {
  name: string;
  hash: string;
};

export type SourceMap = Map<string, string>;

export const sourceMapFromTransfer = (transfer: SourceTransfer[]): SourceMap =>
  transfer.reduce(
    (sourceMap: SourceMap, transferItem: SourceTransfer): SourceMap => sourceMap.set(transferItem.name, transferItem.hash),
    new Map<string, string>()
  );
