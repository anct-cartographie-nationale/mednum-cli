/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Contact, Url } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { processContact } from './contact.field';
import { EMAIL_FIELD, SITE_WEB_FIELD } from './clean-operations';
import { LesAssembleursLieuMediationNumerique } from '../../helpers';
import { Recorder, Report } from '../../../mednum/transformer/report';

describe('contact field', (): void => {
  it('should extract empty contact data form source', (): void => {
    const contact: Contact = processContact(Report().entry(0))({} as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should extract full contact data form source', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '+33124963587',
      [EMAIL_FIELD]: 'test@mairie.fr',
      [SITE_WEB_FIELD]: 'https://mairie.fr'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33124963587',
        courriel: 'test@mairie.fr',
        site_web: [Url('https://mairie.fr')]
      })
    );
  });

  it('should excludes site webs with only http:// as value', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      [SITE_WEB_FIELD]: 'http://',
      Téléphone: '+33475582913'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33475582913'
      })
    );
  });

  it('should append missing http:// or site webs', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      [SITE_WEB_FIELD]: 'epn.adeaformation.fr',
      Téléphone: '+33475582913'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('http://epn.adeaformation.fr')],
        telephone: '+33475582913'
      })
    );
  });

  it('should fix phones with only 9 digits', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '475582913',
      [SITE_WEB_FIELD]: 'http://epn.adeaformation.fr'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('http://epn.adeaformation.fr')],
        telephone: '+33475582913'
      })
    );
  });

  it('should fix phones with single quotes', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: "'+33476498847"
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33476498847'
      })
    );
  });

  it('should fix phones with dots', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '04.79.28.79.28.'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33479287928'
      })
    );
  });

  it('should fix phones with spaces', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '04 43 762 762'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33443762762'
      })
    );
  });

  it('should fix phones with messages', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '04 73 94 20 49 Mairie'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33473942049'
      })
    );
  });

  it('should fix phones with parenthesis', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '(+33)474327740',
      [SITE_WEB_FIELD]: 'http://epn.adeaformation.fr'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33474327740',
        site_web: [Url('http://epn.adeaformation.fr')]
      })
    );
  });

  it('should fix phones with special chars', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: "'-à’éé0476714473"
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33476714473'
      })
    );
  });

  it('should have only one phone number / separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '0473658950/0761294745'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33473658950'
      })
    );
  });

  it('should have only one phone number // separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '0476070902//0685053452'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33476070902'
      })
    );
  });

  it('should remove phone dot separators', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '04.50.22.09.07'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33450220907'
      })
    );
  });

  it('should remove phone hyphen separators', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '04-50-72-70-47'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33450727047'
      })
    );
  });

  it('should remove optional local 0 from international format', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '+33(0)450336550'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33450336550'
      })
    );
  });

  it('should remove trailing details in phone', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '0450950700 Poste 152'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33450950700'
      })
    );
  });

  it('should remove heading details in phone', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: 'sur rendez-vous à l’accueil de la mairie ou par téléphone au 0476714473'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33476714473'
      })
    );
  });

  it('should have international version for CAF phone number', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '3230'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33969322121'
      })
    );
  });

  it('should remove phone number with missing numbers', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '74929808'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove phone number with too much numbers', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '0450950700152'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove email ending with a dot', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      [EMAIL_FIELD]: 'bibliotheque.lecendre@clermontmetropole.'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove email without ending', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      [EMAIL_FIELD]: 'biblio@saint-jorioz'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should have only one email - "ou" separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      [EMAIL_FIELD]: 'chambéry@accorderie.fr ou accueilchambery@accorderie.fr'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'chambéry@accorderie.fr'
      })
    );
  });

  it('should have only one email - "/" separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      [EMAIL_FIELD]: 'epnevs26@gmail.com / contact@eustaches.com'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'epnevs26@gmail.com'
      })
    );
  });

  it('should have only one email - "et" separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      [EMAIL_FIELD]: 'gieres-jeunesse@wanadoo.fr et pij@ville-gieres.fr'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'gieres-jeunesse@wanadoo.fr'
      })
    );
  });

  it('should have only one email - ";" separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      [EMAIL_FIELD]: 'mlidv.direction@gmail.com ; accueil.mipe.ml@gmail.com'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'mlidv.direction@gmail.com'
      })
    );
  });

  it('should have only one email - white space separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      [EMAIL_FIELD]: 's.fontaine@vichy-communaute.fr t.chosson@vichy-communaute.fr'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 's.fontaine@vichy-communaute.fr'
      })
    );
  });

  it('should remove emails looking like urls', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      [EMAIL_FIELD]: 'www.cc-mdl.fr/maisons-services'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should fix manual @ character escape', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      [EMAIL_FIELD]: 'accuei[a]cap-berriat.com'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'accuei@cap-berriat.com'
      })
    );
  });

  it('should remove label in courriel', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      [EMAIL_FIELD]: 'courriel : cnumerique15@gmail.com'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'cnumerique15@gmail.com'
      })
    );
  });

  it('should get invalid email record in report with an update fix', (): void => {
    const report: Report = Report();
    const recorder: Recorder = report.entry(0);

    processContact(recorder)({
      [EMAIL_FIELD]: 'dupond[a]conseiller-numerique.fr'
    } as LesAssembleursLieuMediationNumerique);

    expect(report.records()).toStrictEqual([
      {
        index: 0,
        errors: [
          {
            field: 'courriel',
            message: "Le courriel dupond[a]conseiller-numerique.fr n'est pas valide",
            fixes: [
              {
                before: 'dupond[a]conseiller-numerique.fr',
                apply: 'missing @ in email',
                after: 'dupond@conseiller-numerique.fr'
              }
            ]
          }
        ]
      }
    ]);
  });

  it('should get invalid email record in report with a delete fix', (): void => {
    const report: Report = Report();
    const recorder: Recorder = report.entry(0);

    processContact(recorder)({
      [EMAIL_FIELD]: 'dupond@conseiller-numerique.'
    } as LesAssembleursLieuMediationNumerique);

    expect(report.records()).toStrictEqual([
      {
        index: 0,
        errors: [
          {
            field: 'courriel',
            message: "Le courriel dupond@conseiller-numerique. n'est pas valide",
            fixes: [
              {
                before: 'dupond@conseiller-numerique.',
                apply: 'missing dot suffix in email'
              }
            ]
          }
        ]
      }
    ]);
  });

  it('should return null object when value is set by "-"', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      [EMAIL_FIELD]: '-----',
      [SITE_WEB_FIELD]: '-----',
      Téléphone: '-----'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove invalide phone with alpha characters', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '3960Service006'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove email starting with @', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      [EMAIL_FIELD]: '@pole-emploi.fr'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove email starting with mailto:', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      [EMAIL_FIELD]: 'mailto:mfs-stjust@oise.fr'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({ courriel: 'mfs-stjust@oise.fr' }));
  });

  it('should trim spaces in email', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      [EMAIL_FIELD]: ' mfs-stjust@oise.fr'
    } as LesAssembleursLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({ courriel: 'mfs-stjust@oise.fr' }));
  });
});
