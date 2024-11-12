import { Command } from 'commander';
import { Question } from 'inquirer';
import { inputFilesPatternOption, outputDirectoryOption } from './options';
import { outputDirectoryQuestion } from './questions';
import { inputFilesPatternDirectoryQuestion } from './questions/input-files-pattern.question';

export type FusionnerOptions = {
  outputDirectory: string;
  inputFilesPattern: string;
};

export const FUSIONNER_OPTIONS: ((program: Command) => Command)[] = [inputFilesPatternOption, outputDirectoryOption];

export const fusionnerOptionsQuestions = (fusionnerOptions: FusionnerOptions): Question[] => [
  inputFilesPatternDirectoryQuestion(fusionnerOptions),
  outputDirectoryQuestion(fusionnerOptions)
];
