const communes: Commune[] = require('../../../../assets/data/communes.json');

type Commune = { Nom_commune: string; Code_postal: number };

const toCommuneName = (commune: Commune): string => commune.Nom_commune.toLowerCase();

const formatToCommuneNameData = (commune: string): string =>
  commune.toLowerCase().replace('saint', 'st').replace(/['-]/gu, ' ');

const formatCodePostal = (codePostal: string): string => (codePostal.length === 4 ? `0${codePostal}` : codePostal);

const ofMatchingCommuneName =
  (matchingCommuneName: string) =>
  (communeName: string): boolean =>
    communeName === formatToCommuneNameData(matchingCommuneName);

const findCodePostal = (matchingCommuneName: string): string =>
  communes[communes.map(toCommuneName).findIndex(ofMatchingCommuneName(matchingCommuneName))]?.Code_postal.toString() ?? '';

const codePostalFromCommune = (commune: string): string => formatCodePostal(findCodePostal(commune));

export const processCodePostal = (code_postal: string, commune: string): string =>
  code_postal === '' ? codePostalFromCommune(commune) : code_postal;

export const throwMissingFixRequiredDataError = (): string => {
  throw new Error('Missing fix required data');
};
