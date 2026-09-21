import { type Adresse, Pivot } from '@gouvfr-anct/lieux-de-mediation-numerique';
import {
  cleDAdresse,
  communeNormalisee,
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

const pivotDeclare = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Pivot | undefined => {
  const colonne: string = matching.pivot?.colonne ?? '';
  const valeur: string | undefined = source[colonne]?.toString().replace(/[\s.-]/gu, '');

  return valeur == null ? undefined : (Pivot.safe(valeur) ?? undefined);
};

const cleDuLieu = (adresse: Adresse): string =>
  cleDAdresse({
    codePostal: adresse.code_postal,
    commune: communeNormalisee(adresse.commune),
    numero: numeroDeVoie(adresse.voie),
    voie: voieNormalisee(adresse.voie)
  });

const signaler = (recorder: Recorder, entryName: string, message: string, before: string, after: string): void => {
  recorder.record(PIVOT_FIELD, message, entryName).fix({ before, apply: DETERMINE_DEPUIS_L_ADRESSE, after });
};

export const etablissementRetenu = (
  annuaire: AnnuaireIndex,
  adresse: Adresse,
  nom: string
): EtablissementALAdresse | undefined => etablissementDuLieu(annuaire, cleDuLieu(adresse), nom, adresse.commune);

export const processPivot = (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching,
  annuaire: AnnuaireIndex,
  etablissement: EtablissementALAdresse | undefined,
  recorder: Recorder,
  entryName: string
): Pivot | undefined => {
  const declare: Pivot | undefined = pivotDeclare(source, matching);

  if (annuaire.size === 0) return declare;

  const determine: Pivot | undefined = etablissement == null ? undefined : (Pivot.safe(etablissement.siret) ?? undefined);

  if (determine == null) {
    if (declare != null) recorder.record(PIVOT_FIELD, PIVOT_NON_CONFIRME, entryName);
    return undefined;
  }

  if (declare == null) signaler(recorder, entryName, PIVOT_AJOUTE, '', determine);
  else if (declare !== determine) signaler(recorder, entryName, PIVOT_REMPLACE, declare, determine);

  return determine;
};
