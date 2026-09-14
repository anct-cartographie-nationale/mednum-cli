import * as dotenv from 'dotenv';
import { Command } from 'commander';
import { addPublierCommandTo } from './cli/publier';
import { addTransformerCommandTo } from './transformer';
import { addDedupliquerCommandTo } from './cli/dedupliquer';
import { addDataInclusionCommandTo } from './cli/data-inclusion';
import { addFusionnerCommandTo } from './cli/fusionner';

dotenv.config();

const PROGRAM: Command = new Command();

PROGRAM.name('mednum')
  .description('CLI pour la transformation et la publication des données des lieux de médiation numérique')
  .version('0.0.1');

addTransformerCommandTo(PROGRAM);
addPublierCommandTo(PROGRAM);
addDedupliquerCommandTo(PROGRAM);
addDataInclusionCommandTo(PROGRAM);
addFusionnerCommandTo(PROGRAM);

PROGRAM.parse();
