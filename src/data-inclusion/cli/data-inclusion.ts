import { Command } from 'commander';
import inquirer, { Answers } from 'inquirer';
import {
  toDataInclusionOptions,
  DATA_INCLUSION_OPTIONS,
  DataInclusionOptions,
  dataInclusionOptionsQuestions
} from './data-inclusion-options';
import { dataInclusionAction } from './action';

const promptAndRun = async (dataInclusionOptions: DataInclusionOptions): Promise<void> =>
  inquirer
    .prompt(dataInclusionOptionsQuestions(dataInclusionOptions))
    .then(
      async (dataInclusionAnswers: Answers): Promise<void> =>
        dataInclusionAction({ ...dataInclusionOptions, ...dataInclusionAnswers })
    )
    .catch((error: Error): void => {
      /* eslint-disable-next-line no-console */
      console.error(error.message);
    });

const configureCommandOptions = (command: Command, option: (_: Command) => Command): Command => option(command);

const configureCommand = (program: Command): Command =>
  program
    .command('data-inclusion')
    .alias('di')
    .description('Préparation des données issues de data-inclusion préalable à une transformation');

const commandAction = async (_: unknown, command: Command): Promise<void> =>
  promptAndRun({
    ...toDataInclusionOptions(process.env),
    ...command.opts()
  });

export const addDataInclusionCommandTo = (program: Command): Command =>
  DATA_INCLUSION_OPTIONS.reduce(configureCommandOptions, configureCommand(program)).action(commandAction);
