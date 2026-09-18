import { type Adresse, Pivot } from '@gouvfr-anct/lieux-de-mediation-numerique';
import {
  cleDAdresse,
  type EtablissementALAdresse,
  numeroDeVoie,
  voieNormalisee
} from '../../../../../libraries/annuaire-entreprises';
import type { LieuxMediationNumeriqueMatching, DataSource } from '../../matching';
import type { Recorder } from '../../report';
import { type AnnuaireIndex, etablissementDuLieu } from './determination';

export const PIVOT_FIELD = 'pivot';

const PIVOT_REMPLACE = 'Le SIRET déclaré désigne un autre établissement que celui trouvé à cette adresse';

const PIVOT_NON_CONFIRME = "Aucun établissement de ce nom n'est enregistré à cette adresse : le SIRET déclaré est retiré";

const PIVOT_AJOUTE = 'Aucun SIRET déclaré : celui de cet établissement a été déterminé depuis le nom et l’adresse';

const DETERMINE_DEPUIS_L_ADRESSE = 'SIRET déterminé depuis le nom et l’adresse du lieu';

const pivotDeclare = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string | undefined => {
  const colonne: string = matching.pivot?.colonne ?? '';

  return source[colonne]?.toString().replace(/[\s.-]/gu, '');
};

const cleDuLieu = (adresse: Adresse): string =>
  cleDAdresse({
    codePostal: adresse.code_postal,
    numero: numeroDeVoie(adresse.voie),
    voie: voieNormalisee(adresse.voie)
  });

const signaler = (recorder: Recorder, entryName: string, message: string, before: string, after: string): void => {
  recorder.record(PIVOT_FIELD, message, entryName).fix({ before, apply: DETERMINE_DEPUIS_L_ADRESSE, after });
};

export const processPivot = (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching,
  annuaire: AnnuaireIndex,
  adresse: Adresse,
  nom: string,
  recorder: Recorder,
  entryName: string
): Pivot | undefined => {
  const declare: string | undefined = pivotDeclare(source, matching);
  const trouve: EtablissementALAdresse | undefined = etablissementDuLieu(annuaire, cleDuLieu(adresse), nom, adresse.commune);
  const determine: Pivot | undefined = trouve == null ? undefined : (Pivot.safe(trouve.siret) ?? undefined);

  if (determine == null && declare != null && declare !== '') {
    recorder.record(PIVOT_FIELD, PIVOT_NON_CONFIRME, entryName);
    return undefined;
  }

  if (determine == null) return undefined;

  if (declare == null || declare === '') signaler(recorder, entryName, PIVOT_AJOUTE, '', determine);
  else if (declare !== determine) signaler(recorder, entryName, PIVOT_REMPLACE, declare, determine);

  return determine;
};
