/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { SchemaServiceDataInclusion, SchemaStructureDataInclusion } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DataInclusionMerged, mergeServicesInStructure } from './merge-services-in-structure';

describe('merge services in structure', (): void => {
  it('should merge a single service in a single structure', (): void => {
    const structure: SchemaStructureDataInclusion = {
      adresse: '51 rue de la république',
      code_postal: '75013',
      commune: 'Paris',
      date_maj: '2022-11-07',
      id: 'structure-1',
      nom: 'Médiation république'
    };

    const service: SchemaServiceDataInclusion = {
      id: 'structure-1-mediation-numerique',
      nom: 'Médiation numérique',
      source: 'Hubik',
      structure_id: 'structure-1',
      thematiques: ['numerique-devenir-autonome-dans-les-demarches-administratives']
    };

    const merged: DataInclusionMerged = mergeServicesInStructure([service], structure);

    expect(merged).toStrictEqual({
      structure,
      services: [service]
    });
  });

  it('should not merge the service when the structure id do not match', (): void => {
    const structure: SchemaStructureDataInclusion = {
      adresse: '51 rue de la république',
      code_postal: '75013',
      commune: 'Paris',
      date_maj: '2022-11-07',
      id: 'structure-1',
      nom: 'Médiation république'
    };

    const service: SchemaServiceDataInclusion = {
      id: 'structure-1-mediation-numerique',
      nom: 'Médiation numérique',
      source: 'Hubik',
      structure_id: 'structure-2',
      thematiques: ['numerique-devenir-autonome-dans-les-demarches-administratives']
    };

    const merged: DataInclusionMerged = mergeServicesInStructure([service], structure);

    expect(merged).toStrictEqual({
      structure,
      services: []
    });
  });
});
