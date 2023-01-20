# Contribution

## Table des matières

- 📦 [Prérequis](#prérequis)
- 🚀 [Installation](#installation)
- 🛠️ [Utilisation](#utilisation)
- 🤝 [Contribution](#contribution)
- 🏗️ [Construit avec](#construit-avec)

## Prérequis

### Outils

- [Git](https://git-scm.com/) : Système de contrôle de versions distribué d'un ensemble de fichiers
- [Node](https://nodejs.org/) : Environnement d'exécution pour Javascript
- [Yarn](https://yarnpkg.com/) : Gestionnaire de paquets pour les produits développés dans des environnements Node

> Node et Yarn peuvent être installés via [nvm](https://github.com/nvm-sh/nvm) qui permet d'obtenir et d'utiliser rapidement différentes versions de Node via la ligne de commande.

## Installation

### Mise en place des sources et des dépendances

Cloner le dépôt en local

```bash
git clone git@github.com:anct-cartographie-nationale/mednum-cli.git
```

Aller dans le dossier du projet pour installer les dépendances

```bash
cd mednum-cli
yarn
```

### Installer Husky

[Husky](https://typicode.github.io/husky) est un outil de gestion des hooks git pour effectuer des tâches automatiques

```bash
yarn husky install
```

Rendre exécutable les fichiers qui contiennent les hooks :

```bash
chmod a+x .husky/commit-msg
chmod a+x .husky/pre-commit
```

### Configurer l'environnement

Le fichier d'environnement `.env` contient les variables d'environnements nécessaires à l'exécution de la commande `mednum publier`

Pour faciliter la mise en place du fichier d'environnement, vous pouvez copier le fichier [.env.example](.env.example) et le renommer en `.env`.

⚠️ Le fichier `.env` est susceptible de contenir des données sensibles, il ne doit jamais être traqué par un gestionnaire de version.  
⚠️ Le fichier `env.example` est une aide pour la mise en place du fichier `.env`, il est public et ne doit pas contenir de données sensibles.

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
  - Cliquez sur l'organisation dnt vous voulez retrouver l'id.
  - Une fois la page administration de l'organisation, récupérer le dernier paramètre de l'URL de la page : il s'agit de l'id de l'organisation
  - Par exemple pour `.../admin/organization/4a4fc649a5a4982f465cfa24/`, l'id est `4a4fc649a5a4982f465cfa24`

## Utilisation

Ces commandes servent dans un contexte de développement de l'application.

### Test

Tester le projet :

```bash
yarn test
```

### Global lint

Analyse statique de tous les fichiers `.ts` du projet :

```bash
yarn lint.all
```

### Staged lint

Analyse statique des fichiers `.ts` qui ont été ajoutés avec la commande `git add` :

```bash
yarn lint.staged
```

### Commit lint

Valider la syntaxe de l'ensemble des commits réalisés depuis la dernière version commune avec la branche `main` :

```bash
yarn lint.commit
```

### Prettier check

Vérifier la syntaxe de l'ensemble des fichiers du projet :

```bash
yarn prettier.check
```

### Prettier

Corriger la syntaxe de l'ensemble des fichiers du projet :

```bash
yarn prettier
```

### Build

Générer une version prête à être publiée :

```bash
yarn build
```

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

- [Jest](https://jestjs.io/) est une boîte à outils pour écrire des tests automatisés en JavaScript
- [Eslint](https://eslint.org/) est un analyseur statique de JavaScript
- [Prettier](https://prettier.io/) est un magnificateur de code source en JavaScript
- [Husky](https://typicode.github.io/husky/#/) est un outil qui permet d'effectuer des vérifications automatiques avant de publier des contributions.
- [Commitlint](https://github.com/conventional-changelog/commitlint) est un outil de vérification des commits suivant le [format des Commits Conventionnels](https://www.conventionalcommits.org/fr/v1.0.0/).
- [Lint-staged](https://github.com/okonet/lint-staged) est un outil qui permet d'effectuer un ensemble de vérifications à l'aide d'autres outils sur un ensemble de fichiers qui viennent d'être modifiés.

#### CI/CD

- [Github Actions](https://docs.github.com/en/actions) est l'outil d'intégration et de déploiement continu intégré à GitHub
  - L'historique des déploiements est disponible [sous l'onglet Actions](https://github.com/anct-cartographie-nationale/mednum-cli/actions/)

[//]: # (Todo: add repository variables and environements)

##### Transformations et publication automatique

Les workflows GitHub [validate.yml](.github%2Fworkflows%2Fvalidate.yml) et [transform-and-publish.yml](.github%2Fworkflows%2Ftransform-and-publish.yml) se chargent de transformer et de publier automatiquement les données :
- `validate.yml` est lancé à chaque push sur une branche en cours de développement. Les données sont publiées dans un [environnement de démo de data.gouv](https://demo.data.gouv.fr/fr/organizations/cartographie-nationale-des-lieux-de-mediation-numerique/).  
  Pour qu'une nouvelle source de données soit prise en compte, il faut bien penser à l'ajouter dans le job `publish-to-data-gouv` : une `strategy` de type `matrix` définie chaque `source` à transformer et publier.
- `release.yml` est lancé à chaque fusion sur `main`. Les données sont publiées dans [l'organisation Cartographie Nationale des lieux de médiation numérique sur data.gouv](https://data.gouv.fr/fr/organizations/cartographie-nationale-des-lieux-de-mediation-numerique/).  
  Pour qu'une nouvelle source de données soit prise en compte, il faut bien penser à l'ajouter dans le job `publish-to-data-gouv` : une `strategy` de type `matrix` définie chaque `source` à transformer et publier.
- `daily` est lancé tous les jours à 04:15 AM. Les données sont publiées dans [l'organisation Cartographie Nationale des lieux de médiation numérique sur data.gouv](https://data.gouv.fr/fr/organizations/cartographie-nationale-des-lieux-de-mediation-numerique/).  
  Pour qu'une nouvelle source de données soit prise en compte, il faut bien penser à l'ajouter dans le job `publish-to-data-gouv` : une `strategy` de type `matrix` définie chaque `source` à transformer et publier.
