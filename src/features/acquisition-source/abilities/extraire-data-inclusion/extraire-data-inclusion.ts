import { inject } from '../../../../libraries/injection/index';
import { extractionFor } from './domain/index';
import { FETCH_DATA_INCLUSION, WRITE_EXTRACTION } from './keys/index';

export type ExtraireDataInclusion = {
  dataInclusionApiKey: string;
  filter: string;
  outputFile: string;
};

/**
 * Récupère les structures et les services de data.inclusion pour une source donnée, les
 * fusionne, et écrit le résultat dans un fichier prêt à être transformé.
 */
export const extraireDataInclusion = async ({
  dataInclusionApiKey,
  filter,
  outputFile
}: ExtraireDataInclusion): Promise<void> => {
  const extraction = await inject(FETCH_DATA_INCLUSION)(dataInclusionApiKey, filter);

  inject(WRITE_EXTRACTION)(outputFile, extractionFor(filter)(extraction));
};
