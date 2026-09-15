import type { Organization } from './organization';
import type { Ressource } from './ressource';

export type Dataset = {
  id: string;
  description: string;
  frequency: string;
  title: string;
  organization?: Organization;
  ressources: Ressource[];
};
