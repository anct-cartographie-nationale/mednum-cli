/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Adresse } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DataSource, LieuxMediationNumeriqueMatching } from '../../input';
import { CLEAN_CODE_POSTAL, codePostalField } from './clean-code-postal';
import { CLEAN_COMMUNE, communeField } from './clean-commune';
import { toCleanField } from './clean-operations';
import { CLEAN_VOIE, voieField } from './clean-voie';
import { Commune, FindCommune } from './find-commune';

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

export const complementAdresseIfAny = (complementAdresse?: string): { complement_adresse?: string } =>
  complementAdresse == null ? {} : { complement_adresse: complementAdresse.replace(/\s+/gu, ' ').trim() };

const codeInseeIfAny = (code_insee?: string): { code_insee?: string } => (code_insee == null ? {} : { code_insee });

const excludeArrondissementCities = (normalizedCodePostal: string): boolean =>
  ['75', '69', '13'].some((prefix: string): boolean => normalizedCodePostal.startsWith(prefix));

const checkIfCodesPostauxAreSame = (normalizedCodePostal: string, communeCodepostal: string | undefined): string | undefined =>
  communeCodepostal === normalizedCodePostal ? normalizedCodePostal : communeCodepostal;

const compareCodesPostaux = (normalizedCodePostal: string, communeCodepostal: string | undefined): string | undefined =>
  communeCodepostal == null ? checkIfCodesPostauxAreSame(normalizedCodePostal, communeCodepostal) : normalizedCodePostal;

const checkIfCodePostalNotContainCedex = (
  normalizedCodePostal: string,
  communeCodepostal: string | undefined
): string | undefined =>
  excludeArrondissementCities(normalizedCodePostal)
    ? normalizedCodePostal
    : compareCodesPostaux(normalizedCodePostal, communeCodepostal);

const addressFields = (
  addressToNormalize: AddressToNormalize,
  commune: Commune | undefined,
  sourceAddress: SourceAddress
): Omit<Adresse, 'isAdresse'> => ({
  ...sourceAddress,
  code_postal:
    (addressToNormalize.code_postal === ''
      ? commune?.codesPostaux[0]
      : checkIfCodePostalNotContainCedex(addressToNormalize.code_postal, commune?.codesPostaux[0])) ?? '',
  commune: commune?.nom ?? addressToNormalize.commune,
  ...codeInseeIfAny(commune?.code),
  voie: CLEAN_VOIE.reduce(toCleanField, sourceAddress.voie)
});

const communeFrom = (findCommune: FindCommune, addressToNormalize: AddressToNormalize): Commune | undefined =>
  findCommune.parCodePostal(addressToNormalize.code_postal) ??
  findCommune.parNom(addressToNormalize.commune) ??
  findCommune.parNomEtCodePostal(addressToNormalize.commune, addressToNormalize.code_postal);

const buildAddress =
  (findCommune: FindCommune) =>
  (addressToNormalize: AddressToNormalize, sourceAddress: SourceAddress): Adresse =>
    Adresse(addressFields(addressToNormalize, communeFrom(findCommune, addressToNormalize), sourceAddress));

const normalizeAddress =
  (findCommune: FindCommune) =>
  (sourceAddress: SourceAddress): Adresse =>
    buildAddress(findCommune)(
      {
        commune: CLEAN_COMMUNE.reduce(toCleanField, communeField(sourceAddress.voie, sourceAddress.commune)),
        code_postal: CLEAN_CODE_POSTAL.reduce(toCleanField, codePostalField(sourceAddress.voie, sourceAddress.code_postal))
      },
      sourceAddress
    );

export const processAdresse =
  (findCommune: FindCommune) =>
  (source: DataSource, matching: LieuxMediationNumeriqueMatching): Adresse =>
    normalizeAddress(findCommune)({
      voie: voieField(source, matching.adresse),
      commune: source[matching.commune.colonne],
      code_postal: source[matching.code_postal.colonne],
      ...complementAdresseIfAny(source[matching.complement_adresse?.colonne ?? ''])
    });
