import { Command } from 'commander';
import { Question } from 'inquirer';
import { cutoffOption, outputDirectoryOption, sourceNameOption, sourceOption, territoryOption } from './options';
import { outputDirectoryQuestion, sourceNameQuestion, sourceQuestion, territoryQuestion } from './questions';

export type DedupliquerOptions = {
  source: string;
  outputDirectory: string;
  sourceName: string;
  territory: string;
};

export const DEDUPLIQUER_OPTIONS: ((program: Command) => Command)[] = [
  cutoffOption,
  outputDirectoryOption,
  sourceOption,
  sourceNameOption,
  territoryOption
];

export const dedupliquerOptionsQuestions = (dedupliquerOptions: DedupliquerOptions): Question[] => [
  outputDirectoryQuestion(dedupliquerOptions),
  sourceQuestion(dedupliquerOptions),
  sourceNameQuestion(dedupliquerOptions),
  territoryQuestion(dedupliquerOptions)
];
