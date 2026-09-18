import { projeterAnnuaire } from '../../../../libraries/annuaire-entreprises';
import { inject } from '../../../../libraries/injection';
import { clesDesLieux } from './domain';
import { ECRIRE_ANNUAIRE, LIRE_LES_LIEUX } from './keys';

export type ConstruireAnnuaire = {
  inputFilesPattern: string;
  outputFile: string;
};

export const construireAnnuaire = async ({ inputFilesPattern, outputFile }: ConstruireAnnuaire): Promise<void> => {
  const cles: Set<string> = clesDesLieux(inject(LIRE_LES_LIEUX)(inputFilesPattern));

  inject(ECRIRE_ANNUAIRE)(outputFile, await projeterAnnuaire(cles));
};
