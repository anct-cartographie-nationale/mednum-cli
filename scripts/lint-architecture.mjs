import { spawnSync } from 'node:child_process';
import process from 'node:process';

const MODULES_ATTENDUS_AU_MINIMUM = 300;

const analyse = spawnSync('depcruise', ['src', '--output-type', 'json'], { encoding: 'utf8', shell: false });

if (analyse.error != null) {
  console.error(`depcruise n'a pas pu être exécuté : ${analyse.error.message}`);
  process.exit(1);
}

const { summary } = JSON.parse(analyse.stdout);

if (summary.totalCruised < MODULES_ATTENDUS_AU_MINIMUM) {
  console.error(
    `depcruise n'a analysé que ${summary.totalCruised} modules, là où le dépôt en compte plus de ` +
      `${MODULES_ATTENDUS_AU_MINIMUM}. L'analyseur ne lit pas les sources — vérifier que @swc/core est ` +
      `installé et que « parser: 'swc' » figure dans .dependency-cruiser.cjs.`
  );
  process.exit(1);
}

const rapport = spawnSync('depcruise', ['src'], { encoding: 'utf8', shell: false, stdio: 'inherit' });

process.exit(rapport.status ?? 1);
