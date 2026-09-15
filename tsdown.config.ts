import { defineConfig } from 'tsdown';

/**
 * La construction résout les imports relatifs, ce qui permet de les écrire sans extension dans
 * les sources. `unbundle` conserve un fichier émis par fichier source : le contenu de `dist`
 * garde la forme que le paquet publié attend, au lieu de fondre en un seul module.
 */
export default defineConfig({
  entry: ['src/index.ts', 'src/cli/index.ts'],
  outDir: 'dist',
  format: 'esm',
  platform: 'node',
  target: 'node22',
  unbundle: true,
  dts: true,
  outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
  sourcemap: false,
  clean: true
});
