import { Command } from 'commander';
import { Question } from 'inquirer';
import { configFileOption, outputDirectoryOption, sourceFileOption, sourceNameOption } from './options';
import { configFileQuestion, outputDirectoryQuestion, sourceFileQuestion, sourceNameQuestion } from './questions';
import { territoryOption } from './options/territory.option';
import { territoryQuestion } from './questions/territory.question';

export type TransformerOptions = {
  sourceFile: string;
  configFile: string;
  outputDirectory: string;
  sourceName: string;
  territory: string;
};

export const TRANSFORMER_OPTIONS: ((program: Command) => Command)[] = [
  sourceFileOption,
  configFileOption,
  outputDirectoryOption,
  sourceNameOption,
  territoryOption
];

export const transformerOptionsQuestions = (transformerOptions: TransformerOptions): Question[] => [
  sourceFileQuestion(transformerOptions),
  configFileQuestion(transformerOptions),
  outputDirectoryQuestion(transformerOptions),
  sourceNameQuestion(transformerOptions),
  territoryQuestion(transformerOptions)
];
