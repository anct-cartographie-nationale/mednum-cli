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

`transformer` consomme trois données de référence préparées hors d'elle : le cache d'adresses, l'export Accès Libre et l'index des établissements que produit `annuaire`. Les trois sont reconstruits **après** les transformations et servent l'exécution suivante — l'index des établissements ne peut pas l'être avant, puisqu'il se projette sur les adresses qu'elles produisent.

La commande `transformer` est pilotée par un **fichier de configuration de correspondance** JSON (`assets/input/<source>/<source>.config.json`) qui décrit, colonne par colonne, comment projeter la source vers le schéma cible (correspondance simple, adresse éclatée, recherche sur valeurs, horaires…). `README.md` documente chaque forme de règle avec des exemples — s'y référer avant de modifier la logique de matching.

Les options `publier` s'appuient sur `.env` (`DATA_GOUV_API_URL`, `DATA_GOUV_API_KEY`, `DATA_GOUV_REFERENCE_TYPE`, `DATA_GOUV_REFERENCE_ID`) ; utiliser l'API de démo en développement.

Ajouter une source de données implique d'ajouter son nom à la liste `sources:` de **trois** workflows — `validate.yml`, `nightly-publish.yml` et `release.yml`, qui la dupliquent chacun. Cette liste alimente la `matrix` des jobs `transform` et `publish` de `process-data.reusable.yml` ; sans elle, la source ne sera ni transformée ni publiée, sans qu'aucune erreur ne le signale.

## Décisions délibérées, à ne pas défaire

Ces choix ressemblent à des oublis et n'en sont pas. Les changer demande un arbitrage explicite.

