# Règles métier de la Cartographie Nationale

Ce document décrit les règles appliquées par l'outil qui construit le jeu de données national des lieux de médiation numérique publié sur data.gouv.fr. Il s'adresse aux équipes déploiement et support, qui ont besoin de savoir pourquoi un lieu apparaît, disparaît, fusionne avec un autre ou porte tel label.

Il décrit ce que fait l'outil de traitement des données, appelé ici « la CLI ». Deux acteurs interviennent avant et après lui et ne sont pas couverts ici : la Coop de la médiation numérique, qui décide quels lieux elle expose à la CLI, et la cartographie, qui décide comment elle affiche les données qu'elle lit. La dernière section précise cette frontière.

## Sommaire

- [Comment le jeu national est fabriqué](#comment-le-jeu-national-est-fabriqué)
- [Quelles sont les règles de fusion d'un lieu ?](#quelles-sont-les-règles-de-fusion-dun-lieu-)
- [Quelles sont les règles pour qu'un lieu soit dans le jeu national ?](#quelles-sont-les-règles-pour-quun-lieu-soit-dans-le-jeu-national-)
- [Quelles sont les règles pour qu'un lieu porte un label ?](#quelles-sont-les-règles-pour-quun-lieu-porte-un-label-)
- [Ce qui ne relève pas de la CLI](#ce-qui-ne-relève-pas-de-la-cli)

## Comment le jeu national est fabriqué

Chaque nuit, la CLI enchaîne quatre étapes sur une vingtaine de sources de données : la Coop de la médiation numérique, France Services, Dora, France Travail, et des hubs ou collectivités territoriales (Hinaura, Siilab, RhinOcc, Mednum BFC, Vendée, Loire-Atlantique…).

1. **Transformer.** Chaque source est lue dans son format d'origine et projetée vers le schéma national des lieux de médiation numérique. C'est à cette étape qu'un lieu peut être écarté parce qu'il est incomplet ou invalide, et que ses labels sont posés.
2. **Dédupliquer chaque source.** Les doublons internes à une même source sont fusionnés.
3. **Fusionner puis dédupliquer l'ensemble.** Les fichiers de toutes les sources sont réunis en un seul, et les doublons entre sources sont fusionnés. C'est ici qu'un lieu France Services et le même lieu déclaré dans la Coop deviennent un seul lieu.
4. **Publier.** Le résultat est publié sur data.gouv.fr dans le jeu « La Cartographie Nationale », en JSON et en CSV.

Deux versions du jeu national sont publiées chaque nuit :

- **le jeu complet**, toutes sources confondues ;
- **le jeu hors Coop**, construit en retirant la source Coop avant la fusion et la déduplication. C'est la version que lit l'entrepôt de données : il la complète avec les lieux modifiés dans la Coop et dans Mon Inclusion Numérique (MIN), qu'il consigne déjà de son côté. Partir du jeu complet lui ferait écraser ces modifications par la version de la nuit.

Chaque source dispose aussi de son propre jeu de données sur data.gouv.fr, publié après l'étape 2.

Chaque transformation produit un **rapport d'erreurs** par source, qui liste chaque lieu écarté avec son motif. C'est le premier document à consulter quand un producteur demande pourquoi son lieu n'apparaît pas.

## Quelles sont les règles de fusion d'un lieu ?

### Deux lieux sont comparés en deux temps

La CLI compare chaque lieu à tous les autres. Avant de calculer quoi que ce soit, elle vérifie cinq conditions. Si une seule est remplie, les deux lieux ne seront jamais fusionnés :

| Condition d'exclusion    | Ce que cela signifie                                                                                                                                                                                                      |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Sans identité            | Le nom de l'un des deux est vide, ou vaut « non diffusible », « non communiqué », « inconnu ».                                                                                                                            |
| Sans emplacement         | Aucun des deux n'a à la fois une adresse comparable et des coordonnées.                                                                                                                                                   |
| Commune différente       | Les deux lieux ne sont pas dans la même commune. Les arrondissements de Paris, Lyon et Marseille comptent comme leur commune.                                                                                             |
| Typologies incompatibles | Les deux lieux ont des typologies (bibliothèque, mission locale, CAF…) et aucune en commun. Un lieu sans typologie en reçoit une déduite de son nom. « Relais France Services » et « PIMMS » sont considérés équivalents. |
| Même source              | Les deux lieux viennent de la même source. Cette condition ne s'applique qu'à la déduplication nationale, pas à la déduplication interne de chaque source.                                                                |

Si aucune condition d'exclusion n'est remplie, un **score de ressemblance de 0 à 100** est calculé à partir de trois éléments :

- la ressemblance des **noms**, qui compte double ;
- la ressemblance des **adresses** ;
- la **distance** entre les deux points : 100 à moins de 50 mètres, puis décroissant.

Avant comparaison, les noms sont mis au même format : accents et ponctuation retirés, « Commune de », « Mairie de », « Hôtel de ville de » ramenés à « Ville », abréviations et pluriels aplanis. Ainsi « Mairie de Condé-en-Brie » et « COMMUNE DE CONDE EN BRIE » obtiennent un score de nom maximal.

### Le seuil de fusion

| Situation                         | Score minimal pour fusionner |
|-----------------------------------|------------------------------|
| Deux lieux de sources différentes | plus de 80                   |
| Deux lieux d'une même source      | plus de 90                   |

Le seuil est plus élevé à l'intérieur d'une source parce que deux antennes voisines d'un même réseau se ressemblent beaucoup sans être le même lieu.

Les rapprochements retenus se propagent : si A ressemble à B et B ressemble à C, les trois forment un seul lieu, même si A et C ne se ressemblent pas directement.

### Ce que contient le lieu fusionné

Les lieux du groupe sont classés par date de mise à jour, du plus récent au plus ancien, puis fusionnés dans cet ordre :

- **Champs à valeur unique** (nom, adresse, téléphone, présentation, horaires, date de mise à jour…) : la valeur du lieu **le plus récent** l'emporte. L'autre lieu ne sert qu'à combler les champs vides.
- **Champs à valeurs multiples** (services, modalités d'accompagnement, modalités d'accès, frais, publics, typologies, courriels, sites web, labels) : les valeurs des deux lieux sont **réunies**, sans doublon, dans un ordre fixe.
- **Identifiant** : les identifiants d'origine sont conservés, mis bout à bout. Un lieu fusionné garde ainsi la trace de chaque source dont il vient.
- **SIRET** : celui du lieu le plus récent, sauf s'il n'en a pas ou s'il porte la valeur `00000000000000`. Dans ce cas, c'est le SIRET de l'autre lieu qui est conservé.

**Cas d'un lieu ancien.** Si l'un des deux lieux n'a pas été mis à jour depuis plus de six mois, la fusion est réduite : le lieu le plus récent est conservé tel quel, seuls les dispositifs nationaux (voir les labels) sont réunis. Une donnée périmée ne doit pas enrichir une donnée fraîche.

### Où vérifier un rapprochement

Chaque exécution produit un fichier `duplications.csv` qui liste tous les rapprochements avec leur score global, le score de nom, le score d'adresse, la distance en mètres, les deux noms, les deux adresses et les deux sources. C'est la trace à consulter quand un producteur conteste une fusion.

## Quelles sont les règles pour qu'un lieu soit dans le jeu national ?

Un lieu présent dans une source est publié dans le jeu national sauf s'il tombe dans l'un des cas ci-dessous. Chaque cas, sauf mention contraire, est inscrit au rapport d'erreurs de la source avec le nom du lieu et le motif.

### À la transformation

| Motif d'exclusion           | Détail                                                                                                                                                                                                  |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Nom vide                    | Le nom est absent ou vide après nettoyage. Certains libellés de service pris pour un nom de lieu (« Ordinateur », « Wifi », « Réussir mes échanges avec France Travail »…) sont considérés comme vides. |
| Aucun service               | Le lieu n'annonce aucun service de médiation numérique.                                                                                                                                                 |
| Adresse non localisée       | La Base Adresse Nationale n'a pas reconnu l'adresse et la source ne fournit pas de coordonnées. Sans coordonnées, un lieu ne peut pas être porté sur une carte.                                         |
| Donnée invalide             | Un champ ne respecte pas le schéma national : code postal, courriel, téléphone, adresse web, horaires hors format attendu… Le rapport nomme le champ fautif.                                            |
| Identifiant partagé         | Deux lieux d'une même source portent le même identifiant. Les deux sont écartés : publier l'un ferait disparaître l'autre en silence.                                                                   |
| Lieu sans accueil du public | La source indique « Ce lieu n'accueille pas de public » dans les modalités d'accès. Ce cas n'est pas porté au rapport.                                                                                  |

### À la déduplication

| Motif d'exclusion              | Détail                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Exclusion sur décision métier  | Une liste fixe d'une quinzaine d'identifiants est retirée du jeu national. C'est une solution temporaire pour écarter de la cartographie des lieux issus de sources externes alors qu'ils restent présents dans ces sources, sur lesquelles nous n'avons pas la main. La liste n'est modifiable que par une évolution de l'outil, ce qui la rend difficile à maintenir. La cible est une fonctionnalité de MIN permettant d'exclure un lieu issu d'une source externe, qui remplacerait cette liste. |
| Identifiant fusionné trop long | Un lieu issu de très nombreuses fusions dont l'identifiant cumulé dépasse une taille limite est retiré. Le cas est rare et apparaît dans le journal d'exécution.                                                                                                                                                                                                                                                                                                                                     |

### Points d'attention pour le support

- Un lieu peut être présent dans le jeu de sa source et absent du jeu national : il a été fusionné avec un lieu d'une autre source. Chercher son identifiant d'origine dans l'identifiant du lieu fusionné.
- Un lieu Coop absent du jeu national a le plus souvent été écarté **avant** d'arriver à la CLI : la Coop n'expose que les lieux qu'elle considère publiés. Vérifier d'abord ce point côté Coop, puis le rapport d'erreurs de la source Coop.
- Une adresse corrigée chez le producteur n'est revue par la Base Adresse Nationale qu'après un délai : un échec de géocodage est conservé en cache sept jours avant d'être retenté.

## Quelles sont les règles pour qu'un lieu porte un label ?

La CLI ne décide pas de l'affichage d'un label ; elle remplit trois champs du schéma national que la cartographie lit ensuite.

### Les trois champs de labels

| Champ                               | Nature       | Valeurs                                                                                                                                                                                                                                                                                        |
|-------------------------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Dispositifs et programmes nationaux | Liste fermée | Aidants Connect, Bibliothèques numérique de référence, Certification PIX, Conseillers numériques, Emmaüs Connect, France Services, Grande école du numérique, La Croix Rouge, Point d'accès numérique CAF, Promeneurs du net, Relais numérique (Emmaüs Connect)                                |
| Formations et labels                | Liste fermée | Formé à « Mon Espace Santé », Formé à « DUPLEX » (illettrisme), Arnia/MedNum BFC, Collectif ressources et acteurs réemploi (Normandie), Étapes numériques (La Poste), Fabriques de Territoire, Les Éclaireurs du numérique (Drôme), Mes Papiers (Métropole de Lyon), ORDI 3.0, SUD LABS (PACA) |
| Autres formations et labels         | Texte libre  | Toute valeur fournie par la source, plus QPV et FRR calculés par la CLI                                                                                                                                                                                                                        |

### Comment un label est posé

Chaque source dispose d'une **configuration de correspondance** qui dit, colonne par colonne, quels termes de la source déclenchent quelle valeur. Trois mécanismes existent :

- **Par défaut** : toute ligne de la source reçoit la valeur. C'est le cas du label « France Services » pour la source France Services, et du label « Aidants Connect » pour la source Aidants Connect.
- **Par correspondance de terme** : la valeur est posée quand une colonne de la source contient un terme donné. C'est le mécanisme le plus courant.
- **Par recopie** : pour le champ libre, la valeur de la source est reprise telle quelle.

### Le label Conseillers numériques

Le label « Conseillers numériques » est posé sur un lieu Coop quand **la Coop le fournit** dans les données qu'elle expose. La CLI recopie cette information ; elle ne la déduit pas elle-même de la présence d'un conseiller. La règle qui décide qu'une structure Coop porte ce label est donc à chercher ailleurs, selon le jeu de données concerné : côté Coop pour le jeu national complet, côté dataspace pour les données affichées sur la cartographie, puisque le dataspace gère lui-même les lieux Coop avant de les fournir à la cartographie.

Aucune autre source ne peut poser ce label. Si une source autre que la Coop le déclare, la CLI le retire et porte le motif au rapport d'erreurs de la source ; le lieu reste publié sans ce label.

### Les labels calculés : QPV et FRR

Deux labels ne viennent d'aucune source. La CLI les calcule à partir de l'adresse géocodée :

- **QPV** si les coordonnées du lieu tombent dans un quartier prioritaire de la politique de la ville ;
- **FRR** si la commune du lieu est en zone France Ruralités Revitalisation.

Le label **ZRR** est supprimé partout, y compris quand une source continue de le fournir : le dispositif a été remplacé par FRR au 1er juillet 2024.

### Les labels et la fusion

Les trois champs de labels sont des listes à valeurs multiples : à la fusion, les labels des deux lieux sont **réunis**. Un lieu fusionné porte donc un label dès qu'un seul de ses doublons le portait. Un lieu France Services fusionné avec le même lieu déclaré dans la Coop portera à la fois « France Services » et, si la Coop le fournit, « Conseillers numériques ».

Les dispositifs nationaux sont le seul champ réuni même quand l'un des deux lieux a plus de six mois.

## Ce qui ne relève pas de la CLI

Trois questions reviennent au support et trouvent leur réponse ailleurs que dans cet outil.

- **Pourquoi un lieu Coop n'arrive pas jusqu'à la CLI.** La Coop décide quels lieux elle expose : un lieu non publié côté Coop, ou sans médiateur actif, n'est jamais vu par la CLI. La règle exacte est documentée côté Coop.
- **Pourquoi un lieu porte ou non le label Conseillers numériques.** La CLI recopie ce que la Coop fournit. Pour le jeu national complet, la règle est côté Coop ; pour ce qu'affiche la cartographie, elle est côté dataspace, qui gère lui-même les lieux Coop avant de les fournir à la cartographie.
- **Comment la cartographie affiche un lieu ou un label.** La cartographie lit le jeu national et applique ses propres règles d'affichage, de filtre et de pictogramme. Un lieu présent dans le jeu national mais invisible sur la carte, ou un label présent dans la donnée mais non affiché, relève du code de la cartographie.

Les règles de ce document sont celles du code en vigueur à la date de rédaction. Elles évoluent par modification de l'outil, versionnée et relue ; ce document doit être mis à jour en même temps.
