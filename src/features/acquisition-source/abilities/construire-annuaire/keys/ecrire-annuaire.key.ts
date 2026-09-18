import { type InjectionKey, keyFor } from '../../../../../libraries/injection';
import type { EtablissementALAdresse } from '../../../../../libraries/annuaire-entreprises';

export type EcrireAnnuaire = (fichier: string, etablissements: EtablissementALAdresse[]) => void;

export const ECRIRE_ANNUAIRE: InjectionKey<EcrireAnnuaire> = keyFor<EcrireAnnuaire>('acquisition-source.ecrire-annuaire');
