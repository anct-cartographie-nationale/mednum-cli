# Mednum CLI

## À propos

L'interface en ligne de commande `mednum` permet

- la transformation de données lieux de médiation numériques collectées dans un format non-standard vers le [schéma de données des lieux de médiation numérique](https://lamednum.coop/schema-de-donnees-des-lieux-de-mediation-numerique-2/).
- la publication des données standardisées sur [data.gouv.fr](https://www.data.gouv.fr/)

Les sources de données prises en comptes pour le moment sont celles collectées par

- Le dispositif [Conseiller Numérique France Services](https://www.conseiller-numerique.gouv.fr/)
- Le dispositif [France Services](https://agence-cohesion-territoires.gouv.fr/france-services-36)
- Le Hub [Les Assembleurs](https://assembleurs.co/)
- Le Hub [Hinaura](https://www.hinaura.fr/)
- Le [département du Maine-et-Loire](https://www.maine-et-loire.fr/aides-et-services/insertion-et-emploi/numerique/carte-mediation)

Les données sont republiées quotidiennement sur [data.gouv dans l'organisation de la Cartographie Nationale des lieux de médiation numérique](https://www.data.gouv.fr/fr/organizations/cartographie-nationale-des-lieux-de-mediation-numerique/)

## Table des matières

- 🪧 [À propos](#à-propos)
- 🛠️ [Utilisation](#utilisation)
- 🤝 [Contribution](#contribution)
- 📝 [Licence](#licence)

## Utilisation

### Transformer

La commande `mednum transformer` permet de générer un ensemble de fichiers standardisés à partir d'une source et d'un fichier de configuration qui fourni des instructions à propos des opérations à effectuer.

```bash
yarn mednum transformer
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
yarn mednum transformer --source https://api.conseiller-numerique.gouv.fr/permanences
```
ou
```bash
yarn mednum transformer -s https://api.conseiller-numerique.gouv.fr/permanences
```

##### Fichier de configuration `-c, --config-file <config-file>`

Le chemin vers le fichier de configuration contenant les instructions de transformation.

```bash
yarn mednum transformer --config-file ./assets/input/conseiller-numerique/conseiller-numerique.config.json
```
ou
```bash
yarn mednum transformer -c ./assets/input/conseiller-numerique/conseiller-numerique.config.json
```

##### Dossier de sortie `-o, --output-directory <output-directory>`

Le dossier dans lequel écrire les fichiers transformés.

```bash
yarn mednum transformer --output-directory ./assets/output/conseiller-numerique
```
ou
```bash
yarn mednum transformer -o ./assets/output/conseiller-numerique
```

##### Le nom de la source `-n, --source-name <source-name>`

Le nom de l'entité source à l'origine de la collecte des données.

```bash
yarn mednum transformer --source-name conseiller-numerique
```
ou
```bash
yarn mednum transformer -n conseiller-numerique
```

##### Le nom du territoire `t, --territory <territory>`

Le nom du territoire couvert par les données.

```bash
yarn mednum transformer -t National 
```
ou
```bash
yarn mednum transformer --territory National 
```

##### Utilisation partielle des options

Si certaines options ne sont pas définies, les questions qui correspondent aux paramètres manquants seront affichés par la commande.

##### Exemple complet

```bash
yarn mednum transformer -s https://api.conseiller-numerique.gouv.fr/permanences -c ./assets/input/conseiller-numerique/conseiller-numerique.config.json -o ./assets/output/conseiller-numerique -n conseiller-numerique -t National 
```
ou
```bash
yarn mednum transformer --source https://api.conseiller-numerique.gouv.fr/permanences --config-file ./assets/input/conseiller-numerique/conseiller-numerique.config.json --output-directory ./assets/output/conseiller-numerique --source-name conseiller-numerique --territory National 
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
    "colonnes": ["Détail publics", 'Accueil'],
    "termes": ["adultes"],
    "cible": "Adultes"
  },
  {
    "colonnes": ["Détail publics", 'Accueil'],
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
    "colonnes": ["Détail publics", 'Accueil'],
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
  "colonnes": ["Détail publics", 'Accueil'],
    "termes": ["adultes", "plus de 18 ans"],
    "cible": "Adultes"
  },
  {
    "colonnes": ["Détail publics", 'Accueil'],
    "termes": ["parentalité", "enfants"],
    "cible": "Familles/enfants"
  },
]
...
```

## Publier

La commande `mednum publier` permet de publier un jeu de données sur data.gouv.fr et d'y associer des ressources. Un fichier de métadonnées permet de définir les valeurs attendues par data.gouv dans les différentes étapes du processus de publication.

```bash
yarn mednum publier
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
  - Par exemple pour `Métropole de Lyon`, il y a le champ `id	"fr:epci:200046977@2015-01-01"`, la valeur à récupérer est : `fr:epci:200046977`

#### Options disponibles pour la commande publier

Plutôt que de laisser le programme poser des questions, il est possible d'utiliser des options pour saisir les informations nécessaires à l'execution :

##### L'URL de l'API `'-u, --data-gouv-api-url <api-url>`

L'URL de l'API data.gouv utilisé pour la publication. La valeur par défaut est l'URL de production : `https://www.data.gouv.fr/api/1`.

```bash
yarn mednum publier -u https://demo.data.gouv.fr/api/1
```
ou
```bash
yarn mednum publier --data-gouv-api-url https://demo.data.gouv.fr/api/1
```

##### La clé d'API `-k, --data-gouv-api-key <api-key>`

Une clé d'API data.gouv est nécessaire pour que l'outil ait les droits nécessaires à la publication des données en votre nom en utilisant l'API (https://doc.data.gouv.fr/api/intro/#autorisations).  

```bash
yarn mednum publier -k eyJhbGciOiJIUzUxMiJ9.eyJ1...A0fQ.-mCovxzx9-MjO-T_ynjky-Frl03fjjAL_AQlzQOPWpg8w_wvbzpz5KciStA
```
ou
```bash
yarn mednum publier --data-gouv-api-key eyJhbGciOiJIUzUxMiJ9.eyJ1...A0fQ.-mCovxzx9-MjO-T_ynjky-Frl03fjjAL_AQlzQOPWpg8w_wvbzpz5KciStA
```

##### Le type d'id `-t, --data-gouv-id-type <id-type>`

Le type de l'id est nécessaire savoir s'il faut rattacher les données à publier à un utilisateur ou à une organisation.

Il n'existe que deux valeurs possibles : `owner` et `organization`

```bash
yarn mednum publier -t organization
```
ou
```bash
yarn mednum publier --data-gouv-id-type organization
```

##### La valeur de l'id `-v, --data-gouv-id-value <id-value>`

La valeur de l'id est nécessaire pour rattacher les données à publier à un utilisateur ou à une organisation existant sur data.gouv.

```bash
yarn mednum publier -v 6396e6363a1ab130371ff777
```
ou
```bash
yarn mednum publier --data-gouv-id-value 6396e6363a1ab130371ff777
```

##### La zone de couverture `-z, --data-gouv-zone <zone>`

La zone est nécessaire pour indiquer quel est le territoire couvert par le jeu de données.

```bash
yarn mednum publier -z country:fr
```
ou
```bash
yarn mednum publier --data-gouv-zone country:fr
```

##### Le chemin vers le fichier de métadonnées `-m, --data-gouv-metadata-file <metadata-file>`

Le chemin vers le fichier de métadonnées permet de savoir quel est le jeu de données à publier ainsi que les ressources qui le composent.

```bash
yarn mednum publier -m ./assets/output/conseiller-numerique/publier.json
```
ou
```bash
yarn mednum publier --data-gouv-metadata-file ./assets/output/conseiller-numerique/publier.json
```

##### Utilisation partielle des options

Si certaines options ne sont pas définies, les questions qui correspondent aux paramètres manquants seront affichés par la commande.

##### Exemple complet

```bash
yarn mednum publie -u https://demo.data.gouv.fr/api/1 -k eyJhbGciOiJIUzUxMiJ9.eyJ1...A0fQ.-mCovxzx9-MjO-T_ynjky-Frl03fjjAL_AQlzQOPWpg8w_wvbzpz5KciStA -t organization -v 6396e6363a1ab130371ff777 -z country:fr -m ./assets/output/conseiller-numerique/publier.json
```
ou
```bash
yarn mednum publier --data-gouv-api-url https://demo.data.gouv.fr/api/1 --data-gouv-api-key eyJhbGciOiJIUzUxMiJ9.eyJ1...A0fQ.-mCovxzx9-MjO-T_ynjky-Frl03fjjAL_AQlzQOPWpg8w_wvbzpz5KciStA --data-gouv-id-type organization --data-gouv-id-type organization --data-gouv-zone country:fr --data-gouv-metadata-file ./assets/output/conseiller-numerique/publier.json
```

#### Variables d'environnements pour la commande publier

Il est possible de configurer certaines variables d'environnements pour la commande publier, cela permet d'éviter de les préciser comme options de la commande et les questions ne seront pas posées pour les entrées correspondantes.

Voir [le fichier CONTRIBUTING.md](CONTRIBUTING.md#configurer-lenvironnement) pour plus de détails à ce sujet.

## Contribution

Voir le [guide de contribution](./CONTRIBUTING.md) du dépôt.

## Licence

Voir le fichier [LICENSE.md](./LICENSE.md) du dépôt.
