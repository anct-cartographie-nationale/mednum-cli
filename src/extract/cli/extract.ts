import { Command } from 'commander';
import inquirer, { Answers } from 'inquirer';
import { EXTRACT_OPTIONS, ExtractOptions, extractOptionsQuestions } from './extract-options';
import { extractAction } from './action';

const promptAndRun = async (extractOptions: ExtractOptions): Promise<void> =>
  inquirer
    .prompt(extractOptionsQuestions(extractOptions))
    .then(async (mednumAnswers: Answers): Promise<void> => extractAction({ ...extractOptions, ...mednumAnswers }))
    .catch((error: Error): void => {
      console.error(error.message);
    });

const configureCommandOptions = (command: Command, option: (_: Command) => Command): Command => option(command);

const configureCommand = (program: Command): Command =>
  program
    .command('extract')
    .alias('e')
    .description('Extraction de données selon une entrée géographique spécifique via data.gouv');

const commandAction = async (_: unknown, command: Command): Promise<void> =>
  promptAndRun({
    ...{ cartographieNationaleApiUrl: 'https://cartographie.societenumerique.gouv.fr/api/v0' },
    ...command.opts(),
    duplicates: command.opts()['duplicates'] === 'true'
  });

export const addExtractCommandTo = (program: Command): Command =>
  EXTRACT_OPTIONS.reduce(configureCommandOptions, configureCommand(program)).action(commandAction);
