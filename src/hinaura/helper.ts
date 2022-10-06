export const objectKeyFormatter = (str: string) =>
  objectKeyRemovePonctuation(str).replace('*', '').trim().replace(/ /g, '_').toLocaleLowerCase();

const objectKeyRemovePonctuation = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
