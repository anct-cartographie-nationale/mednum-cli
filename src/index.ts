import * as dotenv from 'dotenv';
import { Command } from 'commander';
import { addPublierCommandTo } from './publier';
import { addTransformerCommandTo } from './transformer';

dotenv.config();

const PROGRAM: Command = new Command();

PROGRAM.name('mednum')
  .description('CLI pour la transformation et la publication des données des lieux de médiation numérique')
  .version('0.0.1');

addTransformerCommandTo(PROGRAM);
addPublierCommandTo(PROGRAM);

PROGRAM.parse();
