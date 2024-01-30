import { ExtractOptions } from '../../extract-options';

export const buildApiUrl = ({
  cartographieNationaleApiUrl,
  departements,
  duplicates
}: Pick<ExtractOptions, 'cartographieNationaleApiUrl' | 'departements' | 'duplicates'>): string => {
  const baseUrl: string = duplicates
    ? `${cartographieNationaleApiUrl}/lieux-inclusion-numerique/with-duplicates?and[mergedIds][exists]=false`
    : `${cartographieNationaleApiUrl}/lieux-inclusion-numerique`;

  return departements == null ? baseUrl : `${baseUrl}&adresse[beginsWith][code_insee]=${departements}`;
};
