import type { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { paginate } from '../../../libraries/http';

/**
 * Les API de lieux exposent la pagination JSON:API. On demande d'emblée la plus grande page
 * possible, `paginate` suivant ensuite `links.next` tant qu'il en reste.
 */
const FIRST_PAGE_QUERY = 'page[number]=0&page[size]=10000';

export const loadLieuxFromPaginatedApi = async (source: string): Promise<SchemaLieuMediationNumerique[]> => {
  const [url, query]: (string | undefined)[] = source.split('?');

  // Affirmation : cette API sert des lieux au schéma mednum. Rien ne le vérifie ici.
  return (await paginate(`${url ?? source}?${FIRST_PAGE_QUERY}`, query)) as SchemaLieuMediationNumerique[];
};
