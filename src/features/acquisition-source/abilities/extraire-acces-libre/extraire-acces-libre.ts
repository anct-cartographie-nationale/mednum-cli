import { inject } from '../../../../libraries/injection';
import { FETCH_ACCES_LIBRE, WRITE_ACCES_LIBRE } from './keys';

export type ExtraireAccesLibre = {
  outputFile: string;
};

export const extraireAccesLibre = async ({ outputFile }: ExtraireAccesLibre): Promise<void> => {
  inject(WRITE_ACCES_LIBRE)(outputFile, await inject(FETCH_ACCES_LIBRE)());
};
