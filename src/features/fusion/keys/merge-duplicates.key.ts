import { type InjectionKey, keyFor } from '../../../libraries/injection';

/**
 * Réduit les enregistrements d'une fusion cumulative à un par entité. La fusion ignore ce qui
 * identifie un enregistrement et lequel retenir quand deux se présentent : elle le demande.
 */
export type MergeDuplicates = (records: unknown[]) => unknown[];

export const MERGE_DUPLICATES: InjectionKey<MergeDuplicates> = keyFor<MergeDuplicates>('fusion.merge-duplicates');
