import * as fs from 'node:fs';
import type { EtablissementALAdresse } from '../../../../../libraries/annuaire-entreprises';
import type { EcrireAnnuaire } from '../keys';

export const ecrireAnnuaireDansUnFichier: EcrireAnnuaire = (
  fichier: string,
  etablissements: EtablissementALAdresse[]
): void => {
  fs.writeFileSync(fichier, JSON.stringify(etablissements), 'utf8');
};
