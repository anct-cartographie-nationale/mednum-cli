import { Command } from 'commander';
import { Question } from 'inquirer';
import { configFileOption, outputDirectoryOption, sourceOption, sourceNameOption, encodingOption } from './options';
import { configFileQuestion, outputDirectoryQuestion, sourceQuestion, sourceNameQuestion, encodingQuestion } from './questions';
import { territoryOption } from './options/territory.option';
import { territoryQuestion } from './questions/territory.question';

export type TransformerOptions = {
  source: string;
  configFile: string;
  outputDirectory: string;
  sourceName: string;
  territory: string;
  encoding: string;
};

export const TRANSFORMER_OPTIONS: ((program: Command) => Command)[] = [
  sourceOption,
  configFileOption,
  outputDirectoryOption,
  sourceNameOption,
  territoryOption,
  encodingOption
];

export const transformerOptionsQuestions = (transformerOptions: TransformerOptions): Question[] => [
  sourceQuestion(transformerOptions),
  configFileQuestion(transformerOptions),
  outputDirectoryQuestion(transformerOptions),
  sourceNameQuestion(transformerOptions),
  territoryQuestion(transformerOptions),
  encodingQuestion(transformerOptions)
];
