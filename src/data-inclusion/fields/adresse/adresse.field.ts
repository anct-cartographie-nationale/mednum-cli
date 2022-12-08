/* eslint-disable @typescript-eslint/naming-convention, camelcase, no-control-regex, prefer-named-capture-group,no-irregular-whitespace */

export const processVoie = (dataInclusionVoie: string): string =>
  dataInclusionVoie
    .replace(/\//gu, '-')
    .replace(/\s/u, ' ')
    .replace(/"/gu, '')
    .replace(/[\u00A0\u1680\u180e\u2000-\u2009\u200a​\u200b​\u202f\u205f​\u3000]/gu, ' ')
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
