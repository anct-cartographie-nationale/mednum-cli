/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;
import { Api, publishDatasetRepository } from '../../repositories';
import { Reference } from '../../models';
import { publishDataset } from '../../publish-dataset';
import { IdTypeChoice } from '../questions';
import { PublierOptions } from '../publier-options';

const getReference = (mednumProperties: PublierOptions): Reference => ({
  id: mednumProperties.dataGouvIdValue,
  isOwner: mednumProperties.dataGouvIdType === IdTypeChoice.OWNER
});

const getApi = (mednumProperties: PublierOptions): Api => ({
  key: mednumProperties.dataGouvApiKey,
  url: mednumProperties.dataGouvApiUrl
});

export const publierAction = (publierOptions: PublierOptions): void => {
  fs.readFile(
    publierOptions.dataGouvMetadataFile,
    'utf8',
    async (_: ErrnoException | null, dataString: string): Promise<void> =>
      publishDataset(
        publishDatasetRepository(getApi(publierOptions)),
        getReference(publierOptions)
      )({ ...JSON.parse(dataString), zone: publierOptions.dataGouvZone })
  );
};
