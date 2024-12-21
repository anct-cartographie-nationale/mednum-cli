import {
  DispositifProgrammeNational,
  FormationLabel,
  Frais,
  Itinerance,
  ModaliteAcces,
  ModaliteAccompagnement,
  PriseEnChargeSpecifique,
  PublicSpecifiquementAdresse,
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
  pivot?: Colonne;
  nom: Colonne;
  commune: Colonne;
  code_postal: Colonne;
  code_insee?: Colonne;
  adresse: Jonction & Partial<Colonne>;
  complement_adresse?: Colonne;
  latitude?: Dissociation & Partial<Colonne>;
  longitude?: Dissociation & Partial<Colonne>;
  typologie?: Choice<Typologie>[];
  telephone?: Colonne;
  site_web?: Colonne;
  courriels?: Colonne;
  presentation_resume?: Colonne;
  presentation_detail?: Colonne;
  source?: Colonne;
  itinerance?: Choice<Itinerance>[];
  structure_parente?: Colonne;
  date_maj: Partial<Colonne & Valeur>;
  services?: Choice<Service>[];
  publics_specifiquement_adresses?: Choice<PublicSpecifiquementAdresse>[];
  prise_en_charge_specifique?: Choice<PriseEnChargeSpecifique>[];
  frais_a_charge?: Choice<Frais>[];
  dispositif_programmes_nationaux?: Choice<DispositifProgrammeNational>[];
  formations_labels?: Choice<FormationLabel>[];
  autres_formations_labels?: Choice<string>[];
  modalites_acces?: Choice<ModaliteAcces>[];
  modalites_accompagnement?: Choice<ModaliteAccompagnement>[];
  fiche_acces_libre?: Colonne;
  prise_rdv?: Colonne;
  semaine_ouverture?: Colonne;
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
