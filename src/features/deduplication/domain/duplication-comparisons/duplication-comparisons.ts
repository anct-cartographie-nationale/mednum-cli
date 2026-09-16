import {
  type Comparaison,
  type ComparaisonMesuree,
  comparer,
  type LieuPrepare,
  type LocalisationToValidate,
  preparer,
  type SchemaLieuMediationNumerique,
  type Typologie,
  Typologies
} from '@gouvfr-anct/lieux-de-mediation-numerique';

export type DuplicationComparison = {
  id1: string;
  id2: string;
  typologie1?: string;
  typologie2?: string;
  score: number;
  adresseScore?: number;
  adresse1: string;
  adresse2: string;
  nomScore: number;
  nom1: string;
  nom2: string;
  distanceEnMetres?: number;
  localisation1: string;
  localisation2: string;
  source1: string | undefined;
  source2: string | undefined;
};

type LieuComparable = {
  lieu: SchemaLieuMediationNumerique;
  prepare: LieuPrepare;
};

const localisationDe = ({ latitude, longitude }: SchemaLieuMediationNumerique): LocalisationToValidate | null =>
  latitude == null || longitude == null ? null : { latitude, longitude };

const typologiesDe = ({ typologie }: SchemaLieuMediationNumerique): Typologie[] | null =>
  typologie == null ? null : Typologies(typologie.split('|') as Typologies);

const toLieuComparable = (lieu: SchemaLieuMediationNumerique): LieuComparable => ({
  lieu,
  prepare: preparer({
    nom: lieu.nom,
    adresse: lieu.adresse,
    codeInsee: lieu.code_insee ?? null,
    localisation: localisationDe(lieu),
    typologies: typologiesDe(lieu),
    source: lieu.source ?? null
  })
});

const adresseComplete = ({ adresse, code_postal, commune }: SchemaLieuMediationNumerique): string =>
  `${adresse} ${code_postal} ${commune}`;

const localisationLisible = ({ latitude, longitude }: SchemaLieuMediationNumerique): string => `${latitude} : ${longitude}`;

const toDuplicationComparison = (
  un: SchemaLieuMediationNumerique,
  autre: SchemaLieuMediationNumerique,
  { score, nom, adresse, distance }: ComparaisonMesuree
): DuplicationComparison => ({
  id1: un.id,
  id2: autre.id,
  score,
  nomScore: nom,
  nom1: un.nom,
  nom2: autre.nom,
  ...(adresse == null ? {} : { adresseScore: adresse }),
  adresse1: adresseComplete(un),
  adresse2: adresseComplete(autre),
  ...(distance == null ? {} : { distanceEnMetres: Math.round(distance) }),
  localisation1: localisationLisible(un),
  localisation2: localisationLisible(autre),
  source1: un.source,
  source2: autre.source,
  ...(un.typologie == null ? {} : { typologie1: un.typologie }),
  ...(autre.typologie == null ? {} : { typologie2: autre.typologie })
});

const mesuree = (comparaison: Comparaison): comparaison is ComparaisonMesuree => comparaison.vetos.length === 0;

const comparaisonsPourLieu =
  (candidats: LieuComparable[], allowInternalMerge: boolean) =>
  ({ lieu, prepare }: LieuComparable): DuplicationComparison[] =>
    candidats
      .filter((candidat: LieuComparable): boolean => candidat.lieu.id !== lieu.id)
      .map((candidat: LieuComparable): [SchemaLieuMediationNumerique, Comparaison] => [
        candidat.lieu,
        comparer(prepare, candidat.prepare, { allowInternalMerge })
      ])
      .filter(
        (couple: [SchemaLieuMediationNumerique, Comparaison]): couple is [SchemaLieuMediationNumerique, ComparaisonMesuree] =>
          mesuree(couple[1])
      )
      .map(
        ([candidat, comparaison]: [SchemaLieuMediationNumerique, ComparaisonMesuree]): DuplicationComparison =>
          toDuplicationComparison(lieu, candidat, comparaison)
      );

const clePaire = ({ id1, id2 }: DuplicationComparison): string => [id1, id2].sort().join('|');

const sansPaireInverse = (comparaisons: DuplicationComparison[]): DuplicationComparison[] => {
  const dejaVues: Set<string> = new Set<string>();

  return comparaisons.filter((comparaison: DuplicationComparison): boolean => {
    const cle: string = clePaire(comparaison);

    if (dejaVues.has(cle)) return false;

    dejaVues.add(cle);

    return true;
  });
};

const byScore = ({ score: scoreA }: DuplicationComparison, { score: scoreB }: DuplicationComparison): number => scoreB - scoreA;

export const duplicationComparisons = (
  lieux: SchemaLieuMediationNumerique[],
  allowInternalMerge: boolean,
  lieuxToDeduplicate: SchemaLieuMediationNumerique[] = lieux
): DuplicationComparison[] =>
  sansPaireInverse(
    lieuxToDeduplicate.map(toLieuComparable).flatMap(comparaisonsPourLieu(lieux.map(toLieuComparable), allowInternalMerge))
  ).sort(byScore);
