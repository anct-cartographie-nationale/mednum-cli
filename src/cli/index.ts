import { Command } from 'commander';
import * as dotenv from 'dotenv';
import { addAnnuaireCommandTo } from './annuaire';
import { addDataInclusionCommandTo } from './data-inclusion';
import { addDedupliquerCommandTo } from './dedupliquer';
import { addFusionnerCommandTo } from './fusionner';
import { addPublierCommandTo } from './publier';
import { addTransformerCommandTo } from './transformer';

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
  addAnnuaireCommandTo(program);
  addFusionnerCommandTo(program);

  program.parse(argv);
};

runCli();
