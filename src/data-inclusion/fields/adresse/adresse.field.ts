/* eslint-disable @typescript-eslint/naming-convention, camelcase, no-control-regex, prefer-named-capture-group,no-irregular-whitespace */

export const processCommune = (dataInclusionCommune: string): string =>
  dataInclusionCommune
    .replace(/\([^)]+\)/gu, '')
    .replace(/,/gu, '')
    .replace('/', ' sur ')
    .replace(/[ÀÁÂÃÄÅ]/gu, 'A')
    .replace(/[^\x00-\x7F]/gu, '')
    .replace(/&.+/gu, '')
    .replace(/\./gu, '')
    .trim();

export const processVoie = (dataInclusionCommune: string): string =>
  dataInclusionCommune
    .replace(/,/gu, '')
    .replace(/\//gu, '-')
    .replace('°', '')
    .replace(/\./gu, '')
    .replace(/\|.+/gu, '')
    .replace(/(\r\n|\n|\r)/gmu, ' ')
    .replace(/:/gu, '')
    .replace(/\([^)]+\)/gu, '')
    .replace(/"/gu, '')
    .replace(/–/gu, '-')
    .replace('¨', '')
    .replace(/[\u0300-\u036f]/gu, '')
    .replace('?', 'C')
    .replace('{', '')
    .replace(/&.+/gu, '')
    .replace(/;.+/gu, '')
    .replace(/\+/gu, '')
    .replace(/[\u00A0\u1680\u180e\u2000-\u2009\u200a​\u200b​\u202f\u205f​\u3000]/gu, ' ')
    .replace(/\s/u, ' ')
    .replace(/\s\s+/gu, ' ')
    .trim();
