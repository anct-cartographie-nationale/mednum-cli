import { Organization } from './organization';
import { PublishRessource } from './publish-ressource';

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
