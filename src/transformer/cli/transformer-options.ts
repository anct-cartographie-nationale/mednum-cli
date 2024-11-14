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
  forceOption
} from './options';
import { configFileQuestion, outputDirectoryQuestion, sourceQuestion, sourceNameQuestion } from './questions';
import { territoryOption } from './options/territory.option';
import { territoryQuestion } from './questions/territory.question';

export type TransformerOptions = SourceSettings & {
  configFile: string;
  outputDirectory: string;
  sourceName: string;
  territory: string;
  cartographieNationaleApiUrl?: string;
  cartographieNationaleApiKey?: string;
  force: boolean;
};

export const TRANSFORMER_OPTIONS: ((program: Command) => Command)[] = [
  sourceOption,
  configFileOption,
  forceOption,
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
