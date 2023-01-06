import { Command } from 'commander';
import inquirer, { Answers } from 'inquirer';
import { toPublierOptions, PUBLIER_OPTIONS, PublierOptions, publierOptionsQuestions } from './publier-options';
import { publierAction } from './action';

const promptAndRun = async (publierOptions: PublierOptions): Promise<void> =>
  inquirer
    .prompt(publierOptionsQuestions(publierOptions))
    .then((mednumAnswers: Answers): void => publierAction({ ...publierOptions, ...mednumAnswers }))
    .catch((error: Error): void => {
      /* eslint-disable-next-line no-console */
      console.error(error.message);
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
