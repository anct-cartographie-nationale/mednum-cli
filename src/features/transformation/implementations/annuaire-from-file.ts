import { readJsonFileIfExists } from '../../../libraries/file-system';
import { cleDeLEtablissement, type EtablissementALAdresse } from '../../../libraries/annuaire-entreprises';
import type { AnnuaireIndex } from '../domain';
import type { LoadAnnuaire } from '../keys';

export const annuaireIndex = (etablissements: EtablissementALAdresse[]): AnnuaireIndex =>
  etablissements.reduce((index: AnnuaireIndex, etablissement: EtablissementALAdresse): AnnuaireIndex => {
    const cle: string | undefined = cleDeLEtablissement(etablissement.adresse);

    return cle == null ? index : index.set(cle, [...(index.get(cle) ?? []), etablissement]);
  }, new Map<string, EtablissementALAdresse[]>());

export const annuaireFromFile =
  (cheminLocal?: string): LoadAnnuaire =>
  async (): Promise<AnnuaireIndex> =>
    annuaireIndex(cheminLocal == null ? [] : ((readJsonFileIfExists(cheminLocal) ?? []) as EtablissementALAdresse[]));
