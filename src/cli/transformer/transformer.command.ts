import type { Command } from 'commander';
import inquirer, { type Answers } from 'inquirer';
import { transformerUneSource } from '../../features/transformation/index';
import {
  TRANSFORMER_OPTIONS,
  type TransformerOptions,
  transformerOptionsQuestions,
  toTransformerOptions
} from './transformer.options';
import { provideTransformerImplementations } from './transformer.providers';

const maxTransformFrom = (environment: Record<string, string | undefined>): number | undefined =>
  environment['MAX_TRANSFORM'] == null ? undefined : Number(environment['MAX_TRANSFORM']);

const transformer = async (transformerOptions: TransformerOptions): Promise<void> => {
  provideTransformerImplementations(transformerOptions);

  const maxTransform: number | undefined = maxTransformFrom(process.env);

  await transformerUneSource({
    source: transformerOptions.source,
    sourceName: transformerOptions.sourceName,
    ...(transformerOptions.encoding == null ? {} : { encoding: transformerOptions.encoding }),
    ...(transformerOptions.delimiter == null ? {} : { delimiter: transformerOptions.delimiter }),
    ...(transformerOptions.apiEnvKey == null ? {} : { apiEnvKey: transformerOptions.apiEnvKey }),
    force: transformerOptions.force,
    ...(maxTransform == null ? {} : { maxTransform })
  });
};

const promptAndRun = async (transformerOptions: TransformerOptions): Promise<void> =>
  inquirer
    .prompt(transformerOptionsQuestions(transformerOptions))
    .then(async (mednumAnswers: Answers): Promise<void> => transformer({ ...transformerOptions, ...mednumAnswers }))
    .catch((error: Error): void => {
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
    ...{ force: false },
    ...toTransformerOptions(process.env),
    ...command.opts()
  });

export const addTransformerCommandTo = (program: Command): Command =>
  TRANSFORMER_OPTIONS.reduce(configureCommandOptions, configureCommand(program)).action(commandAction);
