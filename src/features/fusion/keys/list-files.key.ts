import { type InjectionKey, keyFor } from '../../../libraries/injection/index';

export type ListFiles = (pattern: string) => string[];

export const LIST_FILES: InjectionKey<ListFiles> = keyFor<ListFiles>('fusion.list-files');
