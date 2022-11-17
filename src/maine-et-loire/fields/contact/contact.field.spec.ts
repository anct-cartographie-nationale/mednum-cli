/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Contact, Url } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { processContact } from './contact.field';
import { Recorder, Report } from '../../../tools';
import { MaineEtLoireLieuMediationNumerique } from '../../helper';

describe('contact field', (): void => {
  it('should extract empty contact data form source', (): void => {
    const contact: Contact = processContact(Report().entry(0))({} as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should extract full contact data form source', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '+33124963587',
      Courriel: 'test@mairie.fr',
      'Site web': 'https://mairie.fr'
    } as MaineEtLoireLieuMediationNumerique);

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
      'Site web': 'http://',
      Téléphone: '+33475582913'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33475582913'
      })
    );
  });

  it('should append missing http:// or site webs', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      'Site web': 'epn.adeaformation.fr',
      Téléphone: '+33475582913'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('http://epn.adeaformation.fr')],
        telephone: '+33475582913'
      })
    );
  });

  it('should fix phones with only 9 digits', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: 475582913,
      'Site web': 'http://epn.adeaformation.fr'
    } as MaineEtLoireLieuMediationNumerique);

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
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33476498847'
      })
    );
  });

  it('should fix phones with dots', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '04.79.28.79.28.'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33479287928'
      })
    );
  });

  it('should fix phones with spaces', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '04 43 762 762'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33443762762'
      })
    );
  });

  it('should fix phones with messages', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '04 73 94 20 49 Mairie'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33473942049'
      })
    );
  });

  it('should fix phones with parenthesis', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '(+33)474327740',
      'Site web': 'http://epn.adeaformation.fr'
    } as MaineEtLoireLieuMediationNumerique);

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
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33476714473'
      })
    );
  });

  it('should have only one phone number / separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '0473658950/0761294745'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33473658950'
      })
    );
  });

  it('should have only one phone number // separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '0476070902//0685053452'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33476070902'
      })
    );
  });

  it('should remove phone dot separators', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '04.50.22.09.07'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33450220907'
      })
    );
  });

  it('should remove phone hyphen separators', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '04-50-72-70-47'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33450727047'
      })
    );
  });

  it('should remove optional local 0 from international format', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '+33(0)450336550'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33450336550'
      })
    );
  });

  it('should remove trailing details in phone', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '0450950700 Poste 152'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33450950700'
      })
    );
  });

  it('should remove heading details in phone', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: 'sur rendez-vous à l’accueil de la mairie ou par téléphone au 0476714473'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33476714473'
      })
    );
  });

  it('should have international version for CAF phone number', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '3230'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33969322121'
      })
    );
  });

  it('should remove phone number with missing numbers', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '74929808'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove phone number with too much numbers', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '0450950700152'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove email ending with a dot', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Courriel: 'bibliotheque.lecendre@clermontmetropole.'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove email without ending', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Courriel: 'biblio@saint-jorioz'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should have only one email - "ou" separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Courriel: 'chambéry@accorderie.fr ou accueilchambery@accorderie.fr'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'chambéry@accorderie.fr'
      })
    );
  });

  it('should have only one email - "/" separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Courriel: 'epnevs26@gmail.com / contact@eustaches.com'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'epnevs26@gmail.com'
      })
    );
  });

  it('should have only one email - "et" separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Courriel: 'gieres-jeunesse@wanadoo.fr et pij@ville-gieres.fr'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'gieres-jeunesse@wanadoo.fr'
      })
    );
  });

  it('should have only one email - ";" separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Courriel: 'mlidv.direction@gmail.com ; accueil.mipe.ml@gmail.com'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'mlidv.direction@gmail.com'
      })
    );
  });

  it('should have only one email - white space separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Courriel: 's.fontaine@vichy-communaute.fr t.chosson@vichy-communaute.fr'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 's.fontaine@vichy-communaute.fr'
      })
    );
  });

  it('should remove emails looking like urls', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Courriel: 'www.cc-mdl.fr/maisons-services'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should fix manual @ character escape', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Courriel: 'accuei[a]cap-berriat.com'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'accuei@cap-berriat.com'
      })
    );
  });

  it('should remove label in courriel', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Courriel: 'courriel : cnumerique15@gmail.com'
    } as MaineEtLoireLieuMediationNumerique);

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
      Courriel: 'dupond[a]conseiller-numerique.fr'
    } as MaineEtLoireLieuMediationNumerique);

    recorder.commit();

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
      Courriel: 'dupond@conseiller-numerique.'
    } as MaineEtLoireLieuMediationNumerique);

    recorder.commit();

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

  it('should work', (): void => {
    const contact: Contact = processContact(Report().entry(0))({
      Téléphone: '02 41 41 5 67'
    } as MaineEtLoireLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });
});
