import { Command } from 'commander';
import * as dotenv from 'dotenv';
import { addDataInclusionCommandTo } from './data-inclusion/index';
import { addDedupliquerCommandTo } from './dedupliquer/index';
import { addFusionnerCommandTo } from './fusionner/index';
import { addPublierCommandTo } from './publier/index';
import { addTransformerCommandTo } from './transformer/index';

/**
 * Point d'entrée exécutable. Lire ce module lance la commande : c'est ce que `bin/mednum`
 * attend, et c'est pourquoi il est distinct du point d'entrée bibliothèque.
 */
export const runCli = (argv?: string[]): void => {
  dotenv.config();

  const program: Command = new Command();

  program
    .name('mednum')
    .description('CLI pour la transformation et la publication des données des lieux de médiation numérique')
    .version('0.0.1');

  addTransformerCommandTo(program);
  addPublierCommandTo(program);
  addDedupliquerCommandTo(program);
  addDataInclusionCommandTo(program);
  addFusionnerCommandTo(program);

  program.parse(argv);
};

runCli();
