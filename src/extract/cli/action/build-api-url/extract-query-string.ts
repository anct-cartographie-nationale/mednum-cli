import { ExtractOptions } from '../../extract-options';

export const extractQueryString = ({
  departements,
  duplicates
}: Pick<ExtractOptions, 'departements' | 'duplicates'>): string => {
  const mergedIds: string = duplicates ? 'and[mergedIds][exists]=false' : '';
  return departements == null ? mergedIds : `${mergedIds}&adresse[beginsWith][code_insee]=${departements}`;
};
