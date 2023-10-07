import { Command } from 'commander';
import inquirer, { Answers } from 'inquirer';
import {
  toTransformerOptions,
  TRANSFORMER_OPTIONS,
  TransformerOptions,
  transformerOptionsQuestions
} from './transformer-options';
import { transformerAction } from './action';

const promptAndRun = async (transformerOptions: TransformerOptions): Promise<void> =>
  inquirer
    .prompt(transformerOptionsQuestions(transformerOptions))
    .then(async (mednumAnswers: Answers): Promise<void> => transformerAction({ ...transformerOptions, ...mednumAnswers }))
    .catch((error: Error): void => {
      /* eslint-disable-next-line no-console */
      console.error(error.message);
    });

const configureCommandOptions = (command: Command, option: (_: Command) => Command): Command => option(command);

const configureCommand = (program: Command): Command =>
  program
    .command('transformer')
    .alias('t')
    .description(
      'Transformation des données de lieux de médiation numérique selon le standard établit par la mednum (https://lamednum.coop/schema-de-donnees-des-lieux-de-mediation-numerique-2)'
    );

const commandAction = async (_: unknown, command: Command): Promise<void> =>
  promptAndRun({
    ...{ cartographieNationaleApiUrl: 'https://cartographie.societenumerique.gouv.fr/api/v0' },
    ...toTransformerOptions(process.env),
    ...command.opts()
  });

export const addTransformerCommandTo = (program: Command): Command =>
  TRANSFORMER_OPTIONS.reduce(configureCommandOptions, configureCommand(program)).action(commandAction);
