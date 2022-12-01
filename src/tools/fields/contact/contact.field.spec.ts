/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Contact, Url } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, Source } from '../../input';
import { Recorder, Report } from '../../report/report';
import { processContact } from './contact.field';

const EMAIL_FIELD: string =
  "Email (éviter les emails nominatifs - en cas d'email nominitatif seule la personne concernée est autorisé à l'ajouter)";

const matching: LieuxMediationNumeriqueMatching = {
  telephone: {
    colonne: 'Téléphone'
  },
  courriel: {
    colonne: EMAIL_FIELD
  },
  site_web: {
    colonne: 'Site Web'
  }
} as LieuxMediationNumeriqueMatching;

describe('contact field', (): void => {
  it('should extract empty contact data form source', (): void => {
    const contact: Contact = processContact(Report().entry(0))({} as Source, matching);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should extract full contact data form source', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '+33124963587',
        [EMAIL_FIELD]: 'test@mairie.fr',
        'Site Web': 'https://mairie.fr'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33124963587',
        courriel: 'test@mairie.fr',
        site_web: [Url('https://mairie.fr')]
      })
    );
  });

  it('should excludes site webs with only http:// as value', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'http://',
        Téléphone: '+33475582913'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33475582913'
      })
    );
  });

  it('should append missing http:// or site webs', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'epn.adeaformation.fr',
        Téléphone: '+33475582913'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('http://epn.adeaformation.fr')],
        telephone: '+33475582913'
      })
    );
  });

  it('should fix url with two protocole prefix', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'http://https://www.crangevrieranimation.com/'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('https://www.crangevrieranimation.com/')]
      })
    );
  });

  it('should fix multiple urls separated with ;', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'https://expresshauts73.wordpress.com/;http://www.bm-chambery.fr'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('https://expresshauts73.wordpress.com/'), Url('http://www.bm-chambery.fr')]
      })
    );
  });

  it('should fix multiple urls separated with ou', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'https://expresshauts73.wordpress.com/ ou http://www.bm-chambery.fr'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('https://expresshauts73.wordpress.com/'), Url('http://www.bm-chambery.fr')]
      })
    );
  });

  it('should remove url with spaces', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'http://www.souzay-champigny.Mairie et services municipaux49.fr/'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should fix phones with only 9 digits', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: 475582913 as unknown as string,
        'Site Web': 'http://epn.adeaformation.fr'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('http://epn.adeaformation.fr')],
        telephone: '+33475582913'
      })
    );
  });

  it('should fix two errors in contact', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'contact@crangevrieranimation.com',
        Téléphone: 450673375 as unknown as string,
        'Site Web': 'https://www.crangevrieranimation.com/'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'contact@crangevrieranimation.com',
        site_web: [Url('https://www.crangevrieranimation.com/')],
        telephone: '+33450673375'
      })
    );
  });

  it('should fix phones with single quotes', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: "'+33476498847"
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33476498847'
      })
    );
  });

  it('should fix phones with dots', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '04.79.28.79.28.'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33479287928'
      })
    );
  });

  it('should fix phones with spaces', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '04 43 762 762'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33443762762'
      })
    );
  });

  it('should fix phones with messages', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '04 73 94 20 49 Mairie'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33473942049'
      })
    );
  });

  it('should fix phones with parenthesis', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '(+33)474327740',
        'Site Web': 'http://epn.adeaformation.fr'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33474327740',
        site_web: [Url('http://epn.adeaformation.fr')]
      })
    );
  });

  it('should fix phones with special chars', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: "'-à’éé0476714473"
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33476714473'
      })
    );
  });

  it('should have only one phone number / separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '0473658950/0761294745'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33473658950'
      })
    );
  });

  it('should have only one phone number // separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '0476070902//0685053452'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33476070902'
      })
    );
  });

  it('should fix phone dot separators', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '04.50.22.09.07'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33450220907'
      })
    );
  });

  it('should fix phone hyphen separators', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '04-50-72-70-47'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33450727047'
      })
    );
  });

  it('should fix optional local 0 from international format', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '+33(0)450336550'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33450336550'
      })
    );
  });

  it('should remove trailing details in phone', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '0450950700 Poste 152'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33450950700'
      })
    );
  });

  it('should remove heading details in phone', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: 'sur rendez-vous à l’accueil de la mairie ou par téléphone au 0476714473'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33476714473'
      })
    );
  });

  it('should have international version for CAF phone number', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '3230'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33969322121'
      })
    );
  });

  it('should remove phone number with missing numbers', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '024178384'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove phone number with too much numbers', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '0450950700152'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove email ending with a dot', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'bibliotheque.lecendre@clermontmetropole.'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove email without ending', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'biblio@saint-jorioz'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should have only one email - "ou" separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'chambéry@accorderie.fr ou accueilchambery@accorderie.fr'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'chambéry@accorderie.fr'
      })
    );
  });

  it('should have only one email - "/" separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'epnevs26@gmail.com / contact@eustaches.com'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'epnevs26@gmail.com'
      })
    );
  });

  it('should have only one email - "et" separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'gieres-jeunesse@wanadoo.fr et pij@ville-gieres.fr'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'gieres-jeunesse@wanadoo.fr'
      })
    );
  });

  it('should have only one email - ";" separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'mlidv.direction@gmail.com ; accueil.mipe.ml@gmail.com'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'mlidv.direction@gmail.com'
      })
    );
  });

  it('should have only one email - white space separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 's.fontaine@vichy-communaute.fr t.chosson@vichy-communaute.fr'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 's.fontaine@vichy-communaute.fr'
      })
    );
  });

  it('should remove emails looking like urls', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'www.cc-mdl.fr/maisons-services'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should fix manual @ character escape', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'accuei[a]cap-berriat.com'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'accuei@cap-berriat.com'
      })
    );
  });

  it('should remove label in courriel', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'courriel : cnumerique15@gmail.com'
      } as Source,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'cnumerique15@gmail.com'
      })
    );
  });

  it('should get invalid email record in report with an update fix', (): void => {
    const report: Report = Report();
    const recorder: Recorder = report.entry(0);

    processContact(recorder)(
      {
        [EMAIL_FIELD]: 'dupond[a]conseiller-numerique.fr'
      } as Source,
      matching
    );

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

    processContact(recorder)(
      {
        [EMAIL_FIELD]: 'dupond@conseiller-numerique.'
      } as Source,
      matching
    );

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
});
