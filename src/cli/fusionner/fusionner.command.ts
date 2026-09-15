import type { Command } from 'commander';
import inquirer, { type Answers } from 'inquirer';
import { type FichiersFusionnes, fusionnerDesFichiers } from '../../features/fusion/index';
import { FUSIONNER_OPTIONS, type FusionnerOptions, fusionnerOptionsQuestions } from './fusionner.options';
import { provideFusionnerImplementations } from './fusionner.providers';

const reportMergedFiles = ({ format, mergedFilePath }: FichiersFusionnes): void => {
  console.log(`Les fichiers ${format === '.csv' ? 'CSV' : 'JSON'} fusionnés ont été sauvegardés dans ${mergedFilePath}`);
};

const promptAndRun = async (fusionnerOptions: FusionnerOptions): Promise<void> =>
  inquirer
    .prompt(fusionnerOptionsQuestions(fusionnerOptions))
    .then((mednumAnswers: Answers): void => {
      provideFusionnerImplementations();
      reportMergedFiles(fusionnerDesFichiers({ ...fusionnerOptions, ...mednumAnswers }));
    })
    .catch((error: Error): void => {
      console.error(error.message);
    });

const configureCommandOptions = (command: Command, option: (_: Command) => Command): Command => option(command);

const configureCommand = (program: Command): Command =>
  program.command('fusionner').alias('f').description('Fusion de plusieurs jeux de données');

const commandAction = async (_: unknown, command: Command): Promise<void> => promptAndRun(command.opts());

export const addFusionnerCommandTo = (program: Command): Command =>
  FUSIONNER_OPTIONS.reduce(configureCommandOptions, configureCommand(program)).action(commandAction);
