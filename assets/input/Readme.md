# Transformation inputs

Les dossiers d'input nommés d'après la source correspondante contiennent les instructions de transformations à opérer pour chacun des jeux de données dans les fichiers `[source].config.json`.

Optionnellement ces dossiers peuvent également contenir les données à transformer, mais dans la plupart des cas, nous préférons avoir une source de données à transformer accessible depuis une url, ainsi nous n'avons pas besoin de modifier les fichiers de données dans ce dépôt pour procéder à une mise à jour des données.

Les associations entre configuration de transformation et données à transformer sont exposés dans la propriété `scripts` du fichier [package.json](../../package.json).

Le principe des fichiers de configurations est d'établir une correspondance entre les champs issus de la source de données originale et les champs du schéma de données des lieux de médiation numérique :
- id
- pivot
- nom
- commune
- code_postal
- code_insee
- adresse
- complement_adresse
- latitude
- longitude
- telephone
- courriels
- site_web
- date_maj
- source
- prise_rdv
- presentation_resume
- presentation_detail
- fiche_acces_libre
- structure_parente
- [typologie](https://www.data.inclusion.beta.gouv.fr/schemas-de-donnees-de-loffre/schema-des-structures-et-services-dinsertion/typologie-de-structures)
- [itinerance](https://github.com/LaMednum/standard-mediation-num/blob/e347ff40a0072ed2e0caf7f04384dfd2c84dbaff/schema.json#L275)
  - Itinérant
  - Fixe
- [frais_a_charge](https://github.com/LaMednum/standard-mediation-num/blob/e347ff40a0072ed2e0caf7f04384dfd2c84dbaff/schema.json#L339)
  - Gratuit
  - Gratuit sous condition
  - Payant
- [modalites_accompagnement](https://github.com/LaMednum/standard-mediation-num/blob/e347ff40a0072ed2e0caf7f04384dfd2c84dbaff/schema.json#L393)
  - En autonomie
  - Accompagnement individuel
  - Dans un atelier collectif
  - À distance
- [modalites_acces](https://github.com/LaMednum/standard-mediation-num/blob/e347ff40a0072ed2e0caf7f04384dfd2c84dbaff/schema.json#L382)
  - Se présenter
  - Téléphoner
  - Contacter par mail
  - Prendre un RDV en ligne
  - Ce lieu n'accueille pas de public
  - Envoyer un mail avec une fiche de prescription
- [publics_specifiquement_adresses](https://github.com/LaMednum/standard-mediation-num/blob/e347ff40a0072ed2e0caf7f04384dfd2c84dbaff/schema.json#L317)
  - Jeunes
  - Étudiants
  - Familles et/ou enfants
  - Seniors
  - Femmes
- [prise_en_charge_specifique](https://github.com/LaMednum/standard-mediation-num/blob/e347ff40a0072ed2e0caf7f04384dfd2c84dbaff/schema.json#L328)
  - Surdité
  - Handicaps moteurs
  - Handicaps mentaux
  - Illettrisme
  - Langues étrangères (anglais)
  - Langues étrangères (autres)
  - Déficience visuelle
- [services](https://github.com/LaMednum/standard-mediation-num/blob/e347ff40a0072ed2e0caf7f04384dfd2c84dbaff/schema.json#L307)
  - Aide aux démarches administratives
  - Maîtrise des outils numériques du quotidien
  - Insertion professionnelle via le numérique
  - Utilisation sécurisée du numérique
  - Parentalité et éducation avec le numérique
  - Loisirs et créations numériques
  - Compréhension du monde numérique
  - Accès internet et matériel informatique
  - Acquisition de matériel informatique à prix solidaire
- [dispositif_programmes_nationaux](https://github.com/LaMednum/standard-mediation-num/blob/e347ff40a0072ed2e0caf7f04384dfd2c84dbaff/schema.json#L350)
- [formations_labels](https://github.com/LaMednum/standard-mediation-num/blob/e347ff40a0072ed2e0caf7f04384dfd2c84dbaff/schema.json#L361)
- [autres_formations_labels](https://github.com/LaMednum/standard-mediation-num/blob/e347ff40a0072ed2e0caf7f04384dfd2c84dbaff/schema.json#L372)
- horaires
