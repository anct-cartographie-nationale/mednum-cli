import { Command } from 'commander';
import { Question } from 'inquirer';
import { departementsOption, outputDirectoryOption, sourceNameOption, territoryOption } from './options';
import { departementsQuestion, outputDirectoryQuestion, sourceNameQuestion, territoryQuestion } from './questions';

export type ExtractOptions = {
  outputDirectory: string;
  sourceName: string;
  departements: string;
  territory: string;
  cartographieNationaleApiUrl: string;
};

export const EXTRACT_OPTIONS: ((program: Command) => Command)[] = [
  outputDirectoryOption,
  sourceNameOption,
  departementsOption,
  territoryOption
];

export const extractOptionsQuestions = (extractOptions: ExtractOptions): Question[] => [
  outputDirectoryQuestion(extractOptions),
  sourceNameQuestion(extractOptions),
  departementsQuestion(extractOptions),
  territoryQuestion(extractOptions)
];
