import { Typologie } from '@gouvfr-anct/lieux-de-mediation-numerique';

export const TYPOLOGIE_PAR_NATURE_JURIDIQUE: Record<string, Typologie> = {
  '7210': Typologie.MUNI,
  '7343': Typologie.EPCI,
  '7344': Typologie.EPCI,
  '7345': Typologie.EPCI,
  '7346': Typologie.CC,
  '7348': Typologie.EPCI,
  '7353': Typologie.EPCI,
  '7355': Typologie.EPCI,
  '7361': Typologie.CCAS,
  '9220': Typologie.ASSO,
  '9222': Typologie.AI,
  '9230': Typologie.ASSO,
  '9260': Typologie.ASSO
};

export const typologieDeLaNatureJuridique = (natureJuridique?: string): Typologie | undefined =>
  natureJuridique == null ? undefined : TYPOLOGIE_PAR_NATURE_JURIDIQUE[natureJuridique];
