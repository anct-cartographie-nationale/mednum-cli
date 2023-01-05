import inquirer, { Answers, QuestionCollection } from 'inquirer';
import * as dotenv from 'dotenv';
import { program, Command } from 'commander';
import {
  addApiKeyOption,
  addIdTypeOption,
  addIdValueOption,
  dataGouvApiKeyQuestion,
  dataGouvIdTypeQuestion,
  dataGouvIdValueQuestion,
  IdTypeChoice,
  MednumProperties
} from './cli';
import { publishDataset, Reference } from './mednum';
import { publishDatasetRepository } from './repositories/publish-dataset.repository';
/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;
import { fromMednumEnvironment } from './tranfers/mednum-properties/from-mednum-environement.transfer';
import { addMetadataFileOption, dataGouvMetadataFileQuestion } from './cli/import/metdata-file';
import { Api } from './repositories/data-gouv.api';
import { addApiUrlOption } from './cli/import/api-url';

dotenv.config();

program
  .name('mednum')
  .description('CLI pour les données des lieux de médiation numérique')
  .version('0.0.1')
  .command('import')
  .alias('i')
  .description('Import lieux de médiation numérique data to data.gouv');

const MEDNUM_OPTIONS: MednumProperties = [
  addMetadataFileOption,
  addIdValueOption,
  addIdTypeOption,
  addApiKeyOption,
  addApiUrlOption
]
  .reduce((command: Command, option: (_: Command) => Command): Command => option(command), program)
  .opts();

program.parse();

const MEDNUM_DEFAULTS: MednumProperties = {
  ...{ dataGouvApiUrl: 'https://www.data.gouv.fr/api/1' },
  ...fromMednumEnvironment(process.env),
  ...MEDNUM_OPTIONS
};

export const QUESTIONS: QuestionCollection = [
  dataGouvApiKeyQuestion(MEDNUM_DEFAULTS),
  dataGouvIdTypeQuestion(MEDNUM_DEFAULTS),
  dataGouvIdValueQuestion(MEDNUM_DEFAULTS),
  dataGouvMetadataFileQuestion(MEDNUM_DEFAULTS)
];

const getReference = (mednumProperties: MednumProperties): Reference => ({
  id: mednumProperties.dataGouvIdValue,
  isOwner: mednumProperties.dataGouvIdType === IdTypeChoice.OWNER
});

const getApi = (mednumProperties: MednumProperties): Api => ({
  key: mednumProperties.dataGouvApiKey,
  url: mednumProperties.dataGouvApiUrl
});

inquirer
  .prompt(QUESTIONS)
  .then((mednumAnswers: Answers): void => {
    const mednumProperties: MednumProperties = { ...MEDNUM_DEFAULTS, ...mednumAnswers };

    fs.readFile(
      mednumProperties.dataGouvMetadataFile,
      'utf8',
      async (_: ErrnoException | null, dataString: string): Promise<void> =>
        publishDataset(
          publishDatasetRepository(getApi(mednumProperties)),
          getReference(mednumProperties)
        )(JSON.parse(dataString))
    );
  })
  .catch((error: Error): void => {
    /* eslint-disable-next-line no-console */
    console.error(error.message);
  });
