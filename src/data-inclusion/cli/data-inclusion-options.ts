import { Command } from 'commander';
import { Question } from 'inquirer';
import { filterOption, outputFileOption } from './options';
import { outputFileQuestion } from './questions';

export type DataInclusionOptions = {
  outputFile: string;
  filter: string;
};

export const DATA_INCLUSION_OPTIONS: ((program: Command) => Command)[] = [outputFileOption, filterOption];

export const dataInclusionOptionsQuestions = (dataInclusionOptions: DataInclusionOptions): Question[] => [
  outputFileQuestion(dataInclusionOptions)
];

const outputFileIfAny = (outputFile?: string): { outputFile?: string } => (outputFile == null ? {} : { outputFile });

const filterIfAny = (filter?: string): { filter?: string } => (filter == null ? {} : { filter });

export const toDataInclusionOptions = (environment: Record<string, string | undefined>): Partial<DataInclusionOptions> => ({
  ...outputFileIfAny(environment['DATA_INCLUSION_OUTPUT_FILE']),
  ...filterIfAny(environment['DATA_INCLUSION_FILTER'])
});
