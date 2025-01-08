import { Command } from 'commander';
import inquirer, { Answers } from 'inquirer';
import { FUSIONNER_OPTIONS, FusionnerOptions, fusionnerOptionsQuestions } from './fusionner-options';
import { fusionnerAction } from './action';

const promptAndRun = async (fusionnerOptions: FusionnerOptions): Promise<void> =>
  inquirer
    .prompt(fusionnerOptionsQuestions(fusionnerOptions))
    .then((mednumAnswers: Answers): void => fusionnerAction({ ...fusionnerOptions, ...mednumAnswers }))
    .catch((error: Error): void => {
      console.error(error.message);
    });

const configureCommandOptions = (command: Command, option: (_: Command) => Command): Command => option(command);

const configureCommand = (program: Command): Command =>
  program.command('fusionner').alias('f').description('Fusion de plusieurs jeux de données');

const commandAction = async (_: unknown, command: Command): Promise<void> => promptAndRun(command.opts());

export const addFusionnerCommandTo = (program: Command): Command =>
  FUSIONNER_OPTIONS.reduce(configureCommandOptions, configureCommand(program)).action(commandAction);
