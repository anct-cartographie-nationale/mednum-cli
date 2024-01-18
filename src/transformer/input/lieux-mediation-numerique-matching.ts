/* eslint-disable @typescript-eslint/naming-convention */

import {
  ConditionAcces,
  LabelNational,
  ModaliteAccompagnement,
  PublicAccueilli,
  Service,
  Typologie
} from '@gouvfr-anct/lieux-de-mediation-numerique';

export type DataSource = Record<string, unknown>;

export type Colonne = {
  colonne: string;
};

export type Valeur = {
  valeur: string;
};

export type Jonction = {
  joindre: {
    colonnes: string[];
    séparateur: string;
  };
};

export type Dissociation = {
  dissocier: {
    colonne: string;
    séparateur: string;
    partie: number;
  };
};

export type Choice<T> = {
  termes?: string[];
  sauf?: string[];
  colonnes?: string[];
  cible?: T;
};

export type LieuxMediationNumeriqueMatching = {
  id?: Colonne;
  nom: Colonne;
  pivot?: Colonne;
  typologie?: Choice<Typologie>[];
  code_postal: Colonne;
  commune: Colonne;
  adresse: Jonction & Partial<Colonne>;
  complement_adresse?: Colonne;
  code_insee?: Colonne;
  latitude?: Dissociation & Partial<Colonne>;
  longitude?: Dissociation & Partial<Colonne>;
  telephone?: Colonne;
  site_web?: Colonne;
  courriel?: Colonne;
  presentation_resume?: Colonne;
  presentation_detail?: Colonne;
  conditions_acces?: Choice<ConditionAcces>[];
  modalites_accompagnement?: Choice<ModaliteAccompagnement>[];
  date_maj: Partial<Colonne & Valeur>;
  source?: Colonne;
  labels_nationaux?: Choice<LabelNational>[];
  labels_autres?: Choice<string>[];
  publics_accueillis?: Choice<PublicAccueilli>[];
  services: (Choice<Service> & { modalitesAccompagnement?: ModaliteAccompagnement })[];
  prise_rdv?: Colonne;
  accessibilite?: Colonne;
  semaine_ouverture?: Colonne;
  prive?: Colonne;
  horaires?: {
    jours?: [
      {
        colonne: string[] | string;
        osm: 'Mo';
      },
      {
        colonne: string[] | string;
        osm: 'Tu';
      },
      {
        colonne: string[] | string;
        osm: 'We';
      },
      {
        colonne: string[] | string;
        osm: 'Th';
      },
      {
        colonne: string[] | string;
        osm: 'Fr';
      },
      {
        colonne: string[] | string;
        osm: 'Sa';
      },
      {
        colonne: string[] | string;
        osm: 'Su';
      }
    ];
    semaine?: string;
    osm?: string;
  };
};

export const cibleAsDefault = <T>(choice?: Choice<T>): T[] => (choice?.cible == null ? [] : [choice.cible]);
