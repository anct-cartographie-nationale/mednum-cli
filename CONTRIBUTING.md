# Contribution

## Table des matières

- 📦 [Prérequis](#prérequis)
- 🚀 [Installation](#installation)
- 🏛️ [Architecture](#architecture)
- 🛠️ [Utilisation](#utilisation)
- 🤝 [Contribution](#contribution)
- 🏗️ [Construit avec](#construit-avec)

## Prérequis

### Outils

- [Git](https://git-scm.com/) : Système de contrôle de versions distribué d'un ensemble de fichiers
- [Node](https://nodejs.org/) : Environnement d'exécution pour Javascript, en version **22.13 ou supérieure**
- [pnpm](https://pnpm.io/) : Gestionnaire de paquets pour les produits développés dans des environnements Node, en version **12**

> Node peut être installé via [nvm](https://github.com/nvm-sh/nvm) qui permet d'obtenir et d'utiliser rapidement différentes versions de Node via la ligne de commande. pnpm s'installe via [corepack](https://pnpm.io/installation#using-corepack), livré avec Node.

## Installation

### Mise en place des sources et des dépendances

Cloner le dépôt en local

```bash
git clone git@github.com:anct-cartographie-nationale/mednum-cli.git
```

Aller dans le dossier du projet pour installer les dépendances

```bash
cd mednum-cli
pnpm install
```

Les hooks git de [Husky](https://typicode.github.io/husky) sont mis en place automatiquement pendant l'installation, par le script `prepare` : il n'y a rien d'autre à lancer. Le hook `commit-msg` valide le message de commit, le hook `pre-commit` lance l'analyse statique des fichiers indexés puis la vérification de l'architecture.

> `pnpm-workspace.yaml` porte un `minimumReleaseAge` de 14400 minutes, soit **10 jours** : une dépendance publiée plus récemment ne s'installera pas. C'est une protection délibérée contre la compromission de la chaîne d'approvisionnement, elle ne doit pas être contournée.

### Configurer l'environnement

Le fichier d'environnement `.env` contient les variables d'environnements nécessaires à l'exécution de la commande `mednum publier`

Pour faciliter la mise en place du fichier d'environnement, vous pouvez copier le fichier [.env.example](.env.example) et le renommer en `.env`.

⚠️ Le fichier `.env` est susceptible de contenir des données sensibles, il ne doit jamais être traqué par un gestionnaire de version.  
⚠️ Le fichier `.env.example` est une aide pour la mise en place du fichier `.env`, il est public et ne doit pas contenir de données sensibles.

Configurez les variables d'environnements attendus dans le fichier `.env` :

#### `DATA_GOUV_API_URL`

L'URL de l'API data.gouv, il est recommandé d'utiliser l'API de démo pour le développement : https://demo.data.gouv.fr/api/1

#### `DATA_GOUV_API_KEY`

La clé d'API qui permet à la commande d'effectuer des requêtes sur l'API nécessitant une authentification en votre nom.

Pour obtenir une clé d'API, vous devez créer un compte sur [demo.data.gouv.fr](https://demo.data.gouv.fr/fr/).  
Une fois connecté, rendez-vous sur [votre profil dans le menuAdministration](https://demo.data.gouv.fr/fr/admin/me/).  
En bas à gauche de la page, vous trouverez un encart intitulé `Clé d'API`.  
Il vous suffit de copier la clé et de la coller comme valeur dans le fichier `.env`

#### `DATA_GOUV_REFERENCE_TYPE`

Il existe deux moyens de publier des jeux de donnés sur data.gouv ; vous pouvez le faire en votre propre nom ou au nom d'une organisation.

Cette variable permet d'indiquer le type de publication :

- La valeur `owner` signifie que vous publiez en votre propre nom.
- La valeur `organization` signifie que vous publiez au nom d'une organisation.

#### `DATA_GOUV_REFERENCE_ID`

Vous devez indiquer l'identifiant de votre compte si vous avez choisi le type `owner` ou l'id de l'organisation si vous avez choisi le type `organization`.

- Retrouvez l'id de votre compte en vous rendant sur la page d'[Administation](https://demo.data.gouv.fr/fr/admin/) de votre compte.
  - Appuyez sur la touche `F12` pour afficher l'inspecteur de votre navigateur et observez le moniteur de réseau
  - [Optionnel] Effacez les requêtes présentes pour faciliter l'identification des prochaines requêtes
  - Dans la liste à gauche, cliquez sur le menu `Profil`
  - Une requête avec le paramètre `?owner=` devrait apparaitre dans le moniteur de réseau, la valeur à la suite du `=` correspond à l'id de votre compte
  - Par exemple pour `.../api/1/harvest/sources/?owner=6396e6363a1ab130371ff777&deleted=true&lang=fr&_=1674118850001`, l'id est `6396e6363a1ab130371ff777`
- Retrouvez l'id d'une organisation en vous rendant sur la page d'[Administation](https://demo.data.gouv.fr/fr/admin/) de votre compte.
  - Dans la liste à gauche, vos organisations s'affichent en dessous du menu `Profil`.
  - Cliquez sur l'organisation dont vous voulez retrouver l'id.
  - Une fois la page administration de l'organisation, récupérer le dernier paramètre de l'URL de la page : il s'agit de l'id de l'organisation
  - Par exemple pour `.../admin/organization/4a4fc649a5a4982f465cfa24/`, l'id est `4a4fc649a5a4982f465cfa24`

## Architecture

Le code est découpé en trois couches, et ce découpage n'est pas une convention de rangement : il est **vérifié mécaniquement** à chaque commit et en intégration continue.

```
src/cli/<commande>/        points d'entrée — une commande de la CLI par dossier
src/features/<capacité>/   capacités métier, autonomes les unes des autres
src/libraries/<library>/   utilitaires techniques génériques
```

### Les trois règles à connaître

**Une capacité n'en importe jamais une autre.** Quand deux capacités doivent se rencontrer, la rencontre a lieu au point d'entrée de la commande, jamais dans le code métier.

**Une capacité déclare ce dont elle a besoin, elle ne le réalise pas.** Le contrat — le *port* — est déclaré dans `keys/` par celui qui en a besoin, pas par celui qui le réalisera. La déduplication déclare `LOAD_LIEUX` parce qu'elle a besoin de lieux ; elle ignore d'où ils viennent.

**Les implémentations ne se branchent qu'au point d'entrée.** `provide()` n'est appelé que dans `src/cli/<commande>/<commande>.providers.ts`, nulle part ailleurs. Ce fichier est le seul endroit où le concret rencontre l'abstrait, et toute la composition de la commande s'y lit d'un seul tenant.

### Anatomie d'une capacité

```
features/<capacité>/
  domain/                modèle pur : aucune entrée-sortie, aucun réseau, aucun fichier
  keys/                  les contrats dont la capacité a besoin
  implementations/       des réalisations possibles de ces contrats
  abilities/<verbe>/     un cas d'usage, avec au besoin ses propres domain/keys/implementations
```

Une *ability* est le cas d'usage exécutable. Elle ne dépend jamais d'une autre ability de la même capacité : ce qu'elles partagent remonte dans le `domain` de la capacité.

### La référence

`.dependency-cruiser.cjs` décrit, en règles nommées et commentées, ce qui a le droit de dépendre de quoi — dont la table `LIBRARY_DEPENDENCIES`, qu'il faut compléter pour qu'une library puisse en utiliser une autre. `.folderslintrc` liste les dossiers autorisés.

**En cas de doute sur une convention, lire ces deux fichiers plutôt que cette section** : ils ne peuvent pas se périmer, `pnpm lint.architecture` les vérifie.

## Utilisation

Ces commandes servent dans un contexte de développement de l'application.

### Test

Lancer les tests, en mode surveillance :

```bash
pnpm test
```

Pour une passe unique, ou pour cibler un fichier ou un test précis :

```bash
pnpm vitest run
pnpm vitest run src/chemin/vers/fichier.spec.ts
pnpm vitest run -t "nom du test"
```

### Analyse statique

Analyser tous les fichiers du dossier `src` :

```bash
pnpm lint
```

Corriger automatiquement ce qui peut l'être — mise en forme comprise :

```bash
pnpm lint.fix
```

Analyser uniquement les fichiers ajoutés avec `git add`, ce que fait le hook de pre-commit :

```bash
pnpm lint.staged
```

### Vérification de l'architecture

Vérifier que les dépendances entre couches et l'arborescence respectent les règles du projet :

```bash
pnpm lint.architecture
```

Cette commande est lancée par le hook de pre-commit et par l'intégration continue : **une violation d'architecture empêche le commit**. Pour visualiser le graphe des dépendances en SVG — nécessite [Graphviz](https://graphviz.org/) :

```bash
pnpm doc.architecture
```

### Vérification des types

```bash
pnpm ts.check
```

### Commit lint

Valider la syntaxe de l'ensemble des commits réalisés depuis la dernière version commune avec la branche `main` :

```bash
pnpm lint.commit
```

### Exécuter la CLI depuis les sources

Sans compilation préalable, via `tsx` :

```bash
pnpm mednum <commande>
```

Les scripts `transformer.*`, `dedupliquer.*` et `publier.*` du `package.json` — un par source de données — sont les invocations réelles utilisées par les workflows. S'en inspirer plutôt que de reconstruire les arguments à la main.

⚠️ La commande `publier` écrit réellement sur data.gouv. En développement, pointer `DATA_GOUV_API_URL` vers l'API de démonstration.

### Build

Générer une version prête à être publiée :

```bash
pnpm build
```

La construction est assurée par [tsdown](https://tsdown.dev/). C'est elle qui résout les imports relatifs : les sources les écrivent **sans extension**, `dist` reçoit des `.js` que Node sait charger. Ne pas réintroduire d'extension dans les imports.

Les déclarations sont dérivées de chaque fichier isolément (`isolatedDeclarations`) : tout symbole exporté doit porter un type explicite. C'est ce que la convention de style imposait déjà ; le compilateur le vérifie désormais.

## Contribution

### Nommage des branches

- Avant de créer une nouvelle branche de travail, récupérer les dernières modifications disponibles sur la branche `main`
- La nouvelle branche de travail doit ête préfixée par `build/`, `chore/`, `ci/`, `docs/`, `feat/`, `fix/`, `perf/`, `refactor/`, `revert/`, `style/` ou `test/` en fonction du type de modification prévu, pour plus de détails à ce sujet, consulter [Conventional Commits cheat sheet](https://kapeli.com/cheat_sheets/Conventional_Commits.docset/Contents/Resources/Documents/index)

### Commits

#### Convention

Les commits de ce repository doivent respecter la syntaxe décrite par la spécification des [Commits Conventionnels](https://www.conventionalcommits.org/fr)

#### Signature

La branche `main`, ainsi que l'ensemble des branches de travail avec un préfixe valide requièrent que les commits soient signés :

- La documentation de GitHub indique comment [configurer la signature des commits](https://docs.github.com/en/enterprise-server@3.5/authentication/managing-commit-signature-verification/about-commit-signature-verification)
- Les utilisateurs de [keybase](https://keybase.io/) peuvent [signer leurs commits avec leur clé GPG sur Keybase](https://stephenreescarter.net/signing-git-commits-with-a-keybase-gpg-key/)

## Construit avec

### langages & Frameworks

- [TypeScript](https://www.typescriptlang.org/) est un langage open source construit à partir de JavaScript

### Outils

#### CLI

- [Vitest](https://vitest.dev/) est une boîte à outils pour écrire des tests automatisés en JavaScript
- [Biome](https://biomejs.dev/) est un analyseur statique et un formateur de code, qui remplace ESLint et Prettier en un seul outil
- [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) vérifie les dépendances entre les couches du projet, décrites dans `.dependency-cruiser.cjs`
- [folderslint](https://github.com/OlegKlimenko/folderslint) vérifie que l'arborescence respecte les dossiers autorisés, décrits dans `.folderslintrc`
- [tsx](https://tsx.is/) exécute le TypeScript directement, sans étape de compilation
- [tsdown](https://tsdown.dev/) construit le paquet publié : il résout les imports relatifs et génère les déclarations
- [Husky](https://typicode.github.io/husky/#/) est un outil qui permet d'effectuer des vérifications automatiques avant de publier des contributions.
- [Commitlint](https://github.com/conventional-changelog/commitlint) est un outil de vérification des commits suivant le [format des Commits Conventionnels](https://www.conventionalcommits.org/fr/v1.0.0/).
- [Lint-staged](https://github.com/okonet/lint-staged) est un outil qui permet d'effectuer un ensemble de vérifications à l'aide d'autres outils sur un ensemble de fichiers qui viennent d'être modifiés.

#### CI/CD

- [Github Actions](https://docs.github.com/en/actions) est l'outil d'intégration et de déploiement continu intégré à GitHub
  - L'historique des déploiements est disponible [sous l'onglet Actions](https://github.com/anct-cartographie-nationale/mednum-cli/actions/)
- Secrets du dépôt :
  - `NODE_AUTH_TOKEN` : Clé d'accès NPM pour publier sur l'organisation [@gouvfr-anct](https://www.npmjs.com/org/gouvfr-anct)
- Secrets de l'environnement `demo` :
  - [DATA_GOUV_API_URL](#DATA_GOUV_API_URL)
  - [DATA_GOUV_API_KEY](#DATA_GOUV_API_KEY)
  - [DATA_GOUV_REFERENCE_ID](#DATA_GOUV_REFERENCE_ID)
  - [DATA_GOUV_REFERENCE_TYPE](#DATA_GOUV_REFERENCE_TYPE)
- Secrets de l'environnement `production` :
  - [DATA_GOUV_API_URL](#DATA_GOUV_API_URL)
  - [DATA_GOUV_API_KEY](#DATA_GOUV_API_KEY)
  - [DATA_GOUV_REFERENCE_ID](#DATA_GOUV_REFERENCE_ID)
  - [DATA_GOUV_REFERENCE_TYPE](#DATA_GOUV_REFERENCE_TYPE)

#### Publication sur le registre npm

À chaque fusion sur la branche `main`, l'outil est publié sur [npm](https://www.npmjs.com/)

- Organisation: [@gouvfr-anct](https://www.npmjs.com/org/gouvfr-anct)
- Package: [@gouvfr-anct/mednum](https://www.npmjs.com/package/@gouvfr-anct/mednum)

##### Transformations et publication automatique

Trois workflows transforment et publient les données. Tous trois délèguent le travail au workflow réutilisable [process-data.reusable.yml](.github/workflows/process-data.reusable.yml), qui enchaîne quatre étapes : `transform`, `publish`, `merge` et `deduplicate`.

- [validate.yml](.github/workflows/validate.yml) est lancé à chaque push sur une branche en cours de développement. Il vérifie d'abord le code — Biome, architecture, commits, tests, build — puis publie les données dans l'[environnement de démonstration de data.gouv](https://demo.data.gouv.fr/fr/organizations/cartographie-nationale-des-lieux-de-mediation-numerique/).
- [release.yml](.github/workflows/release.yml) est lancé à chaque fusion sur `main`. Il publie le paquet sur npm, puis les données dans [l'organisation Cartographie Nationale des lieux de médiation numérique sur data.gouv](https://data.gouv.fr/fr/organizations/cartographie-nationale-des-lieux-de-mediation-numerique/).
- [nightly-publish.yml](.github/workflows/nightly-publish.yml) est lancé chaque nuit à 22h48 UTC vers la même organisation, et peut aussi être déclenché à la main.

⚠️ **Pour qu'une nouvelle source de données soit prise en compte**, il faut l'ajouter à la liste `sources:` de ces **trois** workflows, qui la dupliquent chacun. Cette liste alimente la `matrix` des étapes `transform` et `publish` : une source absente de la liste ne sera ni transformée ni publiée, sans qu'aucune erreur ne le signale.
