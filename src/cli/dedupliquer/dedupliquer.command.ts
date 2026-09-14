import type { Command } from 'commander';
import inquirer, { type Answers } from 'inquirer';
import { dedupliquerDesLieux } from '../../features/deduplication';
import {
  DEDUPLIQUER_OPTIONS,
  type DedupliquerOptions,
  dedupliquerOptionsQuestions,
  toDedupliquerOptions
} from './dedupliquer.options';
import { provideDedupliquerImplementations } from './dedupliquer.providers';

const dedupliquer = async (dedupliquerOptions: DedupliquerOptions): Promise<void> => {
  try {
    provideDedupliquerImplementations(dedupliquerOptions);

    await dedupliquerDesLieux({
      source: dedupliquerOptions.source,
      baseSource: dedupliquerOptions.baseSource,
      allowInternal: dedupliquerOptions.allowInternal
    });
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
    throw error;
  }
};

const promptAndRun = async (dedupliquerOptions: DedupliquerOptions): Promise<void> =>
  inquirer
    .prompt(dedupliquerOptionsQuestions(dedupliquerOptions))
    .then(async (mednumAnswers: Answers): Promise<void> => dedupliquer({ ...dedupliquerOptions, ...mednumAnswers }))
    .catch((error: Error): void => {
      console.error(error.message);
    });

const configureCommandOptions = (command: Command, option: (_: Command) => Command): Command => option(command);

const configureCommand = (program: Command): Command =>
  program.command('dedupliquer').alias('d').description("Déduplication des lieux de médiation numérique d'une source");

const commandAction = async (_: unknown, command: Command): Promise<void> =>
  promptAndRun({
    ...{
      cartographieNationaleApiUrl: 'https://d27gljvji6o5x3.cloudfront.net/api/v0',
      baseSource: command.opts()['source']
    },
    ...toDedupliquerOptions(process.env),
    ...command.opts(),
    allowInternal: command.opts()['allowInternal'] === 'true'
  });

export const addDedupliquerCommandTo = (program: Command): Command =>
  DEDUPLIQUER_OPTIONS.reduce(configureCommandOptions, configureCommand(program)).action(commandAction);
