# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

CLI Node (`@gouvfr-anct/mednum`) qui transforme des sources de données hétérogènes (CSV/JSON, fichiers ou URL) vers le [schéma des lieux de médiation numérique](https://lamednum.coop/schema-de-donnees-des-lieux-de-mediation-numerique-2/), déduplique, fusionne et publie les jeux de données sur data.gouv.fr.

Le code, les noms de domaine et les commentaires sont en **français** ; les libraries techniques (`src/libraries`) utilisent des noms anglais. Respecter cette séparation.

## Commandes

Gestionnaire de paquets : **pnpm**. Node >= 22.13. `pnpm-workspace.yaml` porte un `minimumReleaseAge` de 14400 — l'unité est la **minute**, soit **10 jours** : une version publiée récemment ne s'installe pas. C'est un garde-fou de chaîne d'approvisionnement délibéré, à ne pas contourner.

```bash
pnpm test                          # vitest (mode watch en local, run unique en CI)
pnpm vitest run src/chemin/x.spec.ts   # un seul fichier de test
pnpm vitest run -t "nom du test"       # un seul test par son nom
pnpm lint                          # biome check ./src
pnpm lint.fix                      # biome check --write ./src
pnpm lint.architecture             # depcruise src && folderslint  (règles d'architecture)
pnpm ts.check                      # tsc --noEmit
pnpm build                         # tsdown -> dist/ (résout les imports, émet les .d.ts)
pnpm doc.architecture              # régénère docs/architecture.svg (nécessite graphviz `dot`)
pnpm mednum <commande>             # exécute la CLI en TS via tsx (sans build)
```

La CI (`.github/workflows/validate.yml`) lance `lint`, `lint.architecture`, `lint.commit`, `test` et `build`. Le hook pre-commit lance `lint-staged` **et** `lint.architecture` : une violation d'architecture bloque le commit.

Les scripts `transformer.*`, `dedupliquer.*` et `publier.*` du `package.json` (un par source de données, ~24 sources) sont les invocations réelles utilisées par les workflows et en local ; s'en inspirer plutôt que de reconstruire les arguments à la main.

`CONTRIBUTING.md` porte les mêmes conventions à destination des contributeurs humains — installation, architecture, branches, commits signés, variables d'environnement data.gouv. Le modifier ici sans l'y répercuter laisserait les deux diverger.

## Architecture

Trois couches, strictement cloisonnées et **vérifiées mécaniquement** par `.dependency-cruiser.cjs` (dépendances) et `.folderslintrc` (arborescence autorisée) :

```
src/cli/<commande>/        points d'entrée — une commande commander par dossier
src/features/<capacité>/   capacités métier autonomes
src/libraries/<library>/   utilitaires techniques génériques
```

- `src/cli` peut dépendre de `features` et `libraries`, jamais d'une autre commande.
- `src/features` ne dépend jamais de `cli` **ni d'une autre feature**. Quand une feature a besoin d'une capacité d'une autre, elle déclare un port dans ses `keys` et c'est la commande qui câble l'implémentation.
- `src/libraries` ne dépend ni de `cli` ni de `features`, et ne peut dépendre d'une autre library que si le couple figure dans la table `LIBRARY_DEPENDENCIES` de `.dependency-cruiser.cjs`. **Ajouter une dépendance entre libraries impose d'ajouter l'entrée correspondante dans cette table.**

### Anatomie d'une feature

```
features/<capacité>/
  domain/            modèle pur : aucune I/O, aucun HTTP, aucun système de fichiers
  keys/              ports (contrats) — le pivot d'inversion de dépendance
  implementations/   réalisations concrètes des ports
  abilities/<ability>/   comportement métier autonome, avec ses propres domain/keys/implementations
```

Une `ability` est le cas d'usage exécutable ; elle ne dépend jamais d'une autre ability de la même feature (ce qu'elles partagent remonte dans le `domain` de la feature). `domain` et `keys` ne peuvent dépendre que d'eux-mêmes, du domaine de leur feature parente et des libraries.

### Injection de dépendances

`src/libraries/injection` enveloppe `piqure` et expose `keyFor`, `provide`, `provideLazy`, `inject`, `injectOr`.

- Les features déclarent leurs contrats : `export const LOAD_SOURCE: InjectionKey<LoadSource> = keyFor<LoadSource>('transformation.load-source')` — la clé est préfixée par le nom de la feature.
- **Le `provide` n'a lieu que dans `src/cli/<commande>/<commande>.providers.ts`**, nulle part ailleurs. Ce fichier est le seul endroit où le concret rencontre l'abstrait ; ajouter un format ou une source s'y traduit par une entrée de plus.
- `injectOr` est réservé aux contrats réellement optionnels (ex. le journal).

### Points d'entrée

- `src/index.ts` : point d'entrée **bibliothèque**, sans effet de bord, qui réexporte chaque capacité sous son propre espace de noms (`export * as transformation from ...`). Le namespace n'est pas cosmétique : plusieurs features déclarent des contrats homonymes.
- `src/cli/index.ts` : exécutable — le simple fait de l'importer lance `runCli()`, c'est ce qu'attend `bin/mednum.js` (qui charge `dist/cli/index.js`).

## Conventions de code

- **Imports relatifs sans extension.** `tsdown` les résout à la construction et écrit les `.js` dans `dist` ; les sources n'ont pas à mentir sur le nom du fichier voisin. Ne pas réintroduire d'extension.
- **`isolatedDeclarations`** : tout symbole exporté porte un type explicite, pour que les déclarations se dérivent du fichier seul, sans analyse globale. Un tableau exporté s'annote (`const X: T[] = […]`).
- TypeScript en `strict` renforcé (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals`, `noPropertyAccessFromIndexSignature`…). `tsconfig.json` à la racine — la chaîne de construction l'exige — et les réglages partagés dans `.tsconfig/tsconfig.base.json`.
- Style fonctionnel : fonctions fléchées `const`, types de retour explicites partout, pas de classes.
- Biome : guillemets simples, largeur 128, pas de virgule finale, `bracketSameLine: true`. L'organisation automatique des imports est **désactivée**.
- Tests colocalisés en `*.spec.ts` à côté du code, en français (`it('injecte la valeur fournie pour un contrat')`). Le fuseau horaire est forcé à UTC par `vitest.global-setup.ts`.
- Les commentaires expliquent *pourquoi* une contrainte existe, pas ce que fait le code ; les conserver lors des refactorings.
- Un générique n'est légitime que si son paramètre **circule de l'entrée vers la sortie**. S'il n'apparaît que dans le type de retour, c'est une conversion déguisée : préférer `unknown` et rendre l'affirmation visible chez l'appelant. `axios.get<string>(url, { responseType: 'text' })` est vrai, le transport le garantit ; `axios.get<Commune[]>(url)` ne l'est pas.

## Données et exécution

Le pipeline typique est `transformer` → `dedupliquer` → `publier` (et `fusionner` / `data-inclusion` en appoint).

La commande `transformer` est pilotée par un **fichier de configuration de correspondance** JSON (`assets/input/<source>/<source>.config.json`) qui décrit, colonne par colonne, comment projeter la source vers le schéma cible (correspondance simple, adresse éclatée, recherche sur valeurs, horaires…). `README.md` documente chaque forme de règle avec des exemples — s'y référer avant de modifier la logique de matching.

Les options `publier` s'appuient sur `.env` (`DATA_GOUV_API_URL`, `DATA_GOUV_API_KEY`, `DATA_GOUV_REFERENCE_TYPE`, `DATA_GOUV_REFERENCE_ID`) ; utiliser l'API de démo en développement.

Ajouter une source de données implique d'ajouter son nom à la liste `sources:` de **trois** workflows — `validate.yml`, `nightly-publish.yml` et `release.yml`, qui la dupliquent chacun. Cette liste alimente la `matrix` des jobs `transform` et `publish` de `process-data.reusable.yml` ; sans elle, la source ne sera ni transformée ni publiée, sans qu'aucune erreur ne le signale.

## Décisions délibérées, à ne pas défaire

Ces choix ressemblent à des oublis et n'en sont pas. Les changer demande un arbitrage explicite.

- **Deux décodeurs CSV coexistent.** `csvtojson` sur les flux distants (décodage `iconv` avant parsing), `csv-parse` sur le texte déjà en mémoire. Ils ne traitent pas le BOM de la même façon : les consolider demande d'arbitrer guillemets, BOM et délimiteurs.
- **La limite de 2704 octets** sur les identifiants fusionnés (`features/deduplication/domain/filter-oversized-ids/`) vient de la taille maximale d'une clé de partition DynamoDB. La pile AWS est décommissionnée, la limite est conservée.
- **`readJsonFile` lève sur un fichier manquant, `readJsonFileIfExists` rend `undefined`.** Le nom appelé dit la politique ; confondre « absent » et « illisible » a déjà masqué un fichier corrompu. Le contrat `READ_MERGED_RECORDS` existe pour la même raison : un cumul absent est un premier tour, un fichier d'entrée absent reste une erreur.
- **Le cache d'adresses n'est pas versionné.** `assets/input/addresses.json` vit dans le cache GitHub Actions, sous une clé roulante `addresses-<run_id>` relue par préfixe, et le job `cache-addresses` l'alimente à chaque exécution de production. Le dépôt n'en garde aucune copie ; l'artefact `addresses` de chaque nuit en est la trace consultable. Une éviction du cache n'est pas une perte de données — le géocodage se refait — mais une nuit coûteuse.
- **Une panne du géocodeur n'est pas une absence de résultat.** `GEOCODING_UNAVAILABLE` distingue les deux, faute de quoi une coupure de la BAN inscrirait au cache des milliers d'échecs datés du jour, que `RETRY_UNRESOLVED_AFTER_DAYS` figerait ensuite une semaine. Seule une réponse alimente le cache : `isWorthCaching` en tient la liste blanche.

⚠️ La commande `publier` écrit réellement sur data.gouv. Ne jamais l'exécuter pour vérifier quelque chose : exercer les lecteurs séparément.

## Contribution

Commits conventionnels et **signés**, branches préfixées (`feat/`, `fix/`, `refactor/`, `chore/`…). `pnpm lint.commit` valide l'historique depuis `origin/main`.
