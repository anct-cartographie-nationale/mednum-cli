import 'dotenv/config';
import * as fs from 'node:fs';
import { flatten } from 'flat';
import { geocodeCsv, type BanResultRow } from './src/libraries/ban';
import { provide, inject } from './src/libraries/injection';
import {
  chargerUneSource,
  FETCH_REMOTE_SOURCE,
  fetchRemoteSourceWithAxios,
  READ_LOCAL_SOURCE,
  readLocalSourceFromFile
} from './src/features/acquisition-source';
import { communesFromGeoApi, LOAD_COMMUNES, resoudreCommune } from './src/features/enrichissement-territorial';
import {
  addressLabel,
  banRowFor,
  isFlatten,
  isMissingFields,
  LOAD_SOURCE,
  normalizedAddress
} from './src/features/transformation';
import type { DataSource, LieuxMediationNumeriqueMatching } from './src/features/transformation';
import type { FindCommune } from './src/libraries/collectivites';

const SEUIL = 0.9;

type Invocation = { nom: string; source: string; config: string; delimiter?: string; encoding?: string; apiEnvKey?: string };

const flagOf = (cmd: string, flag: string): string | undefined =>
  new RegExp(`${flag}\\s+"([^"]+)"`).exec(cmd)?.[1] ?? new RegExp(`${flag}\\s+([^\\s"]+)`).exec(cmd)?.[1];

const invocations = (): Invocation[] => {
  const scripts = (JSON.parse(fs.readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> }).scripts;
  return Object.entries(scripts)
    .filter(([nom, cmd]) => nom.startsWith('transformer.') && nom !== 'transformer.all' && cmd.includes('index.ts transformer'))
    .map(([nom, cmd]) => {
      const t = cmd.slice(cmd.indexOf('index.ts transformer'));
      return {
        nom: nom.replace('transformer.', ''),
        source: flagOf(t, '-s') ?? '',
        config: flagOf(t, '-c') ?? '',
        ...(flagOf(t, '-d') == null ? {} : { delimiter: flagOf(t, '-d') }),
        ...(flagOf(t, '-e') == null ? {} : { encoding: flagOf(t, '-e') }),
        ...(flagOf(t, '-a') == null ? {} : { apiEnvKey: flagOf(t, '-a') })
      } as Invocation;
    })
    .filter((i: Invocation) => i.source !== '' && fs.existsSync(i.config));
};

const echappe = (v: string): string => `"${v.replace(/"/g, '""')}"`;

const releverUneSource = async (inv: Invocation, findCommune: FindCommune): Promise<string[]> => {
  const matching = JSON.parse(fs.readFileSync(inv.config, 'utf8')) as LieuxMediationNumeriqueMatching;
  const brut: unknown[] = await inject(LOAD_SOURCE)({
    source: inv.source,
    ...(inv.encoding == null ? {} : { encoding: inv.encoding }),
    ...(inv.delimiter == null ? {} : { delimiter: inv.delimiter }),
    ...(inv.apiEnvKey == null ? {} : { apiEnvKey: inv.apiEnvKey })
  });
  const lieux: DataSource[] = (JSON.parse(JSON.stringify(brut, (_: string, v: unknown) => v ?? '')) as DataSource[]).map(
    (d: DataSource): DataSource => flatten(d, { safe: isFlatten(matching as unknown as Record<string, unknown>) }) as DataSource
  );

  const adresseSource = (l: DataSource): string =>
    ([matching.adresse.colonne, matching.code_postal.colonne, matching.commune.colonne].flat() as string[])
      .map((c: string): string => l[c]?.toString() ?? '')
      .filter((v: string): boolean => v !== '')
      .join(' ');

  const lignes: string[] = [];
  for (let o = 0; o < lieux.length; o += 1000) {
    const lot = lieux.slice(o, o + 1000);
    const adresses = lot.map((l: DataSource) => normalizedAddress(findCommune)(l, matching));
    const interrogeables = adresses.map((a, i) => ({ a, i })).filter(({ a }) => !isMissingFields(a));
    const resultats: BanResultRow[] =
      interrogeables.length === 0 ? [] : await geocodeCsv(interrogeables.map(({ a }) => banRowFor(a)));
    const parIndex = new Map<number, BanResultRow | undefined>(interrogeables.map(({ i }, p) => [i, resultats[p]]));

    adresses.forEach((a, i) => {
      const r = parIndex.get(i);
      const score = r?.result_score == null || r.result_score === '' ? 0 : Number(r.result_score);
      if (score > SEUIL) return;
      lignes.push(
        [
          inv.nom,
          adresseSource(lot[i] as DataSource),
          addressLabel(a),
          r?.result_label ?? '',
          score === 0 ? '' : score.toFixed(3)
        ]
          .map(echappe)
          .join(',')
      );
    });
    await new Promise((r) => setTimeout(r, 800));
  }
  return lignes;
};

const main = async (): Promise<void> => {
  provide(FETCH_REMOTE_SOURCE, fetchRemoteSourceWithAxios);
  provide(READ_LOCAL_SOURCE, readLocalSourceFromFile);
  provide(LOAD_SOURCE, chargerUneSource);
  provide(LOAD_COMMUNES, communesFromGeoApi);
  const findCommune: FindCommune = await resoudreCommune();

  const sortie = process.argv[2] ?? 'lieux-ecartes.csv';
  const filtre = process.argv.slice(3);
  const toutes: string[] = [];
  for (const inv of invocations().filter((i: Invocation): boolean => filtre.length === 0 || filtre.includes(i.nom))) {
    try {
      const l = await releverUneSource(inv, findCommune);
      console.error(`  ${inv.nom.padEnd(20)} ${String(l.length).padStart(5)} écartés`);
      toutes.push(...l);
    } catch (e: unknown) {
      console.error(`  ${inv.nom.padEnd(20)}   ÉCHEC — ${(e as Error).message.slice(0, 70)}`);
    }
  }
  fs.writeFileSync(
    sortie,
    ['source,adresse_source,adresse_normalisee,adresse_ban,score_ban', ...toutes].join('\n') + '\n',
    'utf8'
  );
  console.error(`\n${toutes.length} lignes -> ${sortie}`);
};

void main();
