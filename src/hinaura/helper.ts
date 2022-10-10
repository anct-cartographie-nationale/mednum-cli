export const objectKeyFormatter = (str: string): string =>
  objectKeyRemovePonctuation(str).replace('*', '').trim().replace(/ /gu, '_').toLocaleLowerCase();

const objectKeyRemovePonctuation = (str: string): string => str.normalize('NFD').replace(/[\u0300-\u036f]/gu, '');
