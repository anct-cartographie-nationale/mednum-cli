import type { Command } from 'commander';
import inquirer, { type Answers } from 'inquirer';
import { construireAnnuaire } from '../../features/acquisition-source';
import { ANNUAIRE_OPTIONS, type AnnuaireOptions, annuaireOptionsQuestions, toAnnuaireOptions } from './annuaire.options';
import { provideAnnuaireImplementations } from './annuaire.providers';

const promptAndRun = async (annuaireOptions: AnnuaireOptions): Promise<void> =>
  inquirer
    .prompt(annuaireOptionsQuestions(annuaireOptions))
    .then(async (answers: Answers): Promise<void> => {
      provideAnnuaireImplementations();
      return construireAnnuaire({ ...annuaireOptions, ...answers });
    })
    .catch((error: Error): void => {
      console.error(error.message);
    });

const configureCommandOptions = (command: Command, option: (_: Command) => Command): Command => option(command);

const configureCommand = (program: Command): Command =>
  program
    .command('annuaire')
    .description("Construction de l'index des établissements situés aux adresses des lieux déjà transformés");

const commandAction = async (_: unknown, command: Command): Promise<void> =>
  promptAndRun({ ...toAnnuaireOptions(process.env), ...command.opts() } as AnnuaireOptions);

export const addAnnuaireCommandTo = (program: Command): Command =>
  ANNUAIRE_OPTIONS.reduce(configureCommandOptions, configureCommand(program)).action(commandAction);
