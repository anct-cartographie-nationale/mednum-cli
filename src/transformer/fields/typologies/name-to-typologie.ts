import { Typologie } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { TypologieMatcher } from './typologies.field';

export const TYPOLOGIE_MATCHERS: TypologieMatcher[] = [
  {
    typologie: Typologie.BIB,
    matchers: [/m[ée]diath[èeé]que/i, /bibl?ioth[èeé]que/i, /Mediathquete/i, /Mediathque/i, /Médiathqèue/i, /Médiatthèque/i]
  },
  {
    typologie: Typologie.TIERS_LIEUX,
    matchers: [/tiers[\s-]lieu/i, /cowork/i]
  },
  {
    typologie: Typologie.ML,
    matchers: [/mission locale/i, /mis local/i]
  },
  {
    typologie: Typologie.MDS,
    matchers: [
      /(?:^|\W)MDSI?(?:\W|$)/i,
      /(?:^|\W)MSD(?:\W|$)/i,
      /(?:^|\W)EDS(?:\W|$)/i,
      /maison du d[ée]partement/i,
      /(?:maison|espace|centre) d[eé]partementale?s? des? (?:la )?solidarit[eé]s?/i,
      /(?:maison|espace|centre) d[eé]partementale?s? de proximit[eé]/i,
      /(?:maison|espace|centre) des? (?:la )?solidarit[eé]s? d[eé]partementale?s?/i
    ]
  },
  {
    typologie: Typologie.CHRS,
    matchers: [/centre d'h[eé]bergement et de r[eé]insertion sociale/i]
  },
  {
    typologie: Typologie.CHU,
    matchers: [/Centre (?:d')?h[ée]bergement (?:d')?urgence/i]
  },
  {
    typologie: Typologie.CAF,
    matchers: [/caisse d[’'\s]allocations familiales/i, /(?:^|\s)CAF(?:\s|@|$)/i]
  },
  {
    typologie: Typologie.CADA,
    matchers: [/CADA\s/i, /centre d'accueil (?:pour )?demandeurs? d'Asile/i]
  },
  {
    typologie: Typologie.CAARUD,
    matchers: [/CAARUD/i]
  },
  {
    typologie: Typologie.CD,
    matchers: [/^CON?SEIL DEP/i, /CDAD/i]
  },
  {
    typologie: Typologie.CDAS,
    matchers: [/^CDAS(?:\s|$)/i, /Maison Départementale d'Action Sociale/i]
  },
  {
    typologie: Typologie.CFP,
    matchers: [/Finances Publiques/i, /Finances Public/i]
  },
  {
    typologie: Typologie.RS_FJT,
    matchers: [/(?:^|\W)FJT(?:\W|$)/i]
  },
  {
    typologie: Typologie.ACI,
    matchers: [/^ACI\s/i, /Chantier d'Insertion/i]
  },
  {
    typologie: Typologie.ASSO,
    matchers: [
      /(?:^|\W)ASS(?:\W|$)/i,
      /(?:^|\W)ASSOC(?:\W|$)/i,
      /association/i,
      /emma[üu]s/i,
      /secours populaire/i,
      /croix[\s-]Rouge/i,
      /secours catholique/i,
      /restos du c(?:oe|œ)ur/i,
      /familles? rurales?/i,
      /LIGUE (?:DE L[\s']|D')?ENSEIGNEMENT/i,
      /Konexio/i,
      /Groupe SOS/i,
      /APF\s/i,
      /ASSO\s/i,
      /associatif/i,
      /Coallia/i,
      /Restaurants du Coeur/i,
      /(?:^|\W)AFR(?:\W|$)/i
    ]
  },
  {
    typologie: Typologie.CD,
    matchers: [/conseil d[eé]partemental/i]
  },
  {
    typologie: Typologie.CC,
    matchers: [/^communaut[ée] (?:des? )?(?:inter)?com(?:munes?)?/i, /^cdc(?:\W|$)/i, /^cc(?:\W|$)/i]
  },
  {
    typologie: Typologie.CCAS,
    matchers: [
      /(?:^|\W)ccas(?:\W|$)/i,
      /(?:^|\W)c\.c\.a\.s(?:\W|$)/i,
      /c(?:en)?tr?e com(?:munal)? action social/i,
      /centre communal.? d[’'\s]action social/i
    ]
  },
  {
    typologie: Typologie.CCONS,
    matchers: [/CONSULAT/i]
  },
  {
    typologie: Typologie.CIAS,
    matchers: [/(?:^|\W)CIAS(?:\W|$)/i, /centre intercommunal d[’'\s]actions? sociale/i]
  },
  {
    typologie: Typologie.CIDFF,
    matchers: [/(?:^|\W)CIDFF(?:\W|\d|$)/i]
  },
  {
    typologie: Typologie.CITMET,
    matchers: [/Cit[ée] de l'Emploi/i, /CJM/i, /Cit[ée] des M[ée]tiers/i]
  },
  {
    typologie: Typologie.CMP,
    matchers: [/(?:^|\W)CMP(?:\W|\d|$)/i, /Centre Médico Psychologique/i]
  },
  {
    typologie: Typologie.CMS,
    matchers: [/^CMS(?:\s|$)/i, /^PMS(?:\s|$)/i, /(?:Centre|P[oô]le|Relais|Permanence)\Wm[ée]dic(?:o|aux)\WSocia(?:l|ux)/i]
  },
  {
    typologie: Typologie.CPAM,
    matchers: [/(?:^|\W)CPAM(?:\W|$)/i, /CAISSE PRIMAIRE D?[’' ]?ASSURANCE MALADIE/i]
  },
  {
    typologie: Typologie.CPH,
    matchers: [/(?:^|\W)CPH(?:\W|$)/i, /Centre provisoire d'Hébergement/i]
  },
  {
    typologie: Typologie.CS,
    matchers: [/(?:^|\W)CS(?:\W|$)/i, /(?:espace|c(?:en)?tre)s? (?:socia(?:l|ux)|soc\W)/i]
  },
  {
    typologie: Typologie.CSAPA,
    matchers: [/(?:^|\W)CSAPA(?:\W|$)/i]
  },
  {
    typologie: Typologie.CSC,
    matchers: [
      /(?:^|\W)CSC(?:\W|$)/i,
      /soci(?:o|al)\W?cul?turel/i,
      /Sociale? et Culturel(?:le)?/i,
      /Culturel(?:le)? et Sociale?/i,
      /Centres? Culturels?/i
    ]
  },
  {
    typologie: Typologie.DEPT,
    matchers: [/(?:^|\W)DPT(?:\W|$)/i, /^D[ée]partement(?:\W|$)/i]
  },
  {
    typologie: Typologie.E2C,
    matchers: [/(?:^|\W)[ée]cole deuxième chance(?:\W|$)/i]
  },
  {
    typologie: Typologie.EI,
    matchers: [/(?:^|\W)EI(?:\W|$)/i]
  },
  {
    typologie: Typologie.ENM,
    matchers: [/(?:^|\W)Bus(?:\W|$)/i, /Van numérique/i]
  },
  {
    typologie: Typologie.EPCI,
    matchers: [/(?:^|\W)EPCI(?:\W|$)/i, /Intercommunalité/i]
  },
  {
    typologie: Typologie.EPI,
    matchers: [/(?:^|\W)EPI(?:\W|$)/i, /Esp[a@]ce (?:Public )?(?:Internet|Informatique|Connecté)/i]
  },
  {
    typologie: Typologie.EPIDE,
    matchers: [/(?:^|\W)EPIDE(?:\W|$)/i]
  },
  {
    typologie: Typologie.EPN,
    matchers: [
      /(?:^|\W)EPN(?:\W|$)/i,
      /(?:Espace|[ée]tablissement)s?(?: Publi(?:c|que))? (?:Multim[ée]dia|Num[ée]riques?)/i,
      /Cyber\W?(?:base|centre)/i
    ]
  },
  {
    typologie: Typologie.ES,
    matchers: [/[ée]picerie (?:bar|sociale|solidaire)/i]
  },
  {
    typologie: Typologie.ESAT,
    matchers: [/(?:^|\W)ESAT(?:\W|$)/i]
  },
  {
    typologie: Typologie.ESS,
    matchers: [/[ée]conomique Social et Solidaire/i]
  },
  {
    typologie: Typologie.ETTI,
    matchers: [/travail temporaire/i]
  },
  {
    typologie: Typologie.EVS,
    matchers: [/(?:^|\W)EVS(?:\W|$)/i, /(?:Espace|Centre) de Vie Sociale/i]
  },
  {
    typologie: Typologie.FABLAB,
    matchers: [/(?:^|\W)FAB\W?(?:LAB|AT)(?:\W|$)/i, /Atelier de fabrication numérique/i]
  },
  {
    typologie: Typologie.FT,
    matchers: [/france travail/i, /p[ôo]le emploi/i]
  },
  {
    typologie: Typologie.GEIQ,
    matchers: [/Groupement (?:local )?(?:d')?Employeurs/i, /Groupement pour l'Insertion/i]
  },
  {
    typologie: Typologie.HUDA,
    matchers: [/(?:^|\W)HUDA(?:\W|$)/i]
  },
  {
    typologie: Typologie.LA_POSTE,
    matchers: [/la\s?poste/i, /poste\s/i, /Agence (?:communale )?postale/i, /Bureau de poste/i]
  },
  {
    typologie: Typologie.MDE,
    matchers: [/Maison de l'emploi/i, /Maison de l'économie/i]
  },
  {
    typologie: Typologie.MDH,
    matchers: [/Maison des Habitant/i, /(?:^|\W)MJH(?:\W|$)/i, /(?:^|\W)MDH(?:\W|$)/i]
  },
  {
    typologie: Typologie.MDPH,
    matchers: [/(?:^|\W)MDPH(?:\W|$)/i, /Maison D[ée]p(?:artementale des)? Personnes Handicap[ée]es/i]
  },
  {
    typologie: Typologie.MJC,
    matchers: [
      /(?:^|\W)MJC(?:\W|$)/i,
      /(?:^|\W)M\.J\.C(?:\W|$)/i,
      /maison (?:des? )?jeunes,? (?:et |& )?(?:de )?(?:la )?culture/i
    ]
  },
  {
    typologie: Typologie.MQ,
    matchers: [/maison de quartier/i]
  },
  {
    typologie: Typologie.MSAP,
    matchers: [/(?:^|\W)MSAP(?:\W|$)/i, /(?:Maison|Relais) des? Services?/i]
  },
  {
    typologie: Typologie.MSA,
    matchers: [/(?:^|\W)MSA(?:\W|$)/i, /Mutualité Sociale Agricole/i]
  },
  {
    typologie: Typologie.MUNI,
    matchers: [
      /(?:^|\W)Municipalité(?:\W|$)/i,
      /(?:^|\W)mairie(?:\W|$)/i,
      /(?:^|\W)maire(?:\W|$)/i,
      /^commune(?:\W|$)/i,
      /^CA\s/i,
      /\sAgglo(?:m[ée]ration)?$/i,
      /Agglom[ée]ration d/i,
      /Communaut[ée] (?:d\W)?Agglom[ée]ration/i,
      /^ville d[eu']/i,
      /h[oô]tel de ville/i,
      /marie de\s/i
    ]
  },
  {
    typologie: Typologie.OIL,
    matchers: [/intermédiation locative/i]
  },
  {
    typologie: Typologie.PAD,
    matchers: [/Acc[èe]s aux? Droit/i, /Justice et du Droit/i, /Maison du droit/i]
  },
  {
    typologie: Typologie.PENSION,
    matchers: [/Pension de famille/i]
  },
  {
    typologie: Typologie.PI,
    matchers: [/Point d'information/i, /Point Info/i]
  },
  {
    typologie: Typologie.PIJ_BIJ,
    matchers: [
      /(?:^|\W)BIJ(?:\W|$)/i,
      /info(?:rmation)?s? jeune/i,
      /(?:^|\W)PIJ(?:\W|$)/i,
      /(?:^|\W)CRIJ(?:\W|$)/i,
      /point accueil jeunesse/i,
      /Espace jeune/i
    ]
  },
  {
    typologie: Typologie.PIMMS,
    matchers: [/(?:^|\W)PIMMS(?:\W|$)/i, /point information mediation multi services/i]
  },
  {
    typologie: Typologie.PJJ,
    matchers: [/JUDICIAIRE JEUNESSE/i]
  },
  {
    typologie: Typologie.PLIE,
    matchers: [/^PLIE(?:\W|$)/i]
  },
  {
    typologie: Typologie.PREF,
    matchers: [/Pr[ée]fecture/i]
  },
  {
    typologie: Typologie.REG,
    matchers: [/^R[ée]gion/i]
  },
  {
    typologie: Typologie.RESSOURCERIE,
    matchers: [/Ressourcerie/i]
  },
  {
    typologie: Typologie.RS_FJT,
    matchers: [/Résidence Sociale/i, /Foyer des? Jeunes Travailleurs/i]
  },
  {
    typologie: Typologie.SCP,
    matchers: [/Club prévention/i]
  },
  {
    typologie: Typologie.SPIP,
    matchers: [/(?:^|\W)SPIP(?:\W|$)/i, /Service Pénitentiaire D'Insertion et de Probation/i]
  },
  {
    typologie: Typologie.UDAF,
    matchers: [/(?:^|\W)UDAF(?:\W|\d|$)/i]
  },
  {
    typologie: Typologie.AFPA,
    matchers: [/(?:^|\W)AFPA(?:\W|$)/i]
  },
  {
    typologie: Typologie.CHRS,
    matchers: [/(?:^|\W)CHRS(?:\W|$)/i]
  },
  {
    typologie: Typologie.MDE,
    matchers: [/(?:^|\W)MDE(?:\W|$)/i, /maison[\w\s',]+de l[’'\s]emploi/i]
  },
  {
    typologie: Typologie.CCONS,
    matchers: [
      /chambre[\w\s']+agriculture/i,
      /chambre[\w\s']+m[ée]tiers[\w\s']+artisanat/i,
      /chambre[\w\s']+commerce[\w\s']+industrie/i,
      /(?:^|\W)CCI(?:\W|$)/i
    ]
  },
  {
    typologie: Typologie.CAP_EMPLOI,
    matchers: [/cap emploi/i]
  },
  {
    typologie: Typologie.UDAF,
    matchers: [/(?:^|\W)UDAF(?:\W|$)/i, /union des associations familiales/i]
  },
  {
    typologie: Typologie.RFS,
    matchers: [
      /(?:^|\W)EFS(?:\W|$)/i,
      /(?:^|\W)MFS(?:\W|$)/i,
      /frances?[\s-]services?/i,
      /Fixe Bruay-sur-l'Escaut\s{2}\( D[ée]partement du Nord\)/i,
      /Folschviller - Antenne de L'H[ôo]pital/i,
      /Communaut[eé] de communes Vaison Ventoux/i
    ]
  }
];
