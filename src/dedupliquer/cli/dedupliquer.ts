import { Command } from 'commander';
import inquirer, { Answers } from 'inquirer';
import { DEDUPLIQUER_OPTIONS, DedupliquerOptions, dedupliquerOptionsQuestions } from './dedupliquer-options';
import { DedupliquerAction } from './action';

const promptAndRun = async (dedupliquerOptions: DedupliquerOptions): Promise<void> =>
  inquirer
    .prompt(dedupliquerOptionsQuestions(dedupliquerOptions))
    .then(async (mednumAnswers: Answers): Promise<void> => DedupliquerAction({ ...dedupliquerOptions, ...mednumAnswers }))
    .catch((error: Error): void => {
      /* eslint-disable-next-line no-console */
      console.error(error.message);
    });

const configureCommandOptions = (command: Command, option: (_: Command) => Command): Command => option(command);

const configureCommand = (program: Command): Command =>
  program.command('dedupliquer').alias('d').description("Déduplication des lieux de médiation numérique d'une source");

const commandAction = async (_: unknown, command: Command): Promise<void> => promptAndRun(command.opts());

export const addDedupliquerCommandTo = (program: Command): Command =>
  DEDUPLIQUER_OPTIONS.reduce(configureCommandOptions, configureCommand(program)).action(commandAction);
