import { Command } from 'commander';
import { Question } from 'inquirer';
import { departementsOption, outputDirectoryOption, sourceNameOption } from './options';
import { departementsQuestion, outputDirectoryQuestion, sourceNameQuestion } from './questions';

export type ExtractOptions = {
  outputDirectory: string;
  sourceName: string;
  departements: string;
};

export const EXTRACT_OPTIONS: ((program: Command) => Command)[] = [outputDirectoryOption, sourceNameOption, departementsOption];

export const extractOptionsQuestions = (extractOptions: ExtractOptions): Question[] => [
  outputDirectoryQuestion(extractOptions),
  sourceNameQuestion(extractOptions),
  departementsQuestion(extractOptions)
];
