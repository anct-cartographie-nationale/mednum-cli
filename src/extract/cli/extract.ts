import { Command } from 'commander';
import inquirer, { Answers } from 'inquirer';
import { EXTRACT_OPTIONS, ExtractOptions, extractOptionsQuestions } from './extract-options';
import { extractAction } from './action';

const promptAndRun = async (extractOptions: ExtractOptions): Promise<void> =>
  inquirer
    .prompt(extractOptionsQuestions(extractOptions))
    .then((mednumAnswers: Answers): void => extractAction({ ...extractOptions, ...mednumAnswers }))
    .catch((error: Error): void => {
      /* eslint-disable-next-line no-console */
      console.error(error.message);
    });

const configureCommandOptions = (command: Command, option: (_: Command) => Command): Command => option(command);

const configureCommand = (program: Command): Command =>
  program
    .command('extract')
    .alias('e')
    .description('Extraction de données selon une entrée geographique spécifique via data.gouv');

const commandAction = async (_: unknown, command: Command): Promise<void> => promptAndRun(command.opts());

export const addExtractCommandTo = (program: Command): Command =>
  EXTRACT_OPTIONS.reduce(configureCommandOptions, configureCommand(program)).action(commandAction);
