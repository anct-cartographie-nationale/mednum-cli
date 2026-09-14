import type { Organization } from './organization.js';
import type { Ressource } from './ressource.js';

export type Dataset = {
  id: string;
  description: string;
  frequency: string;
  title: string;
  organization?: Organization;
  ressources: Ressource[];
};
