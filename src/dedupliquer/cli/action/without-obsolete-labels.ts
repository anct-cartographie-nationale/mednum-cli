import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';

// Labels devenus obsolètes que l'on ne réexpose plus : ZRR a été remplacé par
// France Ruralités Revitalisation (FRR) au 1er juillet 2024.
const OBSOLETE_LABELS: string[] = ['zrr'];

const isObsoleteLabel = (label: string): boolean => OBSOLETE_LABELS.includes(label.trim().toLowerCase());

export const withoutObsoleteLabels = (lieu: SchemaLieuMediationNumerique): SchemaLieuMediationNumerique => {
  if (lieu.autres_formations_labels == null) return lieu;

  const keptLabels: string = lieu.autres_formations_labels
    .split('|')
    .filter((label: string): boolean => !isObsoleteLabel(label))
    .join('|');

  if (keptLabels === lieu.autres_formations_labels) return lieu;
  if (keptLabels !== '') return { ...lieu, autres_formations_labels: keptLabels };

  const lieuWithoutObsoleteLabels: SchemaLieuMediationNumerique = { ...lieu };
  delete lieuWithoutObsoleteLabels.autres_formations_labels;
  return lieuWithoutObsoleteLabels;
};
