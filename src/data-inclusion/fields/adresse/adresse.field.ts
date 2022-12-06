/* eslint-disable @typescript-eslint/naming-convention, camelcase, no-control-regex, prefer-named-capture-group,no-irregular-whitespace */

export const processVoie = (dataInclusionCommune: string): string =>
  dataInclusionCommune
    .replace(/\//gu, '-')
    .replace(/\s/u, ' ')
    .replace(/"/gu, '')
    .replace(/[\u00A0\u1680\u180e\u2000-\u2009\u200a​\u200b​\u202f\u205f​\u3000]/gu, ' ')
    .replace('{', '')
    .replace(/(\r\n|\n|\r)/gmu, ' ')
    .replace('¨', '')
    .replace('?', 'C')
    .trim();
