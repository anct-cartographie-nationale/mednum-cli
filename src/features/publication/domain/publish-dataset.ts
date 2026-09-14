import type { Organization } from './organization.js';
import type { PublishRessource } from './publish-ressource.js';

export type PublishDataset = {
  description: string;
  frequency: string;
  title: string;
  organization?: Organization;
  tags: string[];
  license: string;
  zone: string;
  granularity: string;
  start: string;
  end: string;
  ressources: PublishRessource[];
};
