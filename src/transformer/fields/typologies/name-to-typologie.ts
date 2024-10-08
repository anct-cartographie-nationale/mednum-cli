/* eslint-disable max-lines */

import { Typologie } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { TypologieMatcher } from './typologies.field';

export const TYPOLOGIE_MATCHERS: TypologieMatcher[] = [
  {
    typologie: Typologie.MUNI,
    matchers: [/mairie/iu, /commune/iu, /^ville d[eu]/iu, /h[oô]tel de ville/iu]
  },
  {
    typologie: Typologie.FT,
    matchers: [/france travail/iu]
  },
  {
    typologie: Typologie.FT,
    matchers: [/p[ôo]le emploi/iu]
  },
  {
    typologie: Typologie.BIB,
    matchers: [/m[ée]diath[èeé]que/iu, /biblioth[èeé]que/iu]
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
      /(?:maison|espace) d[eé]partementale? des solidarit[eé]s/iu,
      /(?:maison|espace) d[eé]partementale? de la solidarit[ée]/iu,
      /(?:maison|espace) de la solidarit[eé] d[eé]partementale/iu
    ]
  },
  {
    typologie: Typologie.CHRS,
    matchers: [/centre d'h[eé]bergement et de r[eé]insertion sociale/iu]
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
      /emma[üu]s/iu,
      /secours populaire/iu,
      /croix[\s-]Rouge/iu,
      /secours catholique/iu,
      /restos du c(?:oe|œ)ur/iu,
      /familles rurales/iu,
      /(?:^|\W)AFR(?:\W|$)/iu
    ]
  },
  {
    typologie: Typologie.CS,
    matchers: [/centre social/iu, /centres sociaux/iu]
  },
  {
    typologie: Typologie.PREF,
    matchers: [/sous[-\s]pr[ée]fecture/iu]
  },
  {
    typologie: Typologie.CD,
    matchers: [/conseil d[eé]partemental/iu]
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
      /chambre[\w\s']+m[ée]tiers[\w\s']+artisanat/iu,
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
      /(?:^|\W)EFS(?:\W|$)/iu,
      /frances?[\s-]services?/iu,
      /Fixe Bruay-sur-l'Escaut\s{2}\( D[ée]partement du Nord\)/iu,
      /Folschviller - Antenne de L'H[ôo]pital/iu,
      /Communaut[eé] de communes Vaison Ventoux/iu
    ]
  },
  {
    typologie: Typologie.PIMMS,
    matchers: [/(?:^|\W)PIMMS(?:\W|$)/iu, /point information mediation multi services/iu]
  }
];
