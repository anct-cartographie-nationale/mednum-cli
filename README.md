# Import

## À propos

Import permet la transformation de données lieux de médiation numériques collectées dans un format non standard vers le [Schéma de données des lieux de médiation numérique](https://lamednum.coop/schema-de-donnees-des-lieux-de-mediation-numerique-2/).

Les sources de données prises en comptes pour le moment sont celles collectées par
- Le Hub [Les Assembleurs](https://assembleurs.co/)
- Le Hub [Hinaura](https://www.hinaura.fr/)

## Table des matières

- 🪧 [À propos](#à-propos)
- 📦 [Prérequis](#prérequis)
- 🚀 [Installation](#installation)
- 🛠️ [Utilisation](#utilisation)
- 🤝 [Contribution](#contribution)
- 📝 [Licence](#licence)

## Prérequis

- [Git](https://git-scm.com/) : Système de contrôle de versions distribué d'un ensemble de fichiers
- [Node](https://nodejs.org/) : Environnement d'exécution pour Javascript
- [Yarn](https://yarnpkg.com/) : Gestionnaire de paquets pour les produits développés dans des environnements Node

> Node et Yarn peuvent être installés via [nvm](https://github.com/nvm-sh/nvm) qui permet d'obtenir et d'utiliser rapidement différentes versions de Node via la ligne de commande.

## Installation

Cloner le dépôt en local

```bash
git clone git@github.com:anct-cartographie-nationale/import.git
```

Aller dans le dossier du projet pour installer les dépendances

```bash
cd import
yarn
```

## Utilisation

### Lancement de l'opération de transformation pour les données du hub **Les Assembleurs**

Le fichier d'entrée `les-assembleurs.json` au format de données des assembleurs est à mettre dans le dossier `assets/input`.

Exécuter `yarn start.les-assembleurs`.

Le fichier de sorte `les-assembleurs.json` au format de données du schéma des lieux de médiation numériques est à récupérer dans le dossier `assets/input`.

## Contribution

Voir le [guide de contribution](./CONTRIBUTING.md) du dépôt.

## Licence

Voir le fichier [LICENSE.md](./LICENSE.md) du dépôt.

