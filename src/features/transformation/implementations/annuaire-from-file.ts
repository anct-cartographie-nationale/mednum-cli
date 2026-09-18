import { readJsonFileIfExists } from '../../../libraries/file-system';
import {
  cleDAdresse,
  type EtablissementALAdresse,
  numeroDeVoie,
  voieNormalisee
} from '../../../libraries/annuaire-entreprises';
import type { AnnuaireIndex } from '../domain';
import type { LoadAnnuaire } from '../keys';

const ADRESSE_AVEC_COMMUNE = /^(.*?)\s+(\d{5})\s+(.+)$/u;

const cleDeLEtablissement = (adresse: string): string | undefined => {
  const decoupee: RegExpExecArray | null = ADRESSE_AVEC_COMMUNE.exec(adresse ?? '');

  if (decoupee?.[1] == null || decoupee[2] == null) return undefined;

  return cleDAdresse({ codePostal: decoupee[2], numero: numeroDeVoie(decoupee[1]), voie: voieNormalisee(decoupee[1]) });
};

export const annuaireIndex = (etablissements: EtablissementALAdresse[]): AnnuaireIndex =>
  etablissements.reduce((index: AnnuaireIndex, etablissement: EtablissementALAdresse): AnnuaireIndex => {
    const cle: string | undefined = cleDeLEtablissement(etablissement.adresse);

    return cle == null ? index : index.set(cle, [...(index.get(cle) ?? []), etablissement]);
  }, new Map<string, EtablissementALAdresse[]>());

export const annuaireFromFile =
  (cheminLocal?: string): LoadAnnuaire =>
  async (): Promise<AnnuaireIndex> =>
    annuaireIndex(cheminLocal == null ? [] : ((readJsonFileIfExists(cheminLocal) ?? []) as EtablissementALAdresse[]));
