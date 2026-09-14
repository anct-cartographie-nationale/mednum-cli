import { extensionOf } from '../../../libraries/file-system/path';

export const SUPPORTED_MERGE_FORMATS = ['.csv', '.json'] as const;

export type MergeFormat = (typeof SUPPORTED_MERGE_FORMATS)[number];

const isSupported = (extension: string): extension is MergeFormat =>
  (SUPPORTED_MERGE_FORMATS as readonly string[]).includes(extension);

export const mergeFormatOf = (filePath: string): MergeFormat | undefined => {
  const extension: string = extensionOf(filePath);
  return isSupported(extension) ? extension : undefined;
};

export const hasFormat =
  (format: MergeFormat) =>
  (filePath: string): boolean =>
    extensionOf(filePath) === format;
