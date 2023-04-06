import { Recorder, Report } from './report';

describe('report', (): void => {
  it('should create a report with empty records', (): void => {
    const report: Report = Report();

    expect(report.records()).toStrictEqual([]);
  });

  it('should add a record with one fix', (): void => {
    const report: Report = Report()
      .entry(0)
      .record('email', "Le courriel dupond[a]conseiller-numerique.fr n'est pas une valeur admise", 'nomLieu')
      .fix({
        before: 'dupond[a]conseiller-numerique.fr',
        apply: 'missing @ in email',
        after: 'dupond@conseiller-numerique.fr'
      })
      .commit();

    expect(report.records()).toStrictEqual([
      {
        index: 0,
        errors: [
          {
            field: 'email',
            message: "Le courriel dupond[a]conseiller-numerique.fr n'est pas une valeur admise",
            fixes: [
              {
                before: 'dupond[a]conseiller-numerique.fr',
                apply: 'missing @ in email',
                after: 'dupond@conseiller-numerique.fr'
              }
            ],
            entryName: 'nomLieu'
          }
        ]
      }
    ]);
  });

  it('should add a record with two fixes', (): void => {
    const report: Report = Report()
      .entry(0)
      .record(
        'email',
        "Le courriel dupond[a]conseiller-numerique.fr / durand[a]conseiller-numerique.fr n'est pas une valeur admise",
        'nomLieu'
      )
      .fix({
        before: 'dupond[a]conseiller-numerique.fr / durand[a]conseiller-numerique.fr',
        apply: 'unexpected email list',
        after: 'dupond[a]conseiller-numerique.fr'
      })
      .fix({
        before: 'dupond[a]conseiller-numerique.fr',
        apply: 'missing @ in email',
        after: 'dupond@conseiller-numerique.fr'
      })
      .commit();

    expect(report.records()).toStrictEqual([
      {
        index: 0,
        errors: [
          {
            field: 'email',
            message:
              "Le courriel dupond[a]conseiller-numerique.fr / durand[a]conseiller-numerique.fr n'est pas une valeur admise",
            fixes: [
              {
                before: 'dupond[a]conseiller-numerique.fr / durand[a]conseiller-numerique.fr',
                apply: 'unexpected email list',
                after: 'dupond[a]conseiller-numerique.fr'
              },
              {
                before: 'dupond[a]conseiller-numerique.fr',
                apply: 'missing @ in email',
                after: 'dupond@conseiller-numerique.fr'
              }
            ],
            entryName: 'nomLieu'
          }
        ]
      }
    ]);
  });

  it('should add two records with one fix for each of them', (): void => {
    const report: Report = Report()
      .entry(0)
      .record('email', "Le courriel dupond[a]conseiller-numerique.fr n'est pas une valeur admise", 'nomLieu')
      .fix({
        before: 'dupond[a]conseiller-numerique.fr',
        apply: 'missing @ in email',
        after: 'dupond@conseiller-numerique.fr'
      })
      .record('phone', "Le téléphone 425896314 n'est pas une valeur admise", 'nomLieu')
      .fix({
        before: '425896314',
        apply: 'missing leading 0 in phone',
        after: '+33425896314'
      })
      .commit();

    expect(report.records()).toStrictEqual([
      {
        index: 0,
        errors: [
          {
            field: 'email',
            message: "Le courriel dupond[a]conseiller-numerique.fr n'est pas une valeur admise",
            fixes: [
              {
                before: 'dupond[a]conseiller-numerique.fr',
                apply: 'missing @ in email',
                after: 'dupond@conseiller-numerique.fr'
              }
            ],
            entryName: 'nomLieu'
          },
          {
            field: 'phone',
            message: "Le téléphone 425896314 n'est pas une valeur admise",
            fixes: [
              {
                before: '425896314',
                apply: 'missing leading 0 in phone',
                after: '+33425896314'
              }
            ],
            entryName: 'nomLieu'
          }
        ]
      }
    ]);
  });

  it('should add two entries with one record and one fix for each of them', (): void => {
    const report: Report = Report()
      .entry(0)
      .record('email', "Le courriel dupond[a]conseiller-numerique.fr n'est pas une valeur admise", 'nomLieu')
      .fix({
        before: 'dupond[a]conseiller-numerique.fr',
        apply: 'missing @ in email',
        after: 'dupond@conseiller-numerique.fr'
      })
      .commit()
      .entry(1)
      .record('phone', "Le téléphone 425896314 n'est pas une valeur admise", 'nomLieu')
      .fix({
        before: '425896314',
        apply: 'missing leading 0 in phone',
        after: '+33425896314'
      })
      .commit();

    expect(report.records()).toStrictEqual([
      {
        index: 0,
        errors: [
          {
            field: 'email',
            message: "Le courriel dupond[a]conseiller-numerique.fr n'est pas une valeur admise",
            fixes: [
              {
                before: 'dupond[a]conseiller-numerique.fr',
                apply: 'missing @ in email',
                after: 'dupond@conseiller-numerique.fr'
              }
            ],
            entryName: 'nomLieu'
          }
        ]
      },
      {
        index: 1,
        errors: [
          {
            field: 'phone',
            message: "Le téléphone 425896314 n'est pas une valeur admise",
            fixes: [
              {
                before: '425896314',
                apply: 'missing leading 0 in phone',
                after: '+33425896314'
              }
            ],
            entryName: 'nomLieu'
          }
        ]
      }
    ]);
  });

  it('should preserve internal state so that final new reference of report has not to be returned', (): void => {
    const report: Report = Report();

    const recorderForEntry0: Recorder = report.entry(0);

    const needFixForEntry0: Recorder = recorderForEntry0.record(
      'email',
      "Le courriel dupond[a]conseiller-numerique.fr n'est pas une valeur admise",
      'nomLieu'
    );

    const endFixForEntry0: Recorder = needFixForEntry0.fix({
      before: 'dupond[a]conseiller-numerique.fr',
      apply: 'missing @ in email',
      after: 'dupond@conseiller-numerique.fr'
    });

    endFixForEntry0.commit();

    const recorderForEntry1: Recorder = report.entry(1);

    const needFixForEntry1: Recorder = recorderForEntry1.record(
      'phone',
      "Le téléphone 425896314 n'est pas une valeur admise",
      'nomLieu'
    );

    const endFixForEntry1: Recorder = needFixForEntry1.fix({
      before: '425896314',
      apply: 'missing leading 0 in phone',
      after: '+33425896314'
    });

    endFixForEntry1.commit();

    expect(report.records()).toStrictEqual([
      {
        index: 0,
        errors: [
          {
            field: 'email',
            message: "Le courriel dupond[a]conseiller-numerique.fr n'est pas une valeur admise",
            fixes: [
              {
                before: 'dupond[a]conseiller-numerique.fr',
                apply: 'missing @ in email',
                after: 'dupond@conseiller-numerique.fr'
              }
            ],
            entryName: 'nomLieu'
          }
        ]
      },
      {
        index: 1,
        errors: [
          {
            field: 'phone',
            message: "Le téléphone 425896314 n'est pas une valeur admise",
            fixes: [
              {
                before: '425896314',
                apply: 'missing leading 0 in phone',
                after: '+33425896314'
              }
            ],
            entryName: 'nomLieu'
          }
        ]
      }
    ]);
  });

  it('should not commit empty records', (): void => {
    const report: Report = Report();

    const recorderForEntry0: Recorder = report.entry(0);

    recorderForEntry0.commit();

    expect(report.records()).toStrictEqual([]);
  });
});
