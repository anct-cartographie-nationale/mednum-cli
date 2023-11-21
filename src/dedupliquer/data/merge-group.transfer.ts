import { MergeGroup } from '../steps';

export type MergeGroupTransfer = {
  mergeGroups: MergeGroup[];
  groupIdsToDelete: string[];
};
