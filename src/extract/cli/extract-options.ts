import { Command } from 'commander';
import { Question } from 'inquirer';
import { departementsOption, duplicatesOption, outputDirectoryOption, sourceNameOption, territoryOption } from './options';
import { outputDirectoryQuestion, sourceNameQuestion, territoryQuestion } from './questions';

export type ExtractOptions = {
  outputDirectory: string;
  sourceName: string;
  departements?: string;
  territory: string;
  cartographieNationaleApiUrl: string;
  duplicates: boolean;
};

export const EXTRACT_OPTIONS: ((program: Command) => Command)[] = [
  outputDirectoryOption,
  sourceNameOption,
  departementsOption,
  territoryOption,
  duplicatesOption
];

export const extractOptionsQuestions = (extractOptions: ExtractOptions): Question[] => [
  outputDirectoryQuestion(extractOptions),
  sourceNameQuestion(extractOptions),
  territoryQuestion(extractOptions)
];
