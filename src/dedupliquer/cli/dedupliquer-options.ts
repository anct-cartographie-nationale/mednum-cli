import { Command } from 'commander';
import { Question } from 'inquirer';
import { sourceOption } from './options';
import { sourceQuestion } from './questions';

export type DedupliquerOptions = {
  source: string;
};

export const DEDUPLIQUER_OPTIONS: ((program: Command) => Command)[] = [sourceOption];

export const dedupliquerOptionsQuestions = (dedupliquerOptions: DedupliquerOptions): Question[] => [
  sourceQuestion(dedupliquerOptions)
];
