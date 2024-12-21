export const processVoie = (dataInclusionVoie: string): string =>
  dataInclusionVoie
    .replace(/\//gu, '-')
    .replace(/\s/u, ' ')
    .replace(/"/gu, '')
    .replace('{', '')
    .replace(/(\r\n|\n|\r)/gmu, ' ')
    .replace('¨', '')
    .replace('?', 'C')
    .replace(/\+/gu, '')
    .replace(/\s+/gu, ' ')
    .trim();

export const processCommune = (dataInclusionCommune: string): string =>
  dataInclusionCommune
    .replace('Ã', 'A')
    .replace('/', ' sur ')
    .replace(/\(.*\)/gu, '')
    .trim();
