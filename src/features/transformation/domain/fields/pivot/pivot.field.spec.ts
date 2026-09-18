import type { Adresse, Pivot } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { describe, it, expect } from 'vitest';
import type { EtablissementALAdresse } from '../../../../../libraries/annuaire-entreprises';
import type { DataSource, LieuxMediationNumeriqueMatching } from '../../matching';
import { type Record as ReportRecord, Report } from '../../report';
import type { AnnuaireIndex } from './determination';
import { processPivot } from './pivot.field';

const MATCHING = { pivot: { colonne: 'SIRET' } } as LieuxMediationNumeriqueMatching;

const SIRET_DU_LIEU = '40852636600039';
const AUTRE_SIRET = '43493312300029';

const ADRESSE = {
  voie: '31 Rue Jean Gallart',
  code_postal: '49650',
  code_insee: '49003',
  commune: 'Allonnes'
} as Adresse;

const NOM = 'Association Le Campus Espace Jeunes';

const etablissement = (siret: string): EtablissementALAdresse => ({
  siret,
  denomination: 'ASSOCIATION LE CAMPUS ESPACES JEUNES',
  natureJuridique: '9220',
  adresse: '31 RUE JEAN GALLART 49650 ALLONNES',
  actif: true
});

const ANNUAIRE: AnnuaireIndex = new Map([['49650|31|rue jean gallart', [etablissement(SIRET_DU_LIEU)]]]);
const VIDE: AnnuaireIndex = new Map();

const determiner = (source: DataSource, annuaire: AnnuaireIndex): { pivot: Pivot | undefined; records: ReportRecord[] } => {
  const report: Report = Report();
  const recorder = report.entry(0);
  const pivot: Pivot | undefined = processPivot(source, MATCHING, annuaire, ADRESSE, NOM, recorder, NOM);
  recorder.commit();

  return { pivot, records: report.records() };
};

describe('pivot dérivé de l’annuaire', (): void => {
  it('retient le SIRET déterminé et ne signale rien quand il confirme le déclaré', (): void => {
    const { pivot, records } = determiner({ SIRET: SIRET_DU_LIEU }, ANNUAIRE);

    expect(pivot).toBe(SIRET_DU_LIEU);
    expect(records).toStrictEqual([]);
  });

  it('tolère les séparateurs du SIRET déclaré pour le comparer', (): void => {
    const { records } = determiner({ SIRET: '408 526 366 00039' }, ANNUAIRE);

    expect(records).toStrictEqual([]);
  });

  it('remplace le SIRET déclaré qui désigne un autre établissement, et porte la correction', (): void => {
    const { pivot, records } = determiner({ SIRET: AUTRE_SIRET }, ANNUAIRE);

    expect(pivot).toBe(SIRET_DU_LIEU);
    expect(records[0]?.errors[0]?.field).toBe('pivot');
    expect(records[0]?.errors[0]?.fixes?.[0]).toMatchObject({ before: AUTRE_SIRET, after: SIRET_DU_LIEU });
  });

  it('retire le SIRET déclaré qu’aucun établissement ne confirme', (): void => {
    const { pivot, records } = determiner({ SIRET: AUTRE_SIRET }, VIDE);

    expect(pivot).toBeUndefined();
    expect(records[0]?.errors[0]?.message).toContain('retiré');
    expect(records[0]?.errors[0]?.fixes).toStrictEqual([]);
  });

  it('ajoute le SIRET déterminé quand la source n’en déclare aucun, et le signale', (): void => {
    const { pivot, records } = determiner({}, ANNUAIRE);

    expect(pivot).toBe(SIRET_DU_LIEU);
    expect(records[0]?.errors[0]?.fixes?.[0]).toMatchObject({ before: '', after: SIRET_DU_LIEU });
  });

  it('ne signale rien quand il n’y a ni SIRET déclaré ni établissement trouvé', (): void => {
    const { pivot, records } = determiner({}, VIDE);

    expect(pivot).toBeUndefined();
    expect(records).toStrictEqual([]);
  });

  it('écarte un SIRET dont la clé de contrôle est fausse', (): void => {
    const annuaire: AnnuaireIndex = new Map([['49650|31|rue jean gallart', [etablissement('12345678910111')]]]);

    expect(determiner({}, annuaire).pivot).toBeUndefined();
  });
});
