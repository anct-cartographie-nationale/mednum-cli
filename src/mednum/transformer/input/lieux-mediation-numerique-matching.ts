/* eslint-disable @typescript-eslint/naming-convention */

import {
  ConditionAcces,
  LabelNational,
  ModaliteAccompagnement,
  PublicAccueilli,
  Service
} from '@gouvfr-anct/lieux-de-mediation-numerique';

export type DataSource = Record<string, string>;

export type Colonne = {
  colonne: string;
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
  colonnes?: string[];
  termes?: string[];
  sauf?: string[];
  cible: T;
};

export type LieuxMediationNumeriqueMatching = {
  id?: Colonne;
  nom: Colonne;
  code_postal: Colonne;
  commune: Colonne;
  voie: Jonction & Partial<Colonne>;
  complement_adresse?: Colonne;
  code_insee?: Colonne;
  latitude: Dissociation & Partial<Colonne>;
  longitude: Dissociation & Partial<Colonne>;
  telephone?: Colonne;
  site_web?: Colonne;
  courriel?: Colonne;
  conditionAcces?: Choice<ConditionAcces>[];
  modaliteAccompagnement?: Choice<ModaliteAccompagnement>[];
  date_maj: Colonne;
  labels_nationaux?: Choice<LabelNational>[];
  publics_accueillis: Choice<PublicAccueilli>[];
  services: (Choice<Service> & { modalitesAccompagnement?: ModaliteAccompagnement })[];
  horaires?: {
    jours: [
      {
        colonne: string;
        osm: 'Mo';
      },
      {
        colonne: string;
        osm: 'Tu';
      },
      {
        colonne: string;
        osm: 'We';
      },
      {
        colonne: string;
        osm: 'Th';
      },
      {
        colonne: string;
        osm: 'Fr';
      },
      {
        colonne: string;
        osm: 'Sa';
      },
      {
        colonne: string;
        osm: 'Su';
      }
    ];
    semaine?: string;
  };
};
