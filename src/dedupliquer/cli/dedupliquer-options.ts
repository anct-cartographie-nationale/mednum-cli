import { Command } from 'commander';
import { Question } from 'inquirer';
import { cutoffOption, outputDirectoryOption, sourceNameOption, sourceOption, territoryOption, apiKeyOption } from './options';
import { outputDirectoryQuestion, sourceNameQuestion, sourceQuestion, territoryQuestion } from './questions';

export type DedupliquerOptions = {
  source: string;
  outputDirectory: string;
  sourceName: string;
  territory: string;
  cartographieNationaleApiUrl: string;
  cartographieNationaleApiKey: string;
};

export const DEDUPLIQUER_OPTIONS: ((program: Command) => Command)[] = [
  cutoffOption,
  outputDirectoryOption,
  sourceOption,
  sourceNameOption,
  territoryOption,
  apiKeyOption
];

export const dedupliquerOptionsQuestions = (dedupliquerOptions: DedupliquerOptions): Question[] => [
  outputDirectoryQuestion(dedupliquerOptions),
  sourceQuestion(dedupliquerOptions),
  sourceNameQuestion(dedupliquerOptions),
  territoryQuestion(dedupliquerOptions)
];

const cartographieNationaleApiUrlIfAny = (cartographieNationaleApiUrl?: string): { cartographieNationaleApiUrl?: string } =>
  cartographieNationaleApiUrl == null ? {} : { cartographieNationaleApiUrl };

const cartographieNationaleApiKeyIfAny = (cartographieNationaleApiKey?: string): { cartographieNationaleApiKey?: string } =>
  cartographieNationaleApiKey == null ? {} : { cartographieNationaleApiKey };

export const toDedupliquerOptions = (environment: Record<string, string | undefined>): Partial<DedupliquerOptions> => ({
  ...cartographieNationaleApiUrlIfAny(environment['CARTOGRAPHIE_NATIONALE_API_URL']),
  ...cartographieNationaleApiKeyIfAny(environment['CARTOGRAPHIE_NATIONALE_API_KEY'])
});
