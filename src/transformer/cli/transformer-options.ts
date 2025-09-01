import { Command } from 'commander';
import { Question } from 'inquirer';
import { SourceSettings } from '../data';
import {
  configFileOption,
  outputDirectoryOption,
  sourceOption,
  sourceNameOption,
  encodingOption,
  delimiterOption,
  apiKeyOption,
  forceOption,
  nestedOption,
  envKeyOption
} from './options';
import { configFileQuestion, outputDirectoryQuestion, sourceQuestion, sourceNameQuestion } from './questions';
import { territoryOption } from './options/territory.option';
import { territoryQuestion } from './questions/territory.question';

export type TransformerOptions = SourceSettings & {
  configFile: string;
  outputDirectory: string;
  sourceName: string;
  territory: string;
  envKey?: string;
  cartographieNationaleApiUrl?: string;
  cartographieNationaleApiKey?: string;
  force: boolean;
  nested: boolean;
};

export const TRANSFORMER_OPTIONS: ((program: Command) => Command)[] = [
  apiKeyOption,
  configFileOption,
  delimiterOption,
  encodingOption,
  envKeyOption,
  forceOption,
  nestedOption,
  outputDirectoryOption,
  sourceOption,
  sourceNameOption,
  territoryOption
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
