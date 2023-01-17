import { LabelNational, LabelsNationaux } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Choice, LieuxMediationNumeriqueMatching } from '../../input';

export const processLabelsNationaux = (matching: LieuxMediationNumeriqueMatching): LabelsNationaux =>
  LabelsNationaux(matching.labels_nationaux?.map((choice: Choice<LabelNational>): LabelNational => choice.cible) ?? []);
