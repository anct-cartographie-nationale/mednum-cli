import { Typologie } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { TypologieMatcher } from './typologies.field';

export const TYPOLOGIE_MATCHERS: TypologieMatcher[] = [
  {
    typologie: Typologie.BIB,
    matchers: [
      /m[ée]diath[èeé]que/iu,
      /bibl?ioth[èeé]que/iu,
      /Mediathquete/iu,
      /Mediathque/iu,
      /Médiathqèue/iu,
      /Médiatthèque/iu
    ]
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
    typologie: Typologie.MDS,
    matchers: [
      /(?:^|\W)MDSI?(?:\W|$)/iu,
      /(?:^|\W)MSD(?:\W|$)/iu,
      /maison du d[ée]partement/iu,
      /(?:maison|espace|centre) d[eé]partementale?s? des? (?:la )?solidarit[eé]s?/iu,
      /(?:maison|espace|centre) d[eé]partementale?s? de proximit[eé]/iu,
      /(?:maison|espace|centre) des? (?:la )?solidarit[eé]s? d[eé]partementale?s?/iu
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
    matchers: [/caisse d[’'\s]allocations familiales/iu, /(?:^|\s)CAF(?:\s|@|$)/iu]
  },
  {
    typologie: Typologie.CADA,
    matchers: [/CADA\s/iu]
  },
  {
    typologie: Typologie.CD,
    matchers: [/^CON?SEIL DEP/iu, /CDAD/iu]
  },
  {
    typologie: Typologie.CDAS,
    matchers: [/^CDAS(?:\s|$)/iu]
  },
  {
    typologie: Typologie.CFP,
    matchers: [/Finances Publiques/iu, /Finances Public/iu]
  },
  {
    typologie: Typologie.RS_FJT,
    matchers: [/(?:^|\W)FJT(?:\W|$)/iu]
  },
  {
    typologie: Typologie.ACI,
    matchers: [/^ACI\s/iu, /Chantier d'Insertion/iu]
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
      /familles? rurales?/iu,
      /LIGUE (?:DE L[\s']|D')?ENSEIGNEMENT/iu,
      /Konexio/iu,
      /Groupe SOS/iu,
      /APF\s/iu,
      /ASSO\s/iu,
      /associatif/iu,
      /Coallia/iu,
      /(?:^|\W)AFR(?:\W|$)/iu
    ]
  },
  {
    typologie: Typologie.CD,
    matchers: [/conseil d[eé]partemental/iu]
  },
  {
    typologie: Typologie.CC,
    matchers: [/^communaut[ée] des? com(?:munes?)?/iu, /^cdc(?:\W|$)/iu, /^cc(?:\W|$)/iu]
  },
  {
    typologie: Typologie.CCAS,
    matchers: [
      /(?:^|\W)ccas(?:\W|$)/iu,
      /(?:^|\W)c\.c\.a\.s(?:\W|$)/iu,
      /c(?:en)?tr?e com(?:munal)? action social/iu,
      /centre communal.? d[’'\s]action social/iu
    ]
  },
  {
    typologie: Typologie.CCONS,
    matchers: [/CONSULAT/iu]
  },
  {
    typologie: Typologie.CIAS,
    matchers: [/(?:^|\W)CIAS(?:\W|$)/iu, /centre intercommunal d[’'\s]action sociale/iu]
  },
  {
    typologie: Typologie.CIDFF,
    matchers: [/(?:^|\W)CIDFF(?:\W|\d|$)/iu]
  },
  {
    typologie: Typologie.CITMET,
    matchers: [/Cit[ée] de l'Emploi/iu, /CJM/iu, /Cit[ée] des M[ée]tiers/iu]
  },
  {
    typologie: Typologie.CMP,
    matchers: [/(?:^|\W)CMP(?:\W|\d|$)/iu, /Centre Médico Psychologique/iu]
  },
  {
    typologie: Typologie.CMS,
    matchers: [/^CMS(?:\s|$)/iu, /^PMS(?:\s|$)/iu, /(?:Centre|P[oô]le|Relais) m[ée]dic(?:o|aux)\WSocia(?:l|ux)/iu]
  },
  {
    typologie: Typologie.CPAM,
    matchers: [/(?:^|\W)CPAM(?:\W|$)/iu, /CAISSE PRIMAIRE D?[' ]?ASSURANCE MALADIE/iu]
  },
  {
    typologie: Typologie.CPH,
    matchers: [/(?:^|\W)CPH(?:\W|$)/iu]
  },
  {
    typologie: Typologie.CS,
    matchers: [/(?:^|\W)CS(?:\W|$)/iu, /(?:espace|c(?:en)?tre) (?:socia(?:l|ux)|soc\W)/iu]
  },
  {
    typologie: Typologie.CSAPA,
    matchers: [/(?:^|\W)CSAPA(?:\W|$)/iu]
  },
  {
    typologie: Typologie.CSC,
    matchers: [
      /(?:^|\W)CSC(?:\W|$)/iu,
      /soci(?:o|al)\W?cul?turel/iu,
      /Sociale? et Culturel(?:le)?/iu,
      /Culturel(?:le)? et Sociale?/iu,
      /Centres? Culturels?/iu
    ]
  },
  {
    typologie: Typologie.DEPT,
    matchers: [/(?:^|\W)DPT(?:\W|$)/iu, /^D[ée]partement(?:\W|$)/iu]
  },
  {
    typologie: Typologie.E2C,
    matchers: [/(?:^|\W)[ée]cole deuxième chance(?:\W|$)/iu]
  },
  {
    typologie: Typologie.EI,
    matchers: [/(?:^|\W)EI(?:\W|$)/iu]
  },
  {
    typologie: Typologie.ENM,
    matchers: [/(?:^|\W)Bus(?:\W|$)/iu]
  },
  {
    typologie: Typologie.EPI,
    matchers: [/(?:^|\W)EPI(?:\W|$)/iu, /Espace Public (?:Internet|Informatique)/iu]
  },
  {
    typologie: Typologie.EPIDE,
    matchers: [/(?:^|\W)EPIDE(?:\W|$)/iu]
  },
  {
    typologie: Typologie.EPN,
    matchers: [
      /(?:^|\W)EPN(?:\W|$)/iu,
      /(?:Espace|[ée]tablissement)s?(?: Publi(?:c|que))? (?:Multim[ée]dia|Num[ée]riques?)/iu,
      /Cyber\W?(?:base|centre)/iu
    ]
  },
  {
    typologie: Typologie.ES,
    matchers: [/[ée]picerie (?:bar|sociale|solidaire)/iu]
  },
  {
    typologie: Typologie.ESAT,
    matchers: [/(?:^|\W)ESAT(?:\W|$)/iu]
  },
  {
    typologie: Typologie.ESS,
    matchers: [/[ée]conomique Social et Solidaire/iu]
  },
  {
    typologie: Typologie.EVS,
    matchers: [/(?:^|\W)EVS(?:\W|$)/iu, /Espace de Vie Sociale/iu]
  },
  {
    typologie: Typologie.FABLAB,
    matchers: [/(?:^|\W)FAB\W?(?:LAB|AT)(?:\W|$)/iu]
  },
  {
    typologie: Typologie.FT,
    matchers: [/france travail/iu, /p[ôo]le emploi/iu]
  },
  {
    typologie: Typologie.GEIQ,
    matchers: [/Groupement (?:local )?(?:d')?Employeurs/iu, /Groupement pour l'Insertion/iu]
  },
  {
    typologie: Typologie.LA_POSTE,
    matchers: [/la\s?poste/iu, /poste\s/iu, /Agence (?:communale )?postale/iu, /Bureau de poste/iu]
  },
  {
    typologie: Typologie.MDE,
    matchers: [/Maison de l'emploi/iu, /Maison de l'économie/iu]
  },
  {
    typologie: Typologie.MDH,
    matchers: [/Maison des Habitant/iu]
  },
  {
    typologie: Typologie.MDPH,
    matchers: [/(?:^|\W)MDPH(?:\W|$)/iu, /Maison D[ée]p(?:artementale des)? Personnes Handicap[ée]es/iu]
  },
  {
    typologie: Typologie.MJC,
    matchers: [
      /(?:^|\W)MJC(?:\W|$)/iu,
      /(?:^|\W)M\.J\.C(?:\W|$)/iu,
      /maison (?:des? )?jeunes,? (?:et |& )?(?:de )?(?:la )?culture/iu
    ]
  },
  {
    typologie: Typologie.MQ,
    matchers: [/maison de quartier/iu]
  },
  {
    typologie: Typologie.MSAP,
    matchers: [/(?:^|\W)MSAP(?:\W|$)/iu, /(?:Maison|Relais) des? Services?/iu]
  },
  {
    typologie: Typologie.MUNI,
    matchers: [
      /(?:^|\W)Municipalité(?:\W|$)/iu,
      /(?:^|\W)mairie(?:\W|$)/iu,
      /(?:^|\W)maire(?:\W|$)/iu,
      /^commune(?:\W|$)/iu,
      /^CA\s/iu,
      /\sAgglo(?:m[ée]ration)?$/iu,
      /Agglom[ée]ration d/iu,
      /Communaut[ée] (?:d\W)?Agglom[ée]ration/iu,
      /^ville d[eu]/iu,
      /h[oô]tel de ville/iu
    ]
  },
  {
    typologie: Typologie.PAD,
    matchers: [/Accès au Droit/iu]
  },
  {
    typologie: Typologie.PI,
    matchers: [/Point d'information/iu, /Point Info/iu]
  },
  {
    typologie: Typologie.PIJ_BIJ,
    matchers: [
      /(?:^|\W)BIJ(?:\W|$)/iu,
      /info(?:rmation)?s? jeune/iu,
      /(?:^|\W)PIJ(?:\W|$)/iu,
      /(?:^|\W)CRIJ(?:\W|$)/iu,
      /point accueil jeunesse/iu,
      /Espace jeune/iu
    ]
  },
  {
    typologie: Typologie.PIMMS,
    matchers: [/(?:^|\W)PIMMS(?:\W|$)/iu, /point information mediation multi services/iu]
  },
  {
    typologie: Typologie.PLIE,
    matchers: [/^PLIE(?:\W|$)/iu]
  },
  {
    typologie: Typologie.PREF,
    matchers: [/^Pr[ée]fecture/iu, /^sous[-\s]pr[ée]fecture/iu]
  },
  {
    typologie: Typologie.REG,
    matchers: [/^R[ée]gion/iu]
  },
  {
    typologie: Typologie.RESSOURCERIE,
    matchers: [/Ressourcerie/iu]
  },
  {
    typologie: Typologie.UDAF,
    matchers: [/(?:^|\W)UDAF(?:\W|\d|$)/iu]
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
  }
];
