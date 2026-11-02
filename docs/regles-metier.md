# Règles métier de la Cartographie Nationale

Ce document décrit les règles qui décident qu'un lieu de médiation numérique apparaît sur [la Cartographie Nationale](https://cartographie.societenumerique.gouv.fr), qu'il fusionne avec un autre, et qu'il porte tel ou tel label.

Quatre applications se succèdent entre la saisie d'un lieu et son affichage. Le document couvre trois d'entre elles : [la Coop de la médiation numérique](https://coop-numerique.anct.gouv.fr), qui expose ses lieux ; l'outil de traitement des données, appelé ici « la CLI », qui construit le jeu national ; et la cartographie, qui l'affiche. La quatrième, le dataspace de l'ANCT, qui se trouve entre la CLI et la cartographie, n'est pas couverte : c'est l'angle mort de ce document, nommé dans sa [dernière section](#langle-mort--du-jeu-national-à-la-cartographie).

## Sommaire

- [La chaîne de bout en bout](#la-chaîne-de-bout-en-bout)
- [En amont : ce que la Coop transmet](#en-amont--ce-que-la-coop-transmet)
- [Comment le jeu national est fabriqué](#comment-le-jeu-national-est-fabriqué)
- [Quelles sont les règles de fusion d'un lieu ?](#quelles-sont-les-règles-de-fusion-dun-lieu-)
- [Quelles sont les règles pour qu'un lieu soit dans le jeu national ?](#quelles-sont-les-règles-pour-quun-lieu-soit-dans-le-jeu-national-)
- [Quelles sont les règles pour qu'un lieu porte un label ?](#quelles-sont-les-règles-pour-quun-lieu-porte-un-label-)
- [En aval : ce que la cartographie affiche](#en-aval--ce-que-la-cartographie-affiche)
- [L'angle mort : du jeu national à la cartographie](#langle-mort--du-jeu-national-à-la-cartographie)
- [Liens utiles](#liens-utiles)

## La chaîne de bout en bout

1. **La Coop** expose par son API les lieux que ses utilisateurs ont rendus visibles, au [schéma national des lieux de médiation numérique](https://lamednum.coop/schema-de-donnees-des-lieux-de-mediation-numerique-2/).
2. **La CLI** lit chaque nuit la Coop et une vingtaine d'autres sources, les transforme vers ce même schéma, fusionne les doublons et publie le résultat sur [data.gouv.fr](https://www.data.gouv.fr/organizations/cartographie-nationale-des-lieux-de-mediation-numerique/datasets).
3. **Le dataspace** de l'ANCT lit la version hors Coop du jeu national, y réintègre les lieux de la Coop et de Mon Inclusion Numérique (MIN) qu'il consigne déjà, et expose le tout à la cartographie.
4. **La cartographie** lit le dataspace et affiche les lieux.

Un lieu peut donc être écarté à chacune de ces étapes, et la cause se cherche dans l'ordre : d'abord la Coop, puis le rapport d'erreurs de la CLI, puis le dataspace, enfin la cartographie.

## En amont : ce que la Coop transmet

La Coop ne transmet pas tous ses lieux. Ce qu'elle expose suit ses propres règles, à partir de choix faits dans son interface.

### Conditions pour qu'un lieu Coop soit transmis

Quatre conditions se cumulent. S'il en manque une, le lieu n'est pas transmis à la CLI et n'apparaîtra ni dans le jeu national ni sur la cartographie.

| Condition | Détail |
| --- | --- |
| Le lieu n'est pas supprimé | Un lieu supprimé dans la Coop disparaît de la transmission. |
| L'adresse est reconnue par la Base Adresse Nationale | La Coop ne transmet un lieu que si son adresse a reçu un identifiant de la [Base Adresse Nationale](https://adresse.data.gouv.fr). Une adresse non reconnue bloque le lieu dès la Coop. |
| Le lieu est déclaré visible sur la cartographie nationale | C'est l'interrupteur « Rendre ce lieu visible sur la cartographie nationale » de la fiche du lieu. Il est **désactivé par défaut** à la création. |
| Le lieu annonce au moins un service | Un lieu rendu visible sans service reçoit automatiquement deux services par défaut : « Maîtrise des outils numériques du quotidien » et « Compréhension du monde numérique ». |

**Aucune condition sur les médiateurs.** Un lieu visible est transmis même sans médiateur rattaché, même si son médiateur s'est retiré ou a supprimé son compte. C'est un changement récent de la Coop : auparavant un lieu sans médiateur n'était pas publié.

**Aucune condition de date.** Un lieu visible est transmis quelle que soit l'ancienneté de sa dernière mise à jour.

Avant transmission, chaque lieu est vérifié contre le schéma national. Si son identifiant, son nom, son adresse ou ses services sont invalides, il est écarté. Si un champ facultatif est invalide, horaires ou contact par exemple, seul ce champ est retiré et le lieu reste transmis.

### Le label Conseillers numériques côté Coop

La Coop transmet le label « Conseillers numériques » quand **au moins une personne rattachée au lieu** remplit toutes ces conditions :

- son rattachement au lieu est actif, ni supprimé ni terminé ;
- son profil est visible sur la cartographie, ce que le médiateur ou un administrateur peut désactiver ;
- son compte n'est pas supprimé ;
- son poste de conseiller numérique est marqué actif dans le dataspace.

Deux conséquences :

- **Un conseiller numérique qui a masqué son profil ne fait pas apparaître le label**, même s'il est en poste.
- **La date de fin de contrat n'est pas consultée.** Seul compte le marqueur « poste actif » du dataspace, qui ne suit pas toujours la fin de contrat. C'est un arbitrage de l'ANCT d'août 2026.

### Les autres labels côté Coop

- **Les autres dispositifs nationaux** (France Services, Aidants Connect…) viennent uniquement de la valeur enregistrée dans la fiche, héritée des imports. La Coop ne les calcule pas et ne permet pas de les saisir.
- **Les formations et labels** se saisissent dans la section « Description » de la fiche, parmi neuf valeurs. « Étapes numériques (La Poste) » n'y figure pas, bien que le schéma national la connaisse.
- **Les autres formations et labels** (texte libre) ne se saisissent pas dans la Coop ; les valeurs existantes viennent des imports.
- **« Ce lieu n'accueille pas de public »** ne se saisit pas dans la Coop non plus. Le formulaire ne propose que « Se présenter », « Téléphoner » et « Contacter par mail ». Une dizaine de lieux portent cette valeur, héritée des imports ; la CLI les écarte ensuite.

### L'identifiant d'un lieu Coop

La Coop transmet son identifiant interne, un code unique. La CLI le préfixe par le nom de la source : un lieu Coop s'identifie dans le jeu national par `Coop-numérique_` suivi de ce code. Le lien entre un lieu Coop et sa fiche sur la cartographie est tenu par le dataspace, pas par la Coop.

## Comment le jeu national est fabriqué

Chaque nuit, la CLI enchaîne quatre étapes sur une vingtaine de sources de données : la Coop, France Services, Dora, France Travail, et des hubs ou collectivités territoriales (Hinaura, Siilab, RhinOcc, Mednum BFC, Vendée, Loire-Atlantique…).

1. **Transformer.** Chaque source est lue dans son format d'origine et projetée vers le [schéma national](https://lamednum.coop/schema-de-donnees-des-lieux-de-mediation-numerique-2/). C'est à cette étape qu'un lieu peut être écarté parce qu'il est incomplet ou invalide, et que ses labels sont posés.
2. **Dédupliquer chaque source.** Les doublons internes à une même source sont fusionnés.
3. **Fusionner puis dédupliquer l'ensemble.** Les fichiers de toutes les sources sont réunis en un seul, et les doublons entre sources sont fusionnés. C'est ici qu'un lieu France Services et le même lieu déclaré dans la Coop deviennent un seul lieu.
4. **Publier.** Le résultat est publié sur data.gouv.fr dans le jeu [La Cartographie Nationale](https://www.data.gouv.fr/datasets/lieux-de-mediation-numerique-sur-le-territoire-national-fournis-par-la-cartographie-nationale), en JSON et en CSV.

Deux versions du jeu national sont publiées chaque nuit :

- **le jeu complet**, toutes sources confondues ;
- **le jeu hors Coop**, construit en retirant la source Coop avant la fusion et la déduplication. C'est la version que lit le dataspace : il la complète avec les lieux modifiés dans la Coop et dans MIN, qu'il consigne déjà de son côté. Partir du jeu complet lui ferait écraser ces modifications par la version de la nuit.

Chaque source dispose aussi de son propre jeu de données sur data.gouv.fr, publié après l'étape 2 et listé sur [la page de l'organisation](https://www.data.gouv.fr/organizations/cartographie-nationale-des-lieux-de-mediation-numerique/datasets).

### Où trouver les rapports d'erreurs

Chaque transformation produit un **rapport d'erreurs** par source, qui liste chaque lieu écarté ou corrigé avec son motif. C'est le premier document à consulter quand un producteur demande pourquoi son lieu n'apparaît pas.

Les rapports ne sont pas publiés sur data.gouv.fr. Ils sont conservés avec les résultats de chaque exécution nocturne sur GitHub, dans les artefacts du workflow [Nightly publish](https://github.com/anct-cartographie-nationale/mednum-cli/actions/workflows/nightly-publish.yml). Pour y accéder :

1. Ouvrir la page du workflow et cliquer sur l'exécution de la nuit voulue, la plus récente en haut de liste.
2. Descendre jusqu'à la rubrique **Artifacts**, en bas de la page de l'exécution.
3. Télécharger l'artefact qui porte le nom de la source, par exemple `vosges` ou `coop-numerique`. L'archive contient les fichiers transformés et deux fichiers suffixés `report`, l'un CSV, l'autre JSON : ce sont les rapports.
4. L'artefact `deduplicated` contient le jeu national et le fichier `duplications.csv` qui détaille chaque fusion ; `deduplicated-hors-coop` contient la version hors Coop.

Les artefacts sont conservés 90 jours par défaut. Il faut un compte GitHub pour les télécharger. Le format des colonnes du rapport est décrit dans [le README du dépôt](https://github.com/anct-cartographie-nationale/mednum-cli#contenu-du-rapport).

## Quelles sont les règles de fusion d'un lieu ?

### Deux lieux sont comparés en deux temps

La CLI compare chaque lieu à tous les autres. Avant de calculer quoi que ce soit, elle vérifie cinq conditions. Si une seule est remplie, les deux lieux ne seront jamais fusionnés :

| Condition d'exclusion | Ce que cela signifie |
| --- | --- |
| Sans identité | Le nom de l'un des deux est vide, ou vaut « non diffusible », « non communiqué », « inconnu ». |
| Sans emplacement | Aucun des deux n'a à la fois une adresse comparable et des coordonnées. |
| Commune différente | Les deux lieux ne sont pas dans la même commune. Les arrondissements de Paris, Lyon et Marseille comptent comme leur commune. |
| Typologies incompatibles | Les deux lieux ont des typologies (bibliothèque, mission locale, CAF…) et aucune en commun. Un lieu sans typologie en reçoit une déduite de son nom. « Relais France Services » et « PIMMS » sont considérés équivalents. |
| Même source | Les deux lieux viennent de la même source. Cette condition ne s'applique qu'à la déduplication nationale, pas à la déduplication interne de chaque source. |

Si aucune condition d'exclusion n'est remplie, un **score de ressemblance de 0 à 100** est calculé à partir de trois éléments :

- la ressemblance des **noms**, qui compte double ;
- la ressemblance des **adresses** ;
- la **distance** entre les deux points : 100 à moins de 50 mètres, puis décroissant.

Avant comparaison, les noms sont mis au même format : accents et ponctuation retirés, « Commune de », « Mairie de », « Hôtel de ville de » ramenés à « Ville », abréviations et pluriels aplanis. Ainsi « Mairie de Condé-en-Brie » et « COMMUNE DE CONDE EN BRIE » obtiennent un score de nom maximal.

### Le seuil de fusion

| Situation | Score minimal pour fusionner |
| --- | --- |
| Deux lieux de sources différentes | plus de 80 |
| Deux lieux d'une même source | plus de 90 |

Le seuil est plus élevé à l'intérieur d'une source parce que deux antennes voisines d'un même réseau se ressemblent beaucoup sans être le même lieu.

Les rapprochements retenus se propagent : si A ressemble à B et B ressemble à C, les trois forment un seul lieu, même si A et C ne se ressemblent pas directement.

### Ce que contient le lieu fusionné

Les lieux du groupe sont classés par date de mise à jour, du plus récent au plus ancien, puis fusionnés dans cet ordre :

- **Champs à valeur unique** (nom, adresse, téléphone, présentation, horaires, date de mise à jour…) : la valeur du lieu **le plus récent** l'emporte. L'autre lieu ne sert qu'à combler les champs vides.
- **Champs à valeurs multiples** (services, modalités d'accompagnement, modalités d'accès, frais, publics, typologies, courriels, sites web, labels) : les valeurs des deux lieux sont **réunies**, sans doublon, dans un ordre fixe.
- **Identifiant** : les identifiants d'origine sont conservés, mis bout à bout. Un lieu fusionné garde ainsi la trace de chaque source dont il vient.
- **SIRET** : celui du lieu le plus récent, sauf s'il n'en a pas ou s'il porte la valeur bouchon `00000000000000`, héritée d'anciennes sources qui ne connaissaient pas le SIRET. Dans ce cas, c'est le SIRET de l'autre lieu qui est conservé.

**Cas d'un lieu ancien.** Si l'un des deux lieux n'a pas été mis à jour depuis plus de six mois, la fusion est réduite : le lieu le plus récent est conservé tel quel, seuls les dispositifs nationaux (voir les labels) sont réunis. Une donnée périmée ne doit pas enrichir une donnée fraîche.

### Où vérifier un rapprochement

Chaque exécution produit un fichier `duplications.csv` qui liste tous les rapprochements avec leur score global, le score de nom, le score d'adresse, la distance en mètres, les deux noms, les deux adresses et les deux sources. Il se trouve dans l'artefact `deduplicated` de l'exécution nocturne, voir [Où trouver les rapports d'erreurs](#où-trouver-les-rapports-derreurs). C'est la trace à consulter quand un producteur conteste une fusion.

## Quelles sont les règles pour qu'un lieu soit dans le jeu national ?

Un lieu présent dans une source est publié dans le jeu national sauf s'il tombe dans l'un des cas ci-dessous. Chaque cas, sauf mention contraire, est inscrit au rapport d'erreurs de la source avec le nom du lieu et le motif.

### À la transformation

| Motif d'exclusion | Détail |
| --- | --- |
| Nom vide | Le nom est absent ou vide après nettoyage. Certains libellés de service pris pour un nom de lieu (« Ordinateur », « Wifi », « Réussir mes échanges avec France Travail »…) sont considérés comme vides. |
| Aucun service | Le lieu n'annonce aucun service de médiation numérique. |
| Adresse non localisée | La [Base Adresse Nationale](https://adresse.data.gouv.fr) n'a pas reconnu l'adresse et la source ne fournit pas de coordonnées. Sans coordonnées, un lieu ne peut pas être porté sur une carte. |
| Donnée invalide | Un champ ne respecte pas le schéma national : code postal, courriel, téléphone, adresse web, horaires hors format attendu… Le rapport nomme le champ fautif. |
| Identifiant partagé | Deux lieux d'une même source portent le même identifiant. Les deux sont écartés : publier l'un ferait disparaître l'autre en silence. |
| Lieu sans accueil du public | La source indique « Ce lieu n'accueille pas de public » dans les modalités d'accès. Ce cas n'est pas porté au rapport. |

### À la déduplication

| Motif d'exclusion | Détail |
| --- | --- |
| Exclusion sur décision métier | Une liste fixe d'une quinzaine d'identifiants est retirée du jeu national. C'est une solution temporaire pour écarter de la cartographie des lieux issus de sources externes alors qu'ils restent présents dans ces sources, sur lesquelles nous n'avons pas la main. La liste n'est modifiable que par une évolution de l'outil, ce qui la rend difficile à maintenir. La cible est une fonctionnalité de MIN permettant d'exclure un lieu issu d'une source externe, qui remplacerait cette liste. |
| Identifiant fusionné trop long | Un lieu issu de très nombreuses fusions dont l'identifiant cumulé dépasse une taille limite est retiré. Le cas est rare et apparaît dans le journal d'exécution. |

### Points d'attention pour le support

- Un lieu peut être présent dans le jeu de sa source et absent du jeu national : il a été fusionné avec un lieu d'une autre source. Chercher son identifiant d'origine dans l'identifiant du lieu fusionné.
- Un lieu Coop absent du jeu national a le plus souvent été écarté **avant** d'arriver à la CLI : vérifier d'abord les [conditions de transmission côté Coop](#conditions-pour-quun-lieu-coop-soit-transmis), puis le rapport d'erreurs de la source `coop-numerique`.
- Une adresse corrigée chez le producteur n'est revue par la Base Adresse Nationale qu'après un délai : un échec de géocodage est conservé en cache sept jours avant d'être retenté.

## Quelles sont les règles pour qu'un lieu porte un label ?

La CLI ne décide pas de l'affichage d'un label ; elle remplit trois champs du schéma national que la cartographie lit ensuite.

### Les trois champs de labels

| Champ | Nature | Valeurs |
| --- | --- | --- |
| Dispositifs et programmes nationaux | Liste fermée | Aidants Connect, Bibliothèques numérique de référence, Certification PIX, Conseillers numériques, Emmaüs Connect, France Services, Grande école du numérique, La Croix Rouge, Point d'accès numérique CAF, Promeneurs du net, Relais numérique (Emmaüs Connect) |
| Formations et labels | Liste fermée | Formé à « Mon Espace Santé », Formé à « DUPLEX » (illettrisme), Arnia/MedNum BFC, Collectif ressources et acteurs réemploi (Normandie), Étapes numériques (La Poste), Fabriques de Territoire, Les Éclaireurs du numérique (Drôme), Mes Papiers (Métropole de Lyon), ORDI 3.0, SUD LABS (PACA) |
| Autres formations et labels | Texte libre | Toute valeur fournie par la source, plus QPV et FRR calculés par la CLI |

### Comment un label est posé

Chaque source dispose d'une **configuration de correspondance** qui dit, colonne par colonne, quels termes de la source déclenchent quelle valeur. Trois mécanismes existent :

- **Par défaut** : toute ligne de la source reçoit la valeur. C'est le cas du label « France Services » pour la source France Services, et du label « Aidants Connect » pour la source Aidants Connect.
- **Par correspondance de terme** : la valeur est posée quand une colonne de la source contient un terme donné. C'est le mécanisme le plus courant.
- **Par recopie** : pour le champ libre, la valeur de la source est reprise telle quelle.

### Le label Conseillers numériques

Le label « Conseillers numériques » est posé sur un lieu Coop quand **la Coop le fournit** dans les données qu'elle transmet. La CLI recopie cette information ; elle ne la déduit pas elle-même de la présence d'un conseiller. La règle qui décide qu'un lieu Coop porte ce label est décrite dans [la section sur la Coop](#le-label-conseillers-numériques-côté-coop).

Aucune autre source ne peut poser ce label. Si une source autre que la Coop le déclare, la CLI le retire et porte le motif au rapport d'erreurs de la source ; le lieu reste publié sans ce label.

### Les labels calculés : QPV et FRR

Deux labels ne viennent d'aucune source. La CLI les calcule à partir de l'adresse géocodée :

- **QPV** si les coordonnées du lieu tombent dans un quartier prioritaire de la politique de la ville ;
- **FRR** si la commune du lieu est en zone France Ruralités Revitalisation.

Le label **ZRR** est supprimé partout, y compris quand une source continue de le fournir : le dispositif a été remplacé par FRR au 1er juillet 2024.

### Les labels et la fusion

Les trois champs de labels sont des listes à valeurs multiples : à la fusion, les labels des deux lieux sont **réunis**. Un lieu fusionné porte donc un label dès qu'un seul de ses doublons le portait. Un lieu France Services fusionné avec le même lieu déclaré dans la Coop portera à la fois « France Services » et, si la Coop le fournit, « Conseillers numériques ».

Les dispositifs nationaux sont le seul champ réuni même quand l'un des deux lieux a plus de six mois.

## En aval : ce que la cartographie affiche

### D'où viennent les lieux affichés

La cartographie ne lit ni data.gouv.fr ni la Coop : elle lit **le dataspace de l'ANCT**, et lui seul. Au démarrage, le serveur de la cartographie télécharge tous les lieux en une fois et les garde en mémoire. La carte, la liste, les compteurs, l'export CSV et les fiches lisent tous cette copie.

**Les données affichées ne se rafraîchissent pas toutes seules.** La copie en mémoire n'est renouvelée qu'au redémarrage du serveur ou par une commande de remise à zéro du cache, déclenchée de l'extérieur. Un lieu corrigé dans la Coop ou dans une source peut donc être à jour dans le dataspace et encore ancien sur la cartographie. En cas de doute, c'est la première chose à vérifier.

### Conditions pour qu'un lieu soit affiché

| Condition | Détail |
| --- | --- |
| Code INSEE présent | Un lieu sans code INSEE de commune n'est jamais chargé par la cartographie. |
| Coordonnées présentes, pour la carte seulement | Sans latitude et longitude, le lieu n'a pas de marqueur sur la carte. Il reste dans la liste, dans les compteurs, dans l'export, et sa fiche s'ouvre sans mini-carte. |
| Niveau de zoom | Jusqu'au zoom 7, la carte montre un compteur par région ; de 8 à 9, un compteur par département ; au-delà, les marqueurs individuels, regroupés en grappes numérotées quand ils sont proches. Un lieu qu'on ne voit pas peut simplement être dans une grappe. |

Les lieux situés à la même adresse sont écartés en cercle autour du point pour rester tous cliquables.

La cartographie n'applique **aucun filtre** sur l'ancienneté de la mise à jour, sur la source, sur l'itinérance ni sur « Ce lieu n'accueille pas de public ». Si un tel tri existe, il est fait par le dataspace avant livraison.

**Territoires non reconnus.** Saint-Pierre-et-Miquelon, Saint-Barthélemy et les collectivités du Pacifique ne figurent pas dans la table des départements de la cartographie. Un lieu dans ces territoires n'est compté dans aucun département, et le lien vers sa fiche depuis la liste ne fonctionne pas.

### Les filtres à la main de l'utilisateur

Les familles de filtres se cumulent ; dans une même famille, cocher plusieurs cases élargit la sélection.

| Filtre | Ce qu'il fait |
| --- | --- |
| Besoins | Les neuf services du schéma. |
| Public cible | Publics spécifiquement adressés (jeunes, seniors, étudiants, familles) et prises en charge spécifiques (langues étrangères, illettrisme, handicaps…). |
| Ouvert actuellement | Calculé depuis les horaires ; un lieu sans horaires ou aux horaires illisibles est exclu. |
| Ouvert le week-end, Gratuit, Prise de RDV en ligne | « Prise de RDV en ligne » retient tout lieu dont le champ de prise de rendez-vous est rempli. |
| Source | Liste des sources présentes dans les données. |
| Dispositifs | Seulement « Conseillers numériques » et « France Services ». |
| Territoires prioritaires | « QPV » et « FRR ». **La case « FRR » cherche en réalité la valeur ZRR**, que la CLI supprime : ce filtre ne remonte donc aucun lieu. Défaut connu à corriger côté cartographie. |

### Comment les labels sont affichés

- **Conseillers numériques et France Services.** Le logo s'affiche sur la carte de la liste et en grand sur la fiche, à côté du nom, **dès que le champ des dispositifs nationaux contient la valeur**. Rien d'autre n'entre en compte : ni le nombre de conseillers, ni la liste des médiateurs. Un lieu sans aucun des deux reçoit un logo générique « lieu de médiation numérique ».
- **Sur la carte elle-même, aucune distinction** : tous les marqueurs sont identiques, et le survol ne montre que le nom.
- **Les autres dispositifs nationaux** (Aidants Connect, Promeneurs du net…) **ne sont affichés nulle part** et ne peuvent pas être filtrés. Ils ne figurent que dans l'export CSV.
- **Formations et labels, autres formations et labels** : les deux listes sont affichées telles quelles sur la fiche, sous « Labellisation et certification », sans traduction des sigles. On lit donc « QPV » brut. Elles n'apparaissent pas dans la liste.

### Règles de présentation qui peuvent surprendre

- **Un lieu fusionné affiche une seule source**, celle que la CLI a retenue ; les sources fusionnées ne sont pas listées. Une fiche ouverte par un ancien identifiant redirige vers l'identifiant actuel.
- **Un service hors des neuf valeurs du schéma disparaît de la fiche.** Les services sont regroupés en trois rubriques dans un ordre fixé par la cartographie, non par la donnée.
- **La présentation détaillée remplace le résumé** : quand les deux existent, seul le détail est affiché.
- **Le badge « Sur rendez-vous »** de la liste s'affiche quand les modalités d'accès contiennent « Se présenter ». Le sens semble inversé ; à confirmer côté cartographie.
- **Dans la liste, l'adresse de la grande carte omet le numéro de voie** et répète le nom de voie. Sur la fiche, l'adresse est correcte. Défaut probable à signaler.
- **Les suggestions de recherche affichent le code INSEE** à la place du code postal.
- **Un lieu sans public spécifique affiche « Tout public »**.
- Les téléphones sont réécrits au format français par groupes de deux chiffres ; les sites web et courriels séparés par des barres verticales deviennent plusieurs liens ; la date de mise à jour est affichée à l'heure de Paris.

## L'angle mort : du jeu national à la cartographie

Entre la publication du jeu national par la CLI et son affichage par la cartographie se trouve le **dataspace de l'ANCT**. Il lit le jeu national hors Coop, y réintègre les lieux de la Coop et de MIN qu'il consigne déjà, et expose le résultat à la cartographie. Trois choses lui appartiennent et ne sont décrites ni ici ni dans les règles des trois applications couvertes :

- **La règle de réintégration des lieux Coop et MIN** dans le jeu hors Coop, et le rattachement entre un lieu Coop et sa fiche sur la cartographie.
- **Le marqueur « poste actif »** d'un conseiller numérique, que la Coop consulte pour poser le label Conseillers numériques.
- **Tout filtre éventuel appliqué avant livraison à la cartographie**, et le déclenchement du rafraîchissement de la cartographie après une mise à jour.

Quand une question de support n'a trouvé de réponse ni côté Coop, ni dans le rapport de la CLI, ni dans les règles d'affichage de la cartographie, c'est là qu'elle se trouve.

## Liens utiles

| Ressource | Lien |
| --- | --- |
| La Cartographie Nationale | https://cartographie.societenumerique.gouv.fr |
| La Coop de la médiation numérique | https://coop-numerique.anct.gouv.fr |
| Schéma national des lieux de médiation numérique | https://lamednum.coop/schema-de-donnees-des-lieux-de-mediation-numerique-2/ |
| Jeux de données publiés sur data.gouv.fr, un par source | https://www.data.gouv.fr/organizations/cartographie-nationale-des-lieux-de-mediation-numerique/datasets |
| Jeu national « La Cartographie Nationale », versions complète et hors Coop | https://www.data.gouv.fr/datasets/lieux-de-mediation-numerique-sur-le-territoire-national-fournis-par-la-cartographie-nationale |
| Exécutions nocturnes, rapports d'erreurs et fichier des fusions | https://github.com/anct-cartographie-nationale/mednum-cli/actions/workflows/nightly-publish.yml |
| Code et documentation de la CLI | https://github.com/anct-cartographie-nationale/mednum-cli |
| Code de la cartographie | https://github.com/anct-cartographie-nationale/cartographie |
| Code de la Coop | https://github.com/inclusion-numerique/coop-mediation-numerique |
| Base Adresse Nationale | https://adresse.data.gouv.fr |
| Contact support de la cartographie | carto@inclusion-numerique.anct.gouv.fr |

Les règles de ce document sont celles en vigueur à la date de rédaction, le 2 novembre 2026. Elles évoluent par modification des applications, versionnée et relue ; ce document doit être mis à jour en même temps.
