import { Adresse } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DataSource, LieuxMediationNumeriqueMatching } from '../../input';
import { getNewCommune } from './anciennes-communes';
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

const nouvelleCaledonieException = (codePostal: string): boolean => codePostal.startsWith('98');

export const complementAdresseIfAny = (complementAdresse?: string): { complement_adresse?: string } =>
  complementAdresse == null ? {} : { complement_adresse: complementAdresse.replace(/\s+/g, ' ').trim() };

const codeInseeIfAny = (code_insee?: string): { code_insee?: string } => (code_insee == null ? {} : { code_insee });

const normalizedCodePostalIfExist = (codePostal: string, normalizedCodePostaux: string[] = []): string | undefined =>
  normalizedCodePostaux.includes(codePostal) || nouvelleCaledonieException(codePostal) ? codePostal : normalizedCodePostaux[0];

const addressFields = (
  addressToNormalize: AddressToNormalize,
  commune: Commune | undefined,
  sourceAddress: SourceAddress
): Omit<Adresse, 'isAdresse'> => ({
  ...sourceAddress,
  code_postal:
    normalizedCodePostalIfExist(addressToNormalize.code_postal, commune?.codesPostaux) ?? addressToNormalize.code_postal,
  commune: commune?.nom ?? addressToNormalize.commune,
  ...codeInseeIfAny(commune?.code),
  voie: CLEAN_VOIE.reduce(toCleanField, sourceAddress.voie)
});

const communeFrom = (findCommune: FindCommune, addressToNormalize: AddressToNormalize): Commune | undefined =>
  findCommune.parNom(addressToNormalize.commune) ??
  findCommune.parCodePostal(addressToNormalize.code_postal) ??
  findCommune.parNomEtCodePostal(addressToNormalize.commune, addressToNormalize.code_postal) ??
  findCommune.parNomEtCodePostalLePlusProcheDuDepartement(addressToNormalize.commune, addressToNormalize.code_postal) ??
  getNewCommune(addressToNormalize.commune);

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
      commune: source[matching.commune.colonne]?.toString(),
      code_postal: source[matching.code_postal.colonne]?.toString(),
      ...complementAdresseIfAny(source[matching.complement_adresse?.colonne ?? '']?.toString())
    });
