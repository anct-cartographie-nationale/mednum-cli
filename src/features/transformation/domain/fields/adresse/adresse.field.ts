import {
  Adresse,
  type AdresseToValidate,
  appliquerRegles,
  nettoyerCodePostal,
  nettoyerCommune,
  nettoyerVoie
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { DataSource, LieuxMediationNumeriqueMatching } from '../../matching';
import { getNewCommune } from './anciennes-communes';
import { codePostalField } from './clean-code-postal';
import { REGLES_COMMUNE_LOCALES, communeField } from './clean-commune';
import { REGLES_VOIE_LOCALES, voieField } from './clean-voie';
import type { Commune, FindCommune } from '../../../../../libraries/collectivites';

type AddressToNormalize = {
  code_postal: string;
  commune: string;
};

type SourceAddress = {
  voie: string;
  commune: string | undefined;
  code_postal: string | undefined;
  complement_adresse?: string;
};

const nouvelleCaledonieException = (codePostal: string): boolean => codePostal.startsWith('98');

const complementAdresseIfAny = (complementAdresse?: string): { complement_adresse?: string } =>
  complementAdresse == null ? {} : { complement_adresse: complementAdresse.replace(/\s+/g, ' ').trim() };

const codeInseeIfAny = (code_insee?: string): { code_insee?: string } => (code_insee == null ? {} : { code_insee });

const normalizedCodePostalIfExist = (codePostal: string, normalizedCodePostaux: string[] = []): string | undefined =>
  normalizedCodePostaux.includes(codePostal) || nouvelleCaledonieException(codePostal) ? codePostal : normalizedCodePostaux[0];

const addressFields = (
  addressToNormalize: AddressToNormalize,
  commune: Commune | undefined,
  sourceAddress: SourceAddress
): AdresseToValidate => ({
  ...sourceAddress,
  code_postal:
    normalizedCodePostalIfExist(addressToNormalize.code_postal, commune?.codesPostaux) ?? addressToNormalize.code_postal,
  commune: commune?.nom ?? addressToNormalize.commune,
  ...codeInseeIfAny(commune?.code),
  voie: appliquerRegles(REGLES_VOIE_LOCALES, nettoyerVoie(sourceAddress.voie))
});

const communeFrom = (findCommune: FindCommune, addressToNormalize: AddressToNormalize): Commune | undefined =>
  findCommune.parNom(addressToNormalize.commune) ??
  findCommune.parCodePostal(addressToNormalize.code_postal) ??
  findCommune.parNomEtCodePostal(addressToNormalize.commune, addressToNormalize.code_postal) ??
  findCommune.parNomEtCodePostalLePlusProcheDuDepartement(addressToNormalize.commune, addressToNormalize.code_postal) ??
  getNewCommune(addressToNormalize.commune);

const buildAddressFields =
  (findCommune: FindCommune) =>
  (addressToNormalize: AddressToNormalize, sourceAddress: SourceAddress): AdresseToValidate =>
    addressFields(addressToNormalize, communeFrom(findCommune, addressToNormalize), sourceAddress);

const normalizeAddressFields =
  (findCommune: FindCommune) =>
  (sourceAddress: SourceAddress): AdresseToValidate =>
    buildAddressFields(findCommune)(
      {
        commune: appliquerRegles(
          REGLES_COMMUNE_LOCALES,
          nettoyerCommune(communeField(sourceAddress.voie, sourceAddress.commune))
        ),
        code_postal: nettoyerCodePostal(codePostalField(sourceAddress.voie, sourceAddress.code_postal))
      },
      sourceAddress
    );

const sourceAddressFrom = (source: DataSource, matching: LieuxMediationNumeriqueMatching): SourceAddress => ({
  voie: voieField(source, matching.adresse),
  commune: [matching.commune.colonne]
    .flat()
    .map((c: string) => source[c]?.toString())
    .find(Boolean),
  code_postal: [matching.code_postal.colonne]
    .flat()
    .map((c: string) => source[c]?.toString())
    .find(Boolean),
  ...complementAdresseIfAny(source[matching.complement_adresse?.colonne ?? '']?.toString())
});

/**
 * L'adresse normalisée, sans la validation que lui impose `Adresse`. C'est elle qu'interroge le
 * géocodage : la bâtir sur les colonnes brutes revenait à demander à la Base Adresse Nationale
 * une adresse que le dépôt sait compléter — commune retrouvée par son code postal, code postal
 * retrouvé par sa commune — et donc à refuser des lieux que ces règles rendent trouvables.
 *
 * Elle ne lève jamais : une adresse invalide est une adresse qu'on ne géocodera pas, pas une
 * exécution à interrompre.
 */
export const normalizedAddress =
  (findCommune: FindCommune) =>
  (source: DataSource, matching: LieuxMediationNumeriqueMatching): AdresseToValidate =>
    normalizeAddressFields(findCommune)(sourceAddressFrom(source, matching));

export const processAdresse =
  (findCommune: FindCommune) =>
  (source: DataSource, matching: LieuxMediationNumeriqueMatching): Adresse =>
    Adresse(normalizedAddress(findCommune)(source, matching));
