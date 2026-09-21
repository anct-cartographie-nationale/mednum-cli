import type { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { describe, it, expect } from 'vitest';
import { IDENTIFIANT_FIELD, sansIdentifiantEnDouble } from './identifiants-uniques';
import { Report } from './report';

const lieu = (id: string, nom: string): LieuMediationNumerique => ({ id, nom }) as LieuMediationNumerique;

describe('identifiants en double', (): void => {
  it('laisse passer des lieux dont les identifiants sont tous distincts', (): void => {
    const lieux: LieuMediationNumerique[] = [lieu('a', 'un'), lieu('b', 'deux')];

    expect(sansIdentifiantEnDouble(lieux, Report())).toStrictEqual(lieux);
  });

  it('écarte les deux lieux qui partagent un identifiant, non le seul second venu', (): void => {
    const restants: LieuMediationNumerique[] = sansIdentifiantEnDouble(
      [lieu('a', 'un'), lieu('a', 'deux'), lieu('b', 'trois')],
      Report()
    );

    expect(restants.map(({ id }: LieuMediationNumerique): string => id)).toStrictEqual(['b']);
  });

  it('nomme chaque lieu écarté au rapport', (): void => {
    const report: Report = Report();

    sansIdentifiantEnDouble([lieu('a', 'un'), lieu('a', 'deux')], report);

    expect(
      report.records().flatMap(({ errors }) => errors.map(({ field, entryName }) => `${String(field)}:${entryName}`))
    ).toStrictEqual([`${IDENTIFIANT_FIELD}:un`, `${IDENTIFIANT_FIELD}:deux`]);
  });

  it('ne consigne rien quand il n’y a rien à écarter', (): void => {
    const report: Report = Report();

    sansIdentifiantEnDouble([lieu('a', 'un')], report);

    expect(report.records()).toStrictEqual([]);
  });
});