- **Deux décodeurs CSV coexistent.** `csvtojson` sur les flux distants (décodage `iconv` avant parsing), `csv-parse` sur le texte déjà en mémoire. Ils ne traitent pas le BOM de la même façon : les consolider demande d'arbitrer guillemets, BOM et délimiteurs.
- **La limite de 2704 octets** sur les identifiants fusionnés (`features/deduplication/domain/filter-oversized-ids/`) vient de la taille maximale d'une clé de partition DynamoDB. La pile AWS est décommissionnée, la limite est conservée.
- **`readJsonFile` lève sur un fichier manquant, `readJsonFileIfExists` rend `undefined`.** Le nom appelé dit la politique ; confondre « absent » et « illisible » a déjà masqué un fichier corrompu. Le contrat `READ_MERGED_RECORDS` existe pour la même raison : un cumul absent est un premier tour, un fichier d'entrée absent reste une erreur.
- **L'index des établissements est hebdomadaire, pas quotidien.** `assets/input/annuaire-entreprises.json` vit dans le cache GitHub Actions sous une clé qui porte la semaine ISO — `annuaire-2026-W38` — et non le numéro d'exécution. Le job `cache-annuaire` ne le reconstruit donc qu'une fois par semaine ; les six autres nuits, la restauration aboutit et le job dure trois secondes. Reconstruire coûte dix-sept minutes, le temps de lire quarante millions d'établissements et autant d'unités légales pour en retenir cent mille. Le prix est qu'une adresse apparue en cours de semaine attend la reconstruction suivante pour recevoir son pivot.
- **Un index absent n'efface pas les pivots.** Quand `annuaire-entreprises.json` manque — première exécution, éviction du cache — la détermination est *indisponible*, pas *négative* : le SIRET déclaré par la source est conservé tel quel, sans signalement. Confondre les deux effacerait plusieurs milliers de pivots en silence au premier incident d'infrastructure. C'est la distinction que `GEOCODING_UNAVAILABLE` fait pour la Base Adresse Nationale.
- **Le `pivot` est dérivé, pas recopié.** La colonne de la source ne sert plus qu'à la comparaison : le SIRET publié est celui de l'établissement enregistré à l'adresse du lieu dont la dénomination concorde avec son nom. Un SIRET que ni l'adresse ni le nom ne confirment est retiré, motif au rapport. La neutralisation du nom de commune avant comparaison n'est pas cosmétique : sans elle, « Bibliothèque de Condé-en-Brie » concorde avec « COMMUNE DE CONDE EN BRIE » sur la seule foi du toponyme.
- **La clé d'adresse de l'annuaire porte la commune, pas seulement le code postal.** Un code postal couvre plusieurs communes, qui ont chacune leur « Place de la Mairie » : sans la commune, `COMMUNE DE SAVIGNARGUES` recevait le SIRET de `COMMUNE DE CARDET`, toutes deux en 30350. Le nom de commune est la seule discriminante disponible — l'export `etablissements.csv.gz` ne porte pas de code INSEE, seulement une adresse en texte libre. Un lieu géocodé dans la mauvaise commune perd donc son pivot : c'est la donnée qui est fausse, pas la correspondance, et le rapport le montre au lieu de le rattraper en silence.
- **Une entité domiciliée chez son hôte n'est pas son hôte.** `ENTITES_HEBERGEES` refuse l'établissement dont la dénomination désigne un satellite — amicale du personnel, comité des fêtes, CSE, caisse des écoles, association sportive, SCI porteuse des murs, office de tourisme — quand le nom du lieu ne porte pas le même motif. Ces entités partagent l'adresse de leur hôte et son nom, donc concordent à 100 % : `AMICALE DU PERSONNEL VILLE DE MULHOUSE` répondait pour `LA VILLE DE MULHOUSE`. Des motifs syntaxiques et non un seuil de fréquence : le motif sait pourquoi il refuse, le seuil ne le savait pas et sacrifiait autant de justes que de faux.
- **La catégorie juridique type en dernier recours, jamais en substitut.** `typologieDeLaNatureJuridique` n'intervient que si ni la source ni le nom n'ont rien donné. Elle dit la nature de l'exploitant, pas celle de l'équipement — `bmi de Golbey` a pour SIRET la CA d'Épinal — donc elle ne doit jamais l'emporter sur une typologie trouvée. Seules treize catégories y figurent ; les sociétés commerciales et les établissements d'enseignement en sont absents faute de valeur correspondante au schéma.
- **Une liste fusionnée se trie, parce qu'elle ne repasse pas par les modèles.** La bibliothèque ordonne toute liste publiée, mais `mergeDuplicates` écrit ses lieux fusionnés directement dans `SAVE_DEDUPLICATION`, sur des chaînes séparées par des barres verticales. Sans le `triee` de `mergeArrayStrings`, l'ordre d'un lieu fusionné dépendrait de quel doublon arrive en premier, donc de l'ordre d'entrée, qui bouge d'une nuit à l'autre. Même raison pour `processAutresFormationsLabels`, qui construit un tableau sans modèle. Le tri vient de la bibliothèque et n'est jamais réécrit ici : une seconde définition de la collation finirait par diverger de la première.
- **Le cache d'adresses n'est pas versionné.** `assets/input/addresses.json` vit dans le cache GitHub Actions, sous une clé roulante `addresses-<run_id>` relue par préfixe, et le job `cache-addresses` l'alimente à chaque exécution de production. Le dépôt n'en garde aucune copie ; l'artefact `addresses` de chaque nuit en est la trace consultable. Une éviction du cache n'est pas une perte de données — le géocodage se refait — mais une nuit coûteuse.
- **Un lot majoritairement muet n'est pas un lot d'adresses introuvables.** La BAN rend HTTP 200 et une ligne par ligne envoyée même quand elle répond mal : des colonnes de résultat vides sont indiscernables d'un « rien trouvé », et chaque ligne muette s'inscrivait au cache pour une semaine. `estDegrade` compare la part de lignes muettes à `LIGNES_MUETTES_TOLEREES` — un quart — au-delà de vingt lignes : au-dessus, les lignes muettes deviennent `GEOCODING_UNAVAILABLE` et rien n'est mis au cache, tandis que celles qui ont abouti sont conservées. Le seuil n'est pas arbitraire : un lot sain rend **1,6 %** de lignes muettes, 2,3 % au pire, mesuré sur cinq tirages de trois cents adresses ; les lots dégradés du 16 septembre en rendaient de 27 % à 100 %. Sans ce garde-fou, une seule passe dégradée a privé **2 364 lieux — un sur huit —** d'adresse vérifiée pendant sept jours.
- **Une panne du géocodeur n'est pas une absence de résultat.** `GEOCODING_UNAVAILABLE` distingue les deux, faute de quoi une coupure de la BAN inscrirait au cache des milliers d'échecs datés du jour, que `RETRY_UNRESOLVED_AFTER_DAYS` figerait ensuite une semaine. Seule une réponse alimente le cache : `isWorthCaching` en tient la liste blanche.

⚠️ La commande `publier` écrit réellement sur data.gouv. Ne jamais l'exécuter pour vérifier quelque chose : exercer les lecteurs séparément.

## Contribution

Commits conventionnels et **signés**, branches préfixées (`feat/`, `fix/`, `refactor/`, `chore/`…). `pnpm lint.commit` valide l'historique depuis `origin/main`.
