/* eslint-disable @typescript-eslint/naming-convention, max-lines */

import { Commune } from '../transformer/fields';

export type NewCommune = Commune & { date: string };

export const ANCIENNES_COMMUNES: Record<string, NewCommune> = {
  'Saint-Barbant': {
    nom: "Val-d'Oire-et-Gartempe",
    date: '2019-01-01',
    code: '87028',
    codeDepartement: '87',
    siren: '200083657',
    codeEpci: '200071942',
    codeRegion: '75',
    codesPostaux: ['87330']
  },
  Roussac: {
    nom: 'Saint-Pardoux-le-Lac',
    date: '2023-10-30',
    code: '87128',
    codeDepartement: '87',
    siren: '200085025',
    codeEpci: '248719262',
    codeRegion: '75',
    codesPostaux: ['87140']
  },
  'Plan-du-Var': {
    nom: 'Levens',
    date: '2023-10-30',
    code: '06075',
    codeDepartement: '06',
    siren: '2106007552',
    codeEpci: '200030195',
    codeRegion: '93',
    codesPostaux: ['06670']
  },
  'Saint-Julien-de-Crempse': {
    nom: 'Eryaud-Crempse-Maurens',
    date: '2023-10-30',
    code: '24259',
    codeDepartement: '24',
    siren: '200082683',
    codeEpci: '200069094',
    codeRegion: '75',
    codesPostaux: ['24140']
  },
  'Capavenir Vosges': {
    nom: 'Thaon-les-Vosges',
    date: '2023-10-30',
    code: '88465',
    codeDepartement: '88',
    siren: '200059939',
    codeEpci: '200068757',
    codeRegion: '44',
    codesPostaux: ['88150']
  },
  'Saint-Sver-Calvados': {
    nom: 'Noues de Sienne',
    date: '2023-10-30',
    code: '14658',
    codeDepartement: '14',
    siren: '200069896',
    codeEpci: '200068799',
    codeRegion: '28',
    codesPostaux: ['14380']
  },
  'Aunay-sur-Odon': {
    nom: 'Les Monts d’Aunay',
    date: '2023-10-30',
    code: '14027',
    codeDepartement: '14',
    siren: '200066454',
    codeEpci: '200069524',
    codeRegion: '28',
    codesPostaux: ['14260']
  },
  Fervaques: {
    nom: 'Livarot-Pays-d’Auge',
    date: '2023-10-30',
    code: '14371',
    codeDepartement: '14',
    siren: '200060515',
    codeEpci: '200069532',
    codeRegion: '28',
    codesPostaux: ['14140']
  },
  Malaville: {
    nom: 'Bellevigne',
    date: '2023-10-30',
    code: '16204',
    codeDepartement: '16',
    siren: '200062941',
    codeEpci: '200070514',
    codeRegion: '75',
    codesPostaux: ['16120']
  },
  'Saint-Martin-des-Besaces': {
    nom: ' Souleuvre en Bocage',
    date: '2023-10-30',
    code: '14061',
    codeDepartement: '14',
    siren: '200056869',
    codeEpci: '200068799',
    codeRegion: '28',
    codesPostaux: ['14350']
  },
  Tourny: {
    nom: 'Vexin-sur-Epte',
    date: '2023-10-30',
    code: '27213',
    codeDepartement: '27',
    siren: '200057685',
    codeEpci: '200072312',
    codeRegion: '28',
    codesPostaux: ['27510']
  },
  'Bâgé-la-Ville': {
    nom: 'Bâgé-Dommartin',
    date: '2023-10-30',
    code: '01025',
    codeDepartement: '01',
    siren: '200077220',
    codeEpci: '200071371',
    codeRegion: '84',
    codesPostaux: ['01380']
  },
  'Aix-en-Othe': {
    nom: 'Aix-Villemaur-Pâlis',
    date: '2023-10-30',
    code: '10003',
    codeDepartement: '10',
    siren: '200058840',
    codeEpci: '241000447',
    codeRegion: '44',
    codesPostaux: ['10160']
  },
  Hellemmes: {
    nom: 'Lille',
    date: '2023-10-30',
    code: '59350',
    codeDepartement: '59',
    siren: '215903501',
    codeEpci: '200093201',
    codeRegion: '32',
    codesPostaux: ['59260']
  },
  'Breuil-Barret': {
    nom: 'Terval',
    date: '2023-10-30',
    code: '85289',
    codeDepartement: '85',
    siren: '200099489',
    codeEpci: '248500415',
    codeRegion: '52',
    codesPostaux: ['85120']
  },
  'La-Chappelle-aux-Lys': {
    nom: 'Terval',
    date: '2023-10-30',
    code: '85289',
    codeDepartement: '85',
    siren: '200099489',
    codeEpci: '248500415',
    codeRegion: '52',
    codesPostaux: ['85120']
  },
  'La Tardière': {
    nom: 'Terval',
    date: '2023-10-30',
    code: '85289',
    codeDepartement: '85',
    siren: '200099489',
    codeEpci: '248500415',
    codeRegion: '52',
    codesPostaux: ['85120']
  },
  "La-Chapelle-D'Andaine": {
    nom: ' Rives d’Andaine',
    date: '2023-10-30',
    code: '61096',
    codeDepartement: '61',
    siren: '200058667',
    codeEpci: '200068443',
    codeRegion: '28',
    codesPostaux: ['61140']
  },
  'Le-Plessis-Grimoult': {
    nom: "Les Monts d'Aunay",
    date: '2023-10-30',
    code: '14027',
    codeDepartement: '14',
    siren: '200066454',
    codeEpci: '200069524',
    codeRegion: '28',
    codesPostaux: ['14770']
  },
  Lomme: {
    nom: 'Lille',
    date: '2023-10-30',
    code: '59350',
    codeDepartement: '59',
    siren: '215903501',
    codeEpci: '200093201',
    codeRegion: '32',
    codesPostaux: ['59260']
  },
  Anctoville: {
    nom: 'Aurseulles',
    date: '2023-10-30',
    code: '14011',
    codeDepartement: '14',
    siren: '200064921',
    codeEpci: '200069524',
    codeRegion: '28',
    codesPostaux: ['14240']
  },
  Couterne: {
    nom: "Rives d'Andaine",
    date: '2023-10-30',
    code: '61096',
    codeDepartement: '61',
    siren: '200058667',
    codeEpci: '200068443',
    codeRegion: '28',
    codesPostaux: ['61140']
  },
  'Condé-sur-Noireau': {
    nom: ' Condé-en-Normandie',
    date: '2023-10-30',
    code: '14174',
    codeDepartement: '14',
    siren: '200056877',
    codeEpci: '200068799',
    codeRegion: '28',
    codesPostaux: ['14110']
  },
  Albens: {
    nom: 'Entrelacs',
    date: '2023-10-30',
    code: '73010',
    codeDepartement: '73',
    siren: '200053833',
    codeEpci: '200068674',
    codeRegion: '84',
    codesPostaux: ['73410']
  },
  'Saint-Antonin-de-Lacalm': {
    nom: 'Terre-de-Bancalié',
    date: '2023-10-30',
    code: '81233',
    codeDepartement: '81',
    siren: '200085322',
    codeEpci: '200034049',
    codeRegion: '76',
    codesPostaux: ['81120']
  },
  'Saint-Géréon': {
    nom: 'Ancenis-Saint-Géréon',
    date: '2023-10-30',
    code: '44003',
    codeDepartement: '44',
    siren: '200083228',
    codeEpci: '244400552',
    codeRegion: '52',
    codesPostaux: ['44150']
  },
  Corne: {
    nom: 'Loire-Authion',
    date: '2023-10-30',
    code: '49307',
    codeDepartement: '49',
    siren: '200057438',
    codeEpci: '244900015',
    codeRegion: '52',
    codesPostaux: ['49630']
  },
  'Argenton-les-Vallées': {
    nom: 'Argentonnay',
    date: '2023-10-30',
    code: '79013',
    codeDepartement: '79',
    siren: '200055994',
    codeEpci: '200040244',
    codeRegion: '75',
    codesPostaux: ['79150']
  },
  'Ruillé-sur-Loir': {
    nom: ' Loir en Vallée',
    date: '2023-10-30',
    code: '72262',
    codeDepartement: '72',
    siren: '200072262',
    codeEpci: '200070373',
    codeRegion: '52',
    codesPostaux: ['72340']
  },
  'Saint-Brice-en-Coglès': {
    nom: 'Maen Roch',
    date: '2023-10-30',
    code: '35257',
    codeDepartement: '35',
    siren: '200064517',
    codeEpci: '200070688',
    codeRegion: '53',
    codesPostaux: ['35460']
  },
  Boufféré: {
    nom: 'Montaigu-Vendée',
    date: '2023-10-30',
    code: '85146',
    codeDepartement: '85',
    siren: '200081115',
    codeEpci: '200070233',
    codeRegion: '75',
    codesPostaux: ['16250']
  },
  'Blanzac-Porcheresse': {
    nom: 'Coteaux-du-Blanzacais',
    date: '2023-10-30',
    code: '16046',
    codeDepartement: '16',
    siren: '200083129',
    codeEpci: '200029734',
    codeRegion: '52',
    codesPostaux: ['44150']
  },
  Fosseuse: {
    nom: 'Bornel',
    date: '2023-10-30',
    code: '60088',
    codeDepartement: '60',
    siren: '200053734',
    codeEpci: '246000582',
    codeRegion: '32',
    codesPostaux: ['60540']
  },
  'La Flocellière': {
    nom: 'Sèvremont',
    date: '2023-10-30',
    code: '85090',
    codeDepartement: '85',
    siren: '200059079',
    codeEpci: '248500464',
    codeRegion: '52',
    codesPostaux: ['85700']
  },
  'La Mailleraye-sur-Seine': {
    nom: 'Arelaune-en-Seine',
    date: '2023-10-30',
    code: '76401',
    codeDepartement: '76',
    siren: '200059061',
    codeEpci: '200010700',
    codeRegion: '28',
    codesPostaux: ['76940']
  },
  'Castillon-de-Castets': {
    nom: 'Castets et Castillon',
    date: '2023-10-30',
    code: '33106',
    codeDepartement: '33',
    siren: '200064301',
    codeEpci: '200043974',
    codeRegion: '75',
    codesPostaux: ['33210']
  },
  'Saint-Pierre-Montlimart': {
    nom: 'Montrevault-sur-Èvre',
    date: '2023-10-30',
    code: '49218',
    codeDepartement: '49',
    siren: '200054302',
    codeEpci: '200060010',
    codeRegion: '52',
    codesPostaux: ['49110']
  },
  Nods: {
    nom: 'Les Premiers Sapins',
    date: '2023-10-30',
    code: '25424',
    codeDepartement: '25',
    siren: '200057156',
    codeEpci: '242504181',
    codeRegion: '27',
    codesPostaux: ['25580']
  },
  'La-Rochette': {
    nom: 'Valgelon-La Rochette',
    date: '2023-10-30',
    code: '73215',
    codeDepartement: '73',
    siren: '200086882',
    codeEpci: '200041010',
    codeRegion: '84',
    codesPostaux: ['73110']
  },
  Entremont: {
    nom: 'Ancenis-Saint-Géréon',
    date: '2023-10-30',
    code: '74212',
    codeDepartement: '74',
    siren: '200081446',
    codeEpci: '200000172',
    codeRegion: '84',
    codesPostaux: ['74130']
  },
  Seynod: {
    nom: 'Ancenis-Saint-Géréon',
    date: '2023-10-30',
    code: '74010',
    codeDepartement: '74',
    siren: '200063402',
    codeEpci: '200066793',
    codeRegion: '84',
    codesPostaux: ['74600']
  },
  Montmin: {
    nom: 'Talloires-Montmin',
    date: '2023-10-30',
    code: '74275',
    codeDepartement: '74',
    siren: '200056141',
    codeEpci: '200066793',
    codeRegion: '84',
    codesPostaux: ['74210']
  }
};
