import {
  Contact,
  type ContactToValidate,
  Courriel,
  nettoyerCourriel,
  nettoyerSiteWeb,
  nettoyerTelephone,
  telephoneCanonique,
  Url
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { LieuxMediationNumeriqueMatching, DataSource } from '../../matching';
import type { Recorder } from '../../report';

/**
 * Le nettoyage de la bibliothèque ramène tous les séparateurs employés par les producteurs —
 * « ou », « et », la barre oblique, l'espace, le point-virgule — à la barre verticale. Il porte
 * donc sur le champ entier, avant le découpage.
 */
const valeursSeparees = (valeurs: string | undefined, nettoyer: (valeur: string) => string): string[] =>
  valeurs == null || valeurs.trim() === ''
    ? []
    : nettoyer(valeurs)
        .split('|')
        .map((valeur: string): string => valeur.trim())
        .filter((valeur: string): boolean => valeur !== '');

const codePostalDe = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string | undefined =>
  [matching.code_postal?.colonne ?? []]
    .flat()
    .map((colonne: string): string | undefined => source[colonne]?.toString())
    .find(Boolean);

const entryNameDe = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
  (matching.nom?.colonne == null ? undefined : source[matching.nom.colonne]?.toString()) ?? '';

const telephoneField = (
  recorder: Recorder,
  entryName: string,
  telephone: string | undefined,
  codePostal: string | undefined
): Pick<ContactToValidate, 'telephone'> => {
  if (telephone == null || telephone.trim() === '') return {};

  const canonique: string | null = telephoneCanonique(nettoyerTelephone(codePostal)(telephone));

  if (canonique != null) return { telephone: canonique };

  recorder.record('contact.telephone', `Le téléphone « ${telephone} » n'est pas un numéro français valide`, entryName);

  return {};
};

const valeursValides = <TValeur>(
  brutes: string[],
  construire: { safe: (valeur: string) => TValeur | null },
  recorder: Recorder,
  entryName: string,
  champ: string,
  libelle: string
): TValeur[] =>
  brutes.reduce((retenues: TValeur[], brute: string): TValeur[] => {
    const valide: TValeur | null = construire.safe(brute);

    if (valide != null) return [...retenues, valide];

    recorder.record(champ, `${libelle} « ${brute} » n'est pas reconnu`, entryName);

    return retenues;
  }, []);

const listeIfAny = <TClef extends string, TValeur>(clef: TClef, valeurs: TValeur[]): Record<TClef, TValeur[]> | object =>
  valeurs.length === 0 ? {} : { [clef]: valeurs };

export const processContact =
  (recorder: Recorder) =>
  (source: DataSource, matching: LieuxMediationNumeriqueMatching): Contact => {
    const entryName: string = entryNameDe(source, matching);

    return Contact({
      ...telephoneField(
        recorder,
        entryName,
        matching.telephone?.colonne == null ? undefined : source[matching.telephone.colonne]?.toString(),
        codePostalDe(source, matching)
      ),
      ...listeIfAny(
        'site_web',
        valeursValides(
          valeursSeparees(
            matching.site_web?.colonne == null ? undefined : source[matching.site_web.colonne]?.toString(),
            nettoyerSiteWeb
          ),
          Url,
          recorder,
          entryName,
          'contact.site_web',
          "L'adresse"
        )
      ),
      ...listeIfAny(
        'courriels',
        valeursValides(
          valeursSeparees(
            matching.courriels?.colonne == null ? undefined : source[matching.courriels.colonne]?.toString(),
            nettoyerCourriel
          ),
          Courriel,
          recorder,
          entryName,
          'contact.courriels',
          "L'adresse électronique"
        )
      )
    });
  };
