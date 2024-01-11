import { Command } from 'commander';
import { Question } from 'inquirer';
import { apiKeyOption, filterOption, outputFileOption } from './options';
import { apiKeyQuestion, outputFileQuestion } from './questions';

export type DataInclusionOptions = {
  outputFile: string;
  filter: string;
  dataInclusionApiKey: string;
};

export const DATA_INCLUSION_OPTIONS: ((program: Command) => Command)[] = [outputFileOption, filterOption, apiKeyOption];

export const dataInclusionOptionsQuestions = (dataInclusionOptions: DataInclusionOptions): Question[] => [
  outputFileQuestion(dataInclusionOptions),
  apiKeyQuestion(dataInclusionOptions)
];

const outputFileIfAny = (outputFile?: string): { outputFile?: string } => (outputFile == null ? {} : { outputFile });

const dataInclusionApiKeyIfAny = (dataInclusionApiKey?: string): { dataInclusionApiKey?: string } =>
  dataInclusionApiKey == null ? {} : { dataInclusionApiKey };

const filterIfAny = (filter?: string): { filter?: string } => (filter == null ? {} : { filter });

export const toDataInclusionOptions = (environment: Record<string, string | undefined>): Partial<DataInclusionOptions> => ({
  ...outputFileIfAny(environment['DATA_INCLUSION_OUTPUT_FILE']),
  ...dataInclusionApiKeyIfAny(environment['DATA_INCLUSION_API_KEY']),
  ...filterIfAny(environment['DATA_INCLUSION_FILTER'])
});
