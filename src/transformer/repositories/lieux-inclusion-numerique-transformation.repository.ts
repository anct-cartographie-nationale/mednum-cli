import { Erp, FindCommune, IsInQpv, IsInZrr } from '../fields';
import { LieuxMediationNumeriqueMatching } from '../input';

export type LieuxDeMediationNumeriqueTransformationRepository = {
  config: LieuxMediationNumeriqueMatching;
  accesLibre: Erp[];
  findCommune: FindCommune;
  isInQpv: IsInQpv;
  isInZrr: IsInZrr;
};
