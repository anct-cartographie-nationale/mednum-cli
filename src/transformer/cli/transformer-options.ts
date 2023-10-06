import { Command } from 'commander';
import { Question } from 'inquirer';
import {
  configFileOption,
  outputDirectoryOption,
  sourceOption,
  sourceNameOption,
  encodingOption,
  delimiterOption,
  apiKeyOption
} from './options';
import { configFileQuestion, outputDirectoryQuestion, sourceQuestion, sourceNameQuestion } from './questions';
import { territoryOption } from './options/territory.option';
import { territoryQuestion } from './questions/territory.question';

export type TransformerOptions = {
  source: string;
  configFile: string;
  outputDirectory: string;
  sourceName: string;
  territory: string;
  encoding?: string;
  delimiter?: string;
  cartographieNationaleApiUrl?: string;
  cartographieNationaleApiKey?: string;
};

export const TRANSFORMER_OPTIONS: ((program: Command) => Command)[] = [
  sourceOption,
  configFileOption,
  outputDirectoryOption,
  sourceNameOption,
  territoryOption,
  encodingOption,
  delimiterOption,
  apiKeyOption
];

export const transformerOptionsQuestions = (transformerOptions: TransformerOptions): Question[] => [
  sourceQuestion(transformerOptions),
  configFileQuestion(transformerOptions),
  outputDirectoryQuestion(transformerOptions),
  sourceNameQuestion(transformerOptions),
  territoryQuestion(transformerOptions)
];

const cartographieNationaleApiUrlIfAny = (cartographieNationaleApiUrl?: string): { cartographieNationaleApiUrl?: string } =>
  cartographieNationaleApiUrl == null ? {} : { cartographieNationaleApiUrl };

const cartographieNationaleApiKeyIfAny = (cartographieNationaleApiKey?: string): { cartographieNationaleApiKey?: string } =>
  cartographieNationaleApiKey == null ? {} : { cartographieNationaleApiKey };

export const toTransformerOptions = (environment: Record<string, string | undefined>): Partial<TransformerOptions> => ({
  ...cartographieNationaleApiUrlIfAny(environment['CARTOGRAPHIE_NATIONALE_API_URL']),
  ...cartographieNationaleApiKeyIfAny(environment['CARTOGRAPHIE_NATIONALE_API_KEY'])
});
