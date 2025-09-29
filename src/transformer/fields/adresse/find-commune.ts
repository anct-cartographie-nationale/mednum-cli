export type Commune = {
  nom: string;
  code: string;
  codeDepartement: string;
  siren: string;
  codeEpci: string;
  codeRegion: string;
  codesPostaux: string[];
};

export type FindCommune = {
  parNom: (name: string) => Commune | undefined;
  parCodePostal: (codePostal: string) => Commune | undefined;
  parNomEtCodePostal: (nom: string, codePostal: string) => Commune | undefined;
  parNomEtCodePostalLePlusProcheDuDepartement: (nom: string, codePostal: string) => Commune | undefined;
};

export const slugify = (text: string): string =>
  text
    .normalize('NFKD')
    .trim()
    .toLowerCase()
    .replace(/œ/gu, 'oe')
    .replace(/[^a-z0-9 '-]/gu, '')
    .replace(/'+/gu, '-')
    .replace(/\s+/gu, '-')
    .replace(/-+/gu, '-');

const toCommunesCountMap = (communeCountMap: Map<string, number>, commune: Commune): Map<string, number> =>
  communeCountMap.set(slugify(commune.nom), (communeCountMap.get(slugify(commune.nom)) ?? 0) + 1);

const toCommuneByNameMap =
  (communesCountMap: Map<string, number>) =>
  (communeByNameMap: Map<string, Commune>, commune: Commune): Map<string, Commune> =>
    communesCountMap.get(slugify(commune.nom)) === 1 ? communeByNameMap.set(slugify(commune.nom), commune) : communeByNameMap;

const toEveryCodePostalCountFromCommuneMap = (
  codesPostauxForCommuneCountMap: Map<string, number>,
  codePostal: string
): Map<string, number> =>
  codesPostauxForCommuneCountMap.set(codePostal, (codesPostauxForCommuneCountMap.get(codePostal) ?? 0) + 1);

const toCodePostalCountMap = (codesPostauxCountMap: Map<string, number>, commune: Commune): Map<string, number> =>
  commune.codesPostaux.reduce(toEveryCodePostalCountFromCommuneMap, codesPostauxCountMap);

const toEveryCodePostalFromCommuneMap =
  (codesPostauxCountMap: Map<string, number>, commune: Commune) =>
  (everyCodePostalFromCommuneMap: Map<string, Commune>, codePostal: string): Map<string, Commune> =>
    codesPostauxCountMap.get(codePostal) === 1
      ? everyCodePostalFromCommuneMap.set(codePostal, commune)
      : everyCodePostalFromCommuneMap;

const toCommunesByCodePostalMap =
  (codesPostauxCountMap: Map<string, number>) =>
  (communesByCodePostalMap: Map<string, Commune>, commune: Commune): Map<string, Commune> =>
    commune.codesPostaux.reduce(toEveryCodePostalFromCommuneMap(codesPostauxCountMap, commune), communesByCodePostalMap);

const communesParNomMap = (communes: Commune[]): Map<string, Commune> =>
  communes.reduce(
    toCommuneByNameMap(communes.reduce(toCommunesCountMap, new Map<string, number>())),
    new Map<string, Commune>()
  );

const communesParCodePostalMap = (communes: Commune[]): Map<string, Commune> =>
  communes.reduce(
    toCommunesByCodePostalMap(communes.reduce(toCodePostalCountMap, new Map<string, number>())),
    new Map<string, Commune>()
  );

const communeParCodePostal =
  (communesByCodePostalMap: Map<string, Commune>) =>
  (codePostal: string): Commune | undefined =>
    communesByCodePostalMap.get(codePostal);

const communeParNom =
  (communesByNameMap: Map<string, Commune>) =>
  (nom: string): Commune | undefined =>
    communesByNameMap.get(slugify(nom));

const codePostalEtNomExactes =
  (codePostal: string, nom: string) =>
  (commune: Commune): boolean =>
    commune.codesPostaux.includes(codePostal) && slugify(commune.nom) === slugify(nom);

const communeUniqueOuRien = (communesFound: Commune[]): Commune | undefined =>
  communesFound.length === 1 ? communesFound[0] : undefined;

const codePostalExactEtNomAvecMemeDebut =
  (codePostal: string, nom: string) =>
  (commune: Commune): boolean =>
    commune.codesPostaux.includes(codePostal) &&
    (slugify(commune.nom).startsWith(slugify(nom)) || slugify(nom).startsWith(slugify(commune.nom)));

const communeParNomEtCodePostal =
  (communes: Commune[]) =>
  (nom: string, codePostal: string): Commune | undefined =>
    communes.find(codePostalEtNomExactes(codePostal, nom)) ??
    communeUniqueOuRien(communes.filter(codePostalExactEtNomAvecMemeDebut(codePostal, nom)));

const onlySameNameInCodePostalDepartement =
  (nom: string, codePostal: string) =>
  (commune: Commune): boolean =>
    commune.nom === nom && codePostal.startsWith(commune.codeDepartement);

const parNomEtCodePostalLePlusProcheDuDepartement =
  (communes: Commune[]) =>
  (nom: string, codePostal: string): Commune | undefined => {
    const communesFound: Commune[] = communes.filter(onlySameNameInCodePostalDepartement(nom, codePostal));
    return communesFound.length === 1 ? communesFound[0] : undefined;
  };

export const findCommune = (communes: Commune[]): FindCommune => ({
  parNom: communeParNom(communesParNomMap(communes)),
  parCodePostal: communeParCodePostal(communesParCodePostalMap(communes)),
  parNomEtCodePostal: communeParNomEtCodePostal(communes),
  parNomEtCodePostalLePlusProcheDuDepartement: parNomEtCodePostalLePlusProcheDuDepartement(communes)
});
