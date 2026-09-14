import type { Command } from 'commander';
import inquirer, { type Answers } from 'inquirer';
import { extraireDataInclusion } from '../../features/acquisition-source/index.js';
import {
  DATA_INCLUSION_OPTIONS,
  type DataInclusionOptions,
  dataInclusionOptionsQuestions,
  toDataInclusionOptions
} from './data-inclusion.options.js';
import { provideDataInclusionImplementations } from './data-inclusion.providers.js';

const promptAndRun = async (dataInclusionOptions: DataInclusionOptions): Promise<void> =>
  inquirer
    .prompt(dataInclusionOptionsQuestions(dataInclusionOptions))
    .then(async (dataInclusionAnswers: Answers): Promise<void> => {
      provideDataInclusionImplementations();
      return extraireDataInclusion({ ...dataInclusionOptions, ...dataInclusionAnswers });
    })
    .catch((error: Error): void => {
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
