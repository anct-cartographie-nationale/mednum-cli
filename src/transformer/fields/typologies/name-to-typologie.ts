/* eslint-disable max-lines */

import { Typologie } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { TypologieMatcher } from './typologies.field';

export const TYPOLOGIE_MATCHERS: TypologieMatcher[] = [
  {
    typologie: Typologie.MUNI,
    matchers: [/mairie/iu, /commune/iu, /^ville d[eu]/iu, /hôtel de ville/iu]
  },
  {
    typologie: Typologie.PE,
    matchers: [/p[ôo]le emploi/iu]
  },
  {
    typologie: Typologie.CS,
    matchers: [/centre social/iu, /centres sociaux/iu]
  },
  {
    typologie: Typologie.BIB,
    matchers: [/m[ée]diath[èe]que/iu, /biblioth[èe]que/iu]
  },
  {
    typologie: Typologie.TIERS_LIEUX,
    matchers: [/tiers[\s-]lieu/iu, /cowork/iu]
  },
  {
    typologie: Typologie.ML,
    matchers: [/mission locale/iu, /mis local/iu]
  },
  {
    typologie: Typologie.MQ,
    matchers: [/maison de quartier/iu]
  },
  {
    typologie: Typologie.MDS,
    matchers: [
      /maison du d[ée]partement/iu,
      /(?:maison|espace) départementale? des solidarités/iu,
      /(?:maison|espace) départementale? de la solidarité/iu,
      /(?:maison|espace) de la solidarité départementale/iu
    ]
  },
  {
    typologie: Typologie.CHRS,
    matchers: [/centre d'hébergement et de réinsertion sociale/iu]
  },
  {
    typologie: Typologie.CHU,
    matchers: [/(?:^|\W)CHU(?:\W|$)/iu]
  },
  {
    typologie: Typologie.CAF,
    matchers: [/caisse d[’'\s]allocations familiales/iu]
  },
  {
    typologie: Typologie.RS_FJT,
    matchers: [/(?:^|\W)FJT(?:\W|$)/iu]
  },
  {
    typologie: Typologie.PIJ_BIJ,
    matchers: [/info(?:rmation)?s? jeune/iu, /(?:^|\W)PIJ(?:\W|$)/iu, /(?:^|\W)CRIJ(?:\W|$)/iu, /point accueil jeunesse/iu]
  },
  {
    typologie: Typologie.ASSO,
    matchers: [
      /(?:^|\W)ASS(?:\W|$)/iu,
      /(?:^|\W)ASSOC(?:\W|$)/iu,
      /association/iu,
      /emmaüs/iu,
      /secours populaire/iu,
      /croix[\s-]Rouge/iu,
      /secours catholique/iu,
      /restos du c(?:oe|œ)ur/iu,
      /familles rurales/iu,
      /(?:^|\W)AFR(?:\W|$)/iu
    ]
  },
  {
    typologie: Typologie.PREF,
    matchers: [/sous[-\s]prefecture/iu]
  },
  {
    typologie: Typologie.CD,
    matchers: [/conseil départemental/iu]
  },
  {
    typologie: Typologie.CC,
    matchers: [/communaut[ée] de communes/iu, /(?:^|\W)cdc(?:\W|$)/iu, /(?:^|\W)cc(?:\W|$)/iu, /communaute com/iu]
  },
  {
    typologie: Typologie.CCAS,
    matchers: [/(?:^|\W)ccas(?:\W|$)/iu, /ctre com action social/iu, /centre communal d[’'\s]action social/iu]
  },
  {
    typologie: Typologie.CIAS,
    matchers: [/(?:^|\W)CIAS(?:\W|$)/iu, /centre intercommunal d[’'\s]action sociale/iu]
  },
  {
    typologie: Typologie.AFPA,
    matchers: [/(?:^|\W)AFPA(?:\W|$)/iu]
  },
  {
    typologie: Typologie.CHRS,
    matchers: [/(?:^|\W)CHRS(?:\W|$)/iu]
  },
  {
    typologie: Typologie.MJC,
    matchers: [/(?:^|\W)MJC(?:\W|$)/iu, /maison des jeunes (?:et )?de la culture/iu]
  },
  {
    typologie: Typologie.MDE,
    matchers: [/(?:^|\W)MDE(?:\W|$)/iu, /maison[\w\s',]+de l[’'\s]emploi/iu]
  },
  {
    typologie: Typologie.CCONS,
    matchers: [
      /chambre[\w\s']+agriculture/iu,
      /chambre[\w\s']+metiers[\w\s']+artisanat/iu,
      /chambre[\w\s']+commerce[\w\s']+industrie/iu,
      /(?:^|\W)CCI(?:\W|$)/iu
    ]
  },
  {
    typologie: Typologie.CAP_EMPLOI,
    matchers: [/cap emploi/iu]
  },
  {
    typologie: Typologie.UDAF,
    matchers: [/(?:^|\W)UDAF(?:\W|$)/iu, /union des associations familiales/iu]
  },
  {
    typologie: Typologie.RFS,
    matchers: [
      /frances?[\s-]services?/iu,
      /Fixe Bruay-sur-l'Escaut\s{2}\( Département du Nord\)/iu,
      /Folschviller - Antenne de L'Hôpital/iu,
      /Communauté de communes Vaison Ventoux/iu
    ]
  },
  {
    typologie: Typologie.PIMMS,
    matchers: [/(?:^|\W)PIMMS(?:\W|$)/iu, /point information mediation multi services/iu]
  }
];
