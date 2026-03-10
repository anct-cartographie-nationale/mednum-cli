# Mednum CLI

## À propos

L'interface en ligne de commande `mednum` permet

- la transformation de données lieux de médiation numériques collectées dans un format non-standard vers le [schéma de données des lieux de médiation numérique](https://lamednum.coop/schema-de-donnees-des-lieux-de-mediation-numerique-2/).
- la publication des données standardisées sur [data.gouv.fr](https://www.data.gouv.fr/)

Les sources de données prises en comptes pour le moment sont celles collectées par

**Les plateformes nationales** :

- [La Coop de la médiation numérique](https://coop-numerique.anct.gouv.fr/), solution numérique nationale incluant les médiateurs du dispositif [Conseiller Numérique](https://www.conseiller-numerique.gouv.fr/)
- [Dora](https://dora.inclusion.beta.gouv.fr/) via [Data inclusion](https://data.inclusion.gouv.fr/)
- [France Services](https://agence-cohesion-territoires.gouv.fr/france-services-36) via [Data inclusion](https://data.inclusion.gouv.fr/)
- [France Travail](https://www.francetravail.fr/) via [Data inclusion](https://data.inclusion.gouv.fr/)

**Les Hubs** :

- [Fredo](https://fredo.fr/) via [Data inclusion](https://data.inclusion.gouv.fr/)
- [Hinaura](https://hinaura.fr/?cartographie)
- [Mednum BFC](https://github.com/multi-coop/data-bfc-ternum)
- [Numi](https://reseaugrain.fr/)
- [Res-in](https://resin.grandlyon.com/)
- [RhinOcc](https://rhinoccc.gogocarto.fr/)
- [Siilab](https://cdonline.articque.com/share/display/fced105cab1f92aa69c9f80bac70f80a86ba6731)

**Les départements** :

- [Charente-Maritime](https://www.data.gouv.fr/fr/datasets/r/8f732d2a-cb7d-48c0-8c68-a2991692e820)
- [Grand Paris Sud](https://data.grandparissud.fr/)
- [Hérault](https://www.herault-data.fr/)
- [Landes](https://www.pigma.org/)
- [Loire-Atlantique](https://www.data.gouv.fr/fr/datasets/r/95824460-e707-4db1-a67b-46b4e540d8ac)
- [Mulhouse](https://data.mulhouse-alsace.fr/)
- [Paca](https://www.data.gouv.fr/fr/datasets/r/5250e9c9-8abe-4a4e-8ebc-cb4e8fe72b71)
- [Paris](https://opendata.paris.fr/)
- [Vendée](https://www.data.gouv.fr/fr/datasets/r/d2877549-0ac9-4c1d-96bf-ede948e980fb)
- [Vosges](https://www.data.gouv.fr/api/1/datasets/r/6a6e16c5-5a88-424a-a5d9-a5adca6457d2)

Les données sont republiées quotidiennement sur [data.gouv dans l'organisation de la Cartographie Nationale des lieux de médiation numérique](https://www.data.gouv.fr/fr/organizations/cartographie-nationale-des-lieux-de-mediation-numerique/)

## Table des matières

- 🪧 [À propos](#à-propos)
- 📦 [Prérequis](#prérequis)
- 🛠️ [Utilisation](#utilisation)
- 🤝 [Contribution](#contribution)
- 🏷️ [Gestion des versions](#gestion-des-versions)
- 📝 [Licence](#licence)

## Prérequis

L'interface en ligne de commande `mednum` a besoin de l'installation d'un environnement [Node](https://nodejs.org/) pour permettre son exécution.

> Node peut être installés via [nvm](https://github.com/nvm-sh/nvm) qui permet d'obtenir et d'utiliser rapidement différentes versions de Node via la ligne de commande.

## Utilisation

### Transformer

La commande `mednum transformer` permet de générer un ensemble de fichiers standardisés à partir d'une source et d'un fichier de configuration qui fourni des instructions à propos des opérations à effectuer.

```bash
npx @gouvfr-anct/mednum transformer
```

#### Exemple d'utilisation pour la commande transformer

L'interface vous pose un ensemble de questions afin de recevoir les paramètres nécessaires à l'exécution :

```yml
? Source qui contient les données originales à transformer
  ./assets/input/hinaura/hinaura.json
? Chemin du fichier de configuration qui contient les instructions de transformation
  ./assets/input/hinaura/hinaura.config.json
? Chemin du dossier qui va recevoir les fichiers transformés
  ./assets/output/hinaura
? Nom de l'entité source à l'origine de la collecte des données à transformer
  hinaura
? Nom du territoire couvert par les données à transformer
  Auvergne-Rhône-Alpes
```

- La source peut être un fichier ou un URL avec un contenu au format `csv` ou `json`
- Le [fichier de configuration](#fichier-de-configuration) décrit l'ensemble des colonnes et les valeurs à associer
- Le chemin du dossier de sortie contiendra les 5 fichiers générés par l'opération de transformation
- L'entité source sera indiquée comme source à l'origine de la collecte des données pour chacune des données transformées et sert également à générer le nom des fichiers
- Le nom du territoire indique la couverture géographique des données et sert également à générer le nom des fichiers

#### Description des fichiers générés

Une fois l'exécution terminée, le dossier de dossier indiqué comme chemin de sortie contient :

- Un fichier `CSV` avec l'ensemble des données transformées respectant le [schéma de données des lieux de médiation numérique](https://lamednum.coop/schema-de-donnees-des-lieux-de-mediation-numerique-2/)
- Un fichier `JSON` au même nom que le fichier `CSV` avec l'ensemble des données transformées respectant le [schéma de données des lieux de médiation numérique](https://lamednum.coop/schema-de-donnees-des-lieux-de-mediation-numerique-2/)
- Un fichier `JSON` avec le prefix `structures-inclusion` avec les informations des structures transformées respectant le [schéma des structures de l'inclusion](https://www.data.inclusion.beta.gouv.fr/schemas-de-donnees-de-loffre/schema-des-structures-et-services-dinsertion#schema-structure)
- Un fichier `JSON` avec le prefix `services-inclusion` avec les informations des services transformées respectant le [schéma des services de l'inclusion](https://www.data.inclusion.beta.gouv.fr/schemas-de-donnees-de-loffre/schema-des-structures-et-services-dinsertion#schema-service)
- Un fichier `publier.json` qui contient les métadonnées pour la publication d'un jeu de données sur data.gouv avec les références des 4 fichiers décrits précédemment en tant que ressources

#### Options disponibles pour la commande transformer

Plutôt que de laisser le programme poser des questions, il est possible d'utiliser des options pour saisir les informations nécessaires à l'execution :

##### Fichier source `-s, --source <source>`

La source originale qui contient les données à transformer selon le schéma des lieux de médiation numérique. La source peut être un fichier ou une URL, les données doivent être au format CSV ou JSON.

```bash
npx @gouvfr-anct/mednum transformer --source https://api.conseiller-numerique.gouv.fr/permanences
```

ou

```bash
npx @gouvfr-anct/mednum transformer -s https://api.conseiller-numerique.gouv.fr/permanences
```

##### Fichier de configuration `-c, --config-file <config-file>`

Le chemin vers le fichier de configuration contenant les instructions de transformation.

```bash
npx @gouvfr-anct/mednum transformer --config-file ./assets/input/conseiller-numerique/conseiller-numerique.config.json
```

ou

```bash
npx @gouvfr-anct/mednum transformer -c ./assets/input/conseiller-numerique/conseiller-numerique.config.json
```

##### Dossier de sortie `-o, --output-directory <output-directory>`

Le dossier dans lequel écrire les fichiers transformés.

```bash
npx @gouvfr-anct/mednum transformer --output-directory ./assets/output/conseiller-numerique
```

ou

```bash
npx @gouvfr-anct/mednum transformer -o ./assets/output/conseiller-numerique
```

##### Le nom de la source `-n, --source-name <source-name>`

Le nom de l'entité source à l'origine de la collecte des données.

```bash
npx @gouvfr-anct/mednum transformer --source-name conseiller-numerique
```

ou

```bash
npx @gouvfr-anct/mednum transformer -n conseiller-numerique
```

##### Le nom du territoire `t, --territory <territory>`

Le nom du territoire couvert par les données.

```bash
npx @gouvfr-anct/mednum transformer -t National
```

ou

```bash
npx @gouvfr-anct/mednum transformer --territory National
```

##### Utilisation partielle des options

Si certaines options ne sont pas définies, les questions qui correspondent aux paramètres manquants seront affichés par la commande.

##### Exemple complet

```bash
npx @gouvfr-anct/mednum transformer -s https://api.conseiller-numerique.gouv.fr/permanences -c ./assets/input/conseiller-numerique/conseiller-numerique.config.json -o ./assets/output/conseiller-numerique -n conseiller-numerique -t National
```

ou

```bash
npx @gouvfr-anct/mednum transformer --source https://api.conseiller-numerique.gouv.fr/permanences --config-file ./assets/input/conseiller-numerique/conseiller-numerique.config.json --output-directory ./assets/output/conseiller-numerique --source-name conseiller-numerique --territory National
```

#### Fichier de configuration

Le fichier de configuration contient les instructions pour les transformations à effectuer à partir de la source pour la faire correspondre au schéma cible.

Il s'agit d'un fichier JSON dont les clés sont l'ensemble des champs autorisés par le [schéma de données des lieux de médiation numérique](https://lamednum.coop/schema-de-donnees-des-lieux-de-mediation-numerique-2/) :

- `id`
- `nom`
- `pivot`
- `commune`
- `code_postal`
- `code_insee`
- `adresse`
- `complement_adresse`
- `latitude`
- `longitude`
- `telephone`
- `courriel`
- `site_web`
- `date_maj`
- `prise_rdv`
- `labels_nationaux`
- `conditions_acces`
- `modalites_accompagnement`
- `publics_accueillis`
- `services`
- `horaires`

##### Correspondence simple

Les champs `id`, `nom`, `pivot`, `commune`, `code_postal`, `code_insee`, `adresse`, `complement_adresse`, `latitude`, `longitude`, `telephone`, `courriel`, `site_web`, `date_maj`, `prise_rdv` fonctionnent tous selon un système de correspondence simple, c'est-à-dire qu'il suffit de faire correspondre le nom de la colonne attendue dans le schéma cible avec le nom de la colonne dans la source :

```json
{
  ...
  "nom": {
    "colonne": "Nom de la structure"
  }
  ...
}
```

Ici toutes les valeurs de la colonne `Nom de la structure` se retrouverons dans la colonne `nom` à l'issue de la transformation

- Si le champ `id` n'est pas renseigné, le numéro de la ligne sera assigné en tant qu'id
- Si le champ `pivot` n'est pas renseigné, le pivot aura la valeur `00000000000000` par défaut
- Parmi ces champs, seuls les champs `nom`, `commune`, `code_postal`, `adresse` et `date_maj` sont obligatoires

##### Adresse sur deux colonnes

Il est possible de trouver certaines sources avec le numéro de rue dans une colonne et le libellé, dans ce cas il est possible de faire une fusion de colonnes :

```json
...
"adresse": {
  "joindre": {
    "colonnes" : ["Numéro", "Adresse"],
    "séparateur": " "
  }
}
...
```

Ici si on a `4` dans la colonne `Numéro` et `rue de la République` dans la colonne `Adresse`, le résultat sera `4 rue de la République` dans la colonne `adresse` à l'issue de la transformation.

##### Latitude et longitude dans une seule colonne

Il est possible de trouver certaines sources avec la latitude et longitude dans une seule colonne, dans ce cas il est possible de faire une séparation de colonnes :

```json
...
"latitude": {
  "dissocier": {
    "colonne" : ["Geo Point"],
    "séparateur": ",",
    "partie": 0
  }
},
"longitude": {
  "dissocier": {
    "colonne" : ["Geo Point"],
    "séparateur": ",",
    "partie": 1
  }
},
...
```

Ici si on a `4.8375548,45.7665478` dans la colonne `Geo Point`, le résultat sera `4.8375548` dans la colonne `latitude` et `45.7665478` dans la colonne `longitude` à l'issue de la transformation.

##### Correspondance avec recherche sur les valeurs

Les champs `labels_nationaux`, `conditions_acces`, `modalites_accompagnement`, `publics_accueillis` et `services` fonctionnent tous selon un système de correspondance avec recherche sur les valeurs, c'est-à-dire qu'il faut faire correspondre le nom de la colonne attendue dans le schéma cible avec le nom de la colonne ou des colonnes dans la source, et il faut également préciser des termes de recherche à mettre en correspondance avec un terme cible :

```json
...
"publics_accueillis": [
  {
    "colonnes": ["Détail publics"],
    "termes": ["adultes"],
    "cible": "Adultes"
  },
  {
    "colonnes": ["Détail publics"],
    "termes": ["parentalité"],
    "cible": "Familles/enfants"
  },
]
...
```

Il est possible de rechercher dans plusieurs colonnes :

```json
...
"publics_accueillis": [
  {
    "colonnes": ["Détail publics", "Accueil"],
    "termes": ["adultes"],
    "cible": "Adultes"
  },
  {
    "colonnes": ["Détail publics", "Accueil"],
    "termes": ["parentalité"],
    "cible": "Familles/enfants"
  },
]
...
```

Il est possible de rechercher plusieurs termes :

```json
...
"publics_accueillis": [
  {
    "colonnes": ["Détail publics"],
    "termes": ["adultes", "plus de 18 ans"],
    "cible": "Adultes"
  },
  {
    "colonnes": ["Détail publics", "Accueil"],
    "termes": ["parentalité", "enfants"],
    "cible": "Familles/enfants"
  },
]
...
```

Il est possible de combiner plusieurs colonnes et plusieurs termes :

```json
...
"publics_accueillis": [
  {
  "colonnes": ["Détail publics", "Accueil"],
    "termes": ["adultes", "plus de 18 ans"],
    "cible": "Adultes"
  },
  {
    "colonnes": ["Détail publics", "Accueil"],
    "termes": ["parentalité", "enfants"],
    "cible": "Familles/enfants"
  },
]
...
```

##### Correspondance des horaires

Le champ `horaires` doit contenir les [horaires d'ouvertures au format OSM](https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification)

Si dans la source originale les horaires sont définis pour chaque jour, il est possible d'indiquer à quel jour de la semaine correspond chacune des colonnes au format OSM : `Mo` pour lundi, `Tu` pour mardi, `We` pour mercredi, `Th` pour jeudi, `Fr` pour vendredi, `Sa` pour samedi et `Su` pour dimanche.

```json
...
"horaires": {
  "jours": [
    {
      "colonne": "horaires lundi",
      "osm": "Mo"
    },
    {
      "colonne": "horaires mardi",
      "osm": "Tu"
    },
    {
      "colonne": "horaires mercredi",
      "osm": "We"
    },
    {
      "colonne": "horaires jeudi",
      "osm": "Th"
    },
    {
      "colonne": "horaires vendredi",
      "osm": "Fr"
    },
    {
      "colonne": "horaires samedi",
      "osm": "Sa"
    },
    {
      "colonne": "horaires dimanche",
      "osm": "Su"
    }
  ]
}
...
```

Par exemple ici pour les colonnes `horaires lundi` et `horaires mardi`, avec la valeur `de 9h00 à 12h00, puis de 14h00 à 17h00` on obtient l'équivalent au format OSM dans la colonne `horaires` : `Mo-Tu 09:00-12:00,14:00-17:00`.

Si les horaires sont saisis pour toute la semaine dans une même colonne, il est également possible de faire la correspondance en utilisant le champ `semaine` :

```json
...
"horaires": {
  "semaine": "Horaires ouverture"
}
...
```

Par exemple ici pour la colonne `Horaires ouverture`, avec la valeur `lundi et mardi : de 9h00 à 12h00, puis de 14h00 à 17h00` on obtient l'équivalent au format OSM dans la colonne `horaires` : `Mo-Tu 09:00-12:00,14:00-17:00`.

Il est possible d'utiliser les champs `jours` et `semaine` en même temps si des colonnes avec des horaires pour chaque jour et pour toute la semaine coexistent dans la source originale.

Enfin, si les horaires de la source originale sont déjà dans le format OSM, il n'y a pas besoin de les transformer, il suffit de l'indiquer avec le champ `osm` :

```json
...
"horaires": {
  "osm": "Horaires OSM"
}
...
```

## Publier

La commande `mednum publier` permet de publier un jeu de données sur data.gouv.fr et d'y associer des ressources. Un fichier de métadonnées permet de définir les valeurs attendues par data.gouv dans les différentes étapes du processus de publication.

```bash
npx @gouvfr-anct/mednum publier
```

#### Exemple d'utilisation pour la commande publier

L'interface vous pose un ensemble de questions afin de recevoir les paramètres nécessaires à l'exécution :

```yml
? Clé d'API Data.gouv
  eyJhbGciOiJIUzUxMiJ9.eyJ1...A0fQ.-mCovxzx9-MjO-T_ynjky-Frl03fjjAL_AQlzQOPWpg8w_wvbzpz5KciStA
? Sélectionner le type d'id auquel rattacher la ressource sur Data.gouv
  id d'utilisateur
? Valeur de l'id d'utilisateur auquel rattacher la ressource sur Data.gouv
  6396e6363a1ab130371ff777
? Chemin du fichier qui contient les métadonnées du jeu de données à publier
  ./assets/output/hinaura/publier.json
? La zone couverte par le jeu de données, exemple pour Maine-et-Loire : fr:departement:49
  fr:region:84
```

- La clé d'API qui permet à la commande d'effectuer des requêtes sur l'API nécessitant une authentification en votre nom
- Le type d'id qui permet de publier un jeu de données soit en votre nom, soit au nom d'une organisation
- La valeur de l'id qui correspond au type choisi
- Le fichier de métadonnées est généré par la commande `transformer`, il s'agit du fichier `publier.json`, il est possible de le créer manuellement, mais le plus simple reste d'éecuter dans un premier temps la commande `transformer`, puis d'utiliser le fichier `publier.json` généré
- La zone couverte par le jeu de données permet d'indiquer à quelle est la couverture géographique sur data.gouv  
  Pour trouver la valeur de ce paramètre :
  - Rendez-vous sur la page d'[Administation](https://demo.data.gouv.fr/fr/admin/) de votre compte
  - Modifiez ou créez un jeu de données existant
  - Appuyez sur la touche `F12` pour afficher l'inspecteur de votre navigateur et observez le moniteur de réseau
  - [Optionnel] Effacez les requêtes présentes pour faciliter l'identification des prochaines requêtes
  - Dans le champ `Couverture spatiale`, entrez en entier le territoire que vous voulez par exemple `Métropole de Lyon`
  - Plusieurs requêtes sont envoyées au fur et à mesure que vous tapez
  - Observer la réponse au fromat json : c'est le champ id qui correspond à la valeur attendue par data.gouv.fr, ne gardez que la partie avant `@`
  - Par exemple pour `Métropole de Lyon`, il y a le champ `id "fr:epci:200046977@2015-01-01"`, la valeur à récupérer est : `fr:epci:200046977`

#### Options disponibles pour la commande publier

Plutôt que de laisser le programme poser des questions, il est possible d'utiliser des options pour saisir les informations nécessaires à l'execution :

##### L'URL de l'API `'-u, --data-gouv-api-url <api-url>`

L'URL de l'API data.gouv utilisé pour la publication. La valeur par défaut est l'URL de production : `https://www.data.gouv.fr/api/1`.

```bash
npx @gouvfr-anct/mednum publier -u https://demo.data.gouv.fr/api/1
```

ou

```bash
npx @gouvfr-anct/mednum publier --data-gouv-api-url https://demo.data.gouv.fr/api/1
```

##### La clé d'API `-k, --data-gouv-api-key <api-key>`

Une clé d'API data.gouv est nécessaire pour que l'outil ait les droits nécessaires à la publication des données en votre nom en utilisant l'API (https://doc.data.gouv.fr/api/intro/#autorisations).

```bash
npx @gouvfr-anct/mednum publier -k eyJhbGciOiJIUzUxMiJ9.eyJ1...A0fQ.-mCovxzx9-MjO-T_ynjky-Frl03fjjAL_AQlzQOPWpg8w_wvbzpz5KciStA
```

ou

```bash
npx @gouvfr-anct/mednum publier --data-gouv-api-key eyJhbGciOiJIUzUxMiJ9.eyJ1...A0fQ.-mCovxzx9-MjO-T_ynjky-Frl03fjjAL_AQlzQOPWpg8w_wvbzpz5KciStA
```

##### Le type d'id `-t, --data-gouv-id-type <id-type>`

Le type de l'id est nécessaire savoir s'il faut rattacher les données à publier à un utilisateur ou à une organisation.

Il n'existe que deux valeurs possibles : `owner` et `organization`

```bash
npx @gouvfr-anct/mednum publier -t organization
```

ou

```bash
npx @gouvfr-anct/mednum publier --data-gouv-id-type organization
```

##### La valeur de l'id `-v, --data-gouv-id-value <id-value>`

La valeur de l'id est nécessaire pour rattacher les données à publier à un utilisateur ou à une organisation existant sur data.gouv.

```bash
npx @gouvfr-anct/mednum publier -v 6396e6363a1ab130371ff777
```

ou

```bash
npx @gouvfr-anct/mednum publier --data-gouv-id-value 6396e6363a1ab130371ff777
```

##### La zone de couverture `-z, --data-gouv-zone <zone>`

La zone est nécessaire pour indiquer quel est le territoire couvert par le jeu de données.

```bash
npx @gouvfr-anct/mednum publier -z country:fr
```

ou

```bash
npx @gouvfr-anct/mednum publier --data-gouv-zone country:fr
```

##### Le chemin vers le fichier de métadonnées `-m, --data-gouv-metadata-file <metadata-file>`

Le chemin vers le fichier de métadonnées permet de savoir quel est le jeu de données à publier ainsi que les ressources qui le composent.

```bash
npx @gouvfr-anct/mednum publier -m ./assets/output/conseiller-numerique/publier.json
```

ou

```bash
npx @gouvfr-anct/mednum publier --data-gouv-metadata-file ./assets/output/conseiller-numerique/publier.json
```

##### Utilisation partielle des options

Si certaines options ne sont pas définies, les questions qui correspondent aux paramètres manquants seront affichés par la commande.

##### Exemple complet

```bash
npx @gouvfr-anct/mednum publier -u https://demo.data.gouv.fr/api/1 -k eyJhbGciOiJIUzUxMiJ9.eyJ1...A0fQ.-mCovxzx9-MjO-T_ynjky-Frl03fjjAL_AQlzQOPWpg8w_wvbzpz5KciStA -t organization -v 6396e6363a1ab130371ff777 -z country:fr -m ./assets/output/conseiller-numerique/publier.json
```

ou

```bash
npx @gouvfr-anct/mednum publier --data-gouv-api-url https://demo.data.gouv.fr/api/1 --data-gouv-api-key eyJhbGciOiJIUzUxMiJ9.eyJ1...A0fQ.-mCovxzx9-MjO-T_ynjky-Frl03fjjAL_AQlzQOPWpg8w_wvbzpz5KciStA --data-gouv-id-type organization --data-gouv-id-type organization --data-gouv-zone country:fr --data-gouv-metadata-file ./assets/output/conseiller-numerique/publier.json
```

#### Variables d'environnements pour la commande publier

Il est possible de configurer certaines variables d'environnements pour la commande publier, cela permet d'éviter de les préciser comme options de la commande et les questions ne seront pas posées pour les entrées correspondantes.

Voir [le fichier CONTRIBUTING.md](CONTRIBUTING.md#configurer-lenvironnement) pour plus de détails à ce sujet.

## Contribution

Voir le [guide de contribution](./CONTRIBUTING.md) du dépôt.

## Gestion des versions

Afin de maintenir un cycle de publication clair et de favoriser la rétrocompatibilité, la dénomination des versions suit la spécification décrite par la [Gestion sémantique de version](https://semver.org/lang/fr/)

Les versions disponibles ainsi que les journaux décrivant les changements apportés sont disponibles depuis [la page des Releases](https://github.com/anct-cartographie-nationale/mednum-cli/releases).

## Licence

Voir le fichier [LICENSE.md](./LICENSE.md) du dépôt.
