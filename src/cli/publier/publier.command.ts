import type { Command } from 'commander';
import inquirer, { type Answers } from 'inquirer';
import { type Publication, publierUnJeuDeDonnees, type Reference } from '../../features/publication';
import type { Api } from '../../libraries/http';
import {
  IdTypeChoice,
  PUBLIER_OPTIONS,
  type PublierOptions,
  publierOptionsQuestions,
  toPublierOptions
} from './publier.options';
import { providePublierImplementations } from './publier.providers';

const SKIPPED_MESSAGES: Record<string, string> = {
  'metadata-introuvable': 'Nothing to publish because data is null',
  'ressource-vide': 'Nothing to publish because the ressource is at 0 lieux'
};

const referenceOf = ({ dataGouvIdValue, dataGouvIdType }: PublierOptions): Reference => ({
  id: dataGouvIdValue,
  isOwner: dataGouvIdType === IdTypeChoice.OWNER
});

const apiOf = ({ dataGouvApiKey, dataGouvApiUrl }: PublierOptions): Api => ({
  key: dataGouvApiKey,
  url: dataGouvApiUrl
});

const reportPublication = (publication: Publication): void => {
  console.log(publication.published ? `Jeu de données publié : ${publication.title}` : SKIPPED_MESSAGES[publication.reason]);
};

const publier = async (publierOptions: PublierOptions): Promise<void> => {
  providePublierImplementations(apiOf(publierOptions));

  reportPublication(
    await publierUnJeuDeDonnees({
      metadataFile: publierOptions.dataGouvMetadataFile,
      zone: publierOptions.dataGouvZone,
      reference: referenceOf(publierOptions)
    })
  );
};

const promptAndRun = async (publierOptions: PublierOptions): Promise<void> =>
  inquirer
    .prompt(publierOptionsQuestions(publierOptions))
    .then(async (mednumAnswers: Answers): Promise<void> => publier({ ...publierOptions, ...mednumAnswers }))
    .catch((error: Error): void => {
      console.error(error.message);
      process.exitCode = 1;
    });

const configureCommandOptions = (command: Command, option: (_: Command) => Command): Command => option(command);

const configureCommand = (program: Command): Command =>
  program.command('publier').alias('p').description('Publication des données des lieux de médiation numérique sur data.gouv');

const commandAction = async (_: unknown, command: Command): Promise<void> =>
  promptAndRun({
    ...{ dataGouvApiUrl: 'https://www.data.gouv.fr/api/1' },
    ...toPublierOptions(process.env),
    ...command.opts()
  });

export const addPublierCommandTo = (program: Command): Command =>
  PUBLIER_OPTIONS.reduce(configureCommandOptions, configureCommand(program)).action(commandAction);
