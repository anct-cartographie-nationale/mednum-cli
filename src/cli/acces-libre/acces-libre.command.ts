import type { Command } from 'commander';
import inquirer, { type Answers } from 'inquirer';
import { extraireAccesLibre } from '../../features/acquisition-source';
import {
  ACCES_LIBRE_OPTIONS,
  type AccesLibreOptions,
  accesLibreOptionsQuestions,
  toAccesLibreOptions
} from './acces-libre.options';
import { provideAccesLibreImplementations } from './acces-libre.providers';

const promptAndRun = async (accesLibreOptions: AccesLibreOptions): Promise<void> =>
  inquirer
    .prompt(accesLibreOptionsQuestions(accesLibreOptions))
    .then(async (accesLibreAnswers: Answers): Promise<void> => {
      provideAccesLibreImplementations();
      return extraireAccesLibre({ ...accesLibreOptions, ...accesLibreAnswers });
    })
    .catch((error: Error): void => {
      console.error(error.message);
    });

const configureCommandOptions = (command: Command, option: (_: Command) => Command): Command => option(command);

const configureCommand = (program: Command): Command =>
  program
    .command('acces-libre')
    .alias('al')
    .description("Récupération des fiches d'accessibilité Accès Libre préalable à une transformation");

const commandAction = async (_: unknown, command: Command): Promise<void> =>
  promptAndRun({
    ...toAccesLibreOptions(process.env),
    ...command.opts()
  });

export const addAccesLibreCommandTo = (program: Command): Command =>
  ACCES_LIBRE_OPTIONS.reduce(configureCommandOptions, configureCommand(program)).action(commandAction);
