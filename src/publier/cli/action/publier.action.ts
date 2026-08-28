import * as fs from 'node:fs';
import type { Api } from '../../../common';
import ErrnoException = NodeJS.ErrnoException;
import { publishDatasetRepository } from '../../repositories';
import type { Reference } from '../../models';
import { publishDataset } from '../../publish-dataset';
import { IdTypeChoice } from '../questions';
import type { PublierOptions } from '../publier-options';

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
    async (_: ErrnoException | null, dataString?: string): Promise<void> => {
      if (dataString == null) return console.log('Nothing to publish because data is null');

      const json = JSON.parse(dataString);
      const data = fs.readFileSync(json?.ressources[1]?.source, 'utf8');
      if (JSON.parse(data).length === 0) return console.log('Nothing to publish because the ressource is at 0 lieux');

      await publishDataset(
        publishDatasetRepository(getApi(publierOptions)),
        getReference(publierOptions)
      )({ ...JSON.parse(dataString), zone: publierOptions.dataGouvZone });
    }
  );
};
