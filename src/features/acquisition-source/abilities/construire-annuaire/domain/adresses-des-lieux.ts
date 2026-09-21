import { cleDAdresse, communeNormalisee, numeroDeVoie, voieNormalisee } from '../../../../../libraries/annuaire-entreprises';

export type LieuLocalise = {
  adresse?: string;
  code_postal?: string;
  commune?: string;
};

export const clesDesLieux = (lieux: LieuLocalise[]): Set<string> =>
  lieux.reduce((cles: Set<string>, lieu: LieuLocalise): Set<string> => {
    const codePostal: string = (lieu.code_postal ?? '').trim();

    return codePostal === ''
      ? cles
      : cles.add(
          cleDAdresse({
            codePostal,
            commune: communeNormalisee(lieu.commune ?? ''),
            numero: numeroDeVoie(lieu.adresse ?? ''),
            voie: voieNormalisee(lieu.adresse ?? '')
          })
        );
  }, new Set<string>());
