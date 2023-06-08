/* eslint-disable @typescript-eslint/naming-convention */

export type Erp = {
  name: string;
  siret: string;
  web_url: string;
  voie: string;
  numero: string;
  activite: string;
  postal_code: string;
};

export const activiteMediationNumerique: string[] = [
  'Administration publique',
  'Aide à la personne',
  'Association',
  "Bâtiment d'accueil",
  'Bibliothèque médiathèque',
  'Bureau de poste',
  "Caisse d'allocations familiales (caf)",
  'Centre culturel',
  'Centre de loisirs',
  'Centre national de la fonction publique territoriale',
  'Collège',
  'Coworking',
  'École élémentaire',
  'École primaire (regroupement maternelle et élémentaire)',
  'EHPAD',
  'Électroménager et matériel audio-vidéo',
  'Équipements du foyer',
  'Etablissement de prévention',
  'Établissement de santé',
  'Guichet france services',
  'Hôpital',
  'Imprimerie photocopie reliure',
  'Information Touristique',
  'Informatique',
  'Institut de formation',
  'Jeux jouets',
  'Kiosque (théâtre, pizza, journaux)',
  'Librairie',
  'Lieu de visite',
  'Lycée',
  'Mairie',
  'Maison de santé ou centre de santé',
  'Maison de services au public',
  'Organisme de conseil',
  'Personnes âgées : foyer restaurant',
  'Point justice',
  'Salle de spectacle',
  'Service ou aide à domicile',
  'Services techniques',
  'Université ou école supérieure'
];
