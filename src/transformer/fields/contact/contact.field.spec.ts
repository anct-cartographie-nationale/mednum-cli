/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Contact, Courriel, Url } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { Report } from '../../report';
import { processContact } from './contact.field';

const EMAIL_FIELD: string =
  "Email (éviter les emails nominatifs - en cas d'email nominitatif seule la personne concernée est autorisé à l'ajouter)";

const matching: LieuxMediationNumeriqueMatching = {
  code_postal: {
    colonne: 'code_postal'
  },
  telephone: {
    colonne: 'Téléphone'
  },
  courriels: {
    colonne: EMAIL_FIELD
  },
  site_web: {
    colonne: 'Site Web'
  }
} as LieuxMediationNumeriqueMatching;

describe('contact field', (): void => {
  it('should extract empty contact data form source', (): void => {
    const contact: Contact = processContact(Report().entry(0))({} as DataSource, matching);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should extract full contact data form source', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '+33124963587',
        [EMAIL_FIELD]: 'test@mairie.fr',
        'Site Web': 'https://mairie.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33124963587',
        courriels: [Courriel('test@mairie.fr')],
        site_web: [Url('https://mairie.fr')]
      })
    );
  });

  it('should remove site web with all accents', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '',
        [EMAIL_FIELD]: '',
        'Site Web': 'http://www.paciBouche-du-Rhône.com'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should lowercase all character in a site web', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '',
        [EMAIL_FIELD]: '',
        'Site Web': 'Http://Deltalabprototype.Fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('http://deltalabprototype.fr')]
      })
    );
  });

  it('should extract contact without téléphone in matching', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'test@mairie.fr',
        'Site Web': 'https://mairie.fr'
      } as DataSource,
      {
        courriels: {
          colonne: EMAIL_FIELD
        },
        site_web: {
          colonne: 'Site Web'
        }
      } as LieuxMediationNumeriqueMatching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('test@mairie.fr')],
        site_web: [Url('https://mairie.fr')]
      })
    );
  });

  it('should extract contact without courriel in matching', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '+33124963587',
        'Site Web': 'https://mairie.fr'
      } as DataSource,
      {
        telephone: {
          colonne: 'Téléphone'
        },
        site_web: {
          colonne: 'Site Web'
        }
      } as LieuxMediationNumeriqueMatching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33124963587',
        site_web: [Url('https://mairie.fr')]
      })
    );
  });

  it('should extract contact without site web in matching', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '+33124963587',
        [EMAIL_FIELD]: 'test@mairie.fr'
      } as DataSource,
      {
        telephone: {
          colonne: 'Téléphone'
        },
        courriels: {
          colonne: EMAIL_FIELD
        }
      } as LieuxMediationNumeriqueMatching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33124963587',
        courriels: [Courriel('test@mairie.fr')]
      })
    );
  });

  it('should excludes site webs with only http:// as value', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'http://',
        Téléphone: '+33475582913'
      } as DataSource,
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
      } as DataSource,
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
      } as DataSource,
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
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('https://expresshauts73.wordpress.com/'), Url('http://www.bm-chambery.fr')]
      })
    );
  });

  it('should fix multiple urls separated with ou and missing http', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'http://www.banquealimentaire.org ou barennes.banquealimentaire.org'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('http://www.banquealimentaire.org'), Url('http://barennes.banquealimentaire.org')]
      })
    );
  });

  it('should seperate two url if there is no separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'http://www.letoilerie.com/http://marie-et-alphonse.com/'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('http://www.letoilerie.com/'), Url('http://marie-et-alphonse.com/')]
      })
    );
  });

  it('should fix multiple urls separated with newline', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'https://www.facebook.com/pam.falep/\nhttps://falep.corsica/\n'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('https://www.facebook.com/pam.falep/'), Url('https://falep.corsica/')]
      })
    );
  });

  it('should fix url with comma instead of dot', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'http://www,devandyou.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('http://www.devandyou.fr')]
      })
    );
  });

  it('should fix url with missing slash after http:', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'http:/www.plume-mediatheques.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('http://www.plume-mediatheques.fr')]
      })
    );
  });

  it('should fix multiple urls separated by slash', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'https://www.siea.fr/ / https://sites.google.com/tactis.fr/siea-tida/conseiller-numerique'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('https://www.siea.fr/'), Url('https://sites.google.com/tactis.fr/siea-tida/conseiller-numerique')]
      })
    );
  });

  it('should fix url starting with https//:', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'https//:ajdmonde.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('https://ajdmonde.fr')]
      })
    );
  });

  it('should fix url starting with https/', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'https/www.mediathequeenflandre.fr/'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('https://www.mediathequeenflandre.fr/')]
      })
    );
  });

  it('should fix url starting with https:/', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'https:/www.centre-social-rural-lamorlaye.org'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('https://www.centre-social-rural-lamorlaye.org')]
      })
    );
  });

  it('should remove details in parenthesis', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '3960 (Service 0,06 € / mn + prix appel)'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33971103960'
      })
    );
  });

  it('should remove websites with spaces', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'http://www.souzay-champigny.Mairie et services municipaux49.fr/'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove websites with accented characters', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'https://www.apis-ingénierie.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should fix phones with only 9 digits', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: 475582913 as unknown as string,
        'Site Web': 'http://epn.adeaformation.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('http://epn.adeaformation.fr')],
        telephone: '+33475582913'
      })
    );
  });

  it('should set good indicatif when phone is from Guadeloupe', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        code_postal: '97156',
        Téléphone: 475582913 as unknown as string
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+590475582913'
      })
    );
  });

  it('should set good indicatif when phone is from Martinique', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        code_postal: '97250',
        Téléphone: 475582913 as unknown as string
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+596475582913'
      })
    );
  });

  it('should set good indicatif when phone is from Guyane', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        code_postal: '97350',
        Téléphone: 475582913 as unknown as string
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+594475582913'
      })
    );
  });

  it('should set good indicatif when phone is from La Reunion', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        code_postal: '97450',
        Téléphone: 475582913 as unknown as string
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+262475582913'
      })
    );
  });

  it('should fix two errors in contact', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'contact@crangevrieranimation.com',
        Téléphone: 450673375 as unknown as string,
        'Site Web': 'https://www.crangevrieranimation.com/'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('contact@crangevrieranimation.com')],
        site_web: [Url('https://www.crangevrieranimation.com/')],
        telephone: '+33450673375'
      })
    );
  });

  it('should fix phones with single quotes', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: "'+33476498847"
      } as DataSource,
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
      } as DataSource,
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
      } as DataSource,
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
      } as DataSource,
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
      } as DataSource,
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
      } as DataSource,
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
      } as DataSource,
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
      } as DataSource,
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
      } as DataSource,
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
      } as DataSource,
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
      } as DataSource,
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
      } as DataSource,
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
      } as DataSource,
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
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33969322121'
      })
    );
  });

  it('should remove phone with good numbers of digit but not valid', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '5858777054'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove phone if starting by two zero', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '0081188806'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove phone number with missing numbers', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '024178384'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove phone number with too much numbers', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '0450950700152'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove email ending with a dot', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'bibliotheque.lecendre@clermontmetropole.'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove email without ending', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'biblio@saint-jorioz'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should fix space in email', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'contact@latelierde malauzat.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('contact@latelierdemalauzat.fr')]
      })
    );
  });

  it('should fix email starting with colon', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: ': ccas@biarritz.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('ccas@biarritz.fr')]
      })
    );
  });

  it('should have only one email - "ou" separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'chambéry@accorderie.fr ou accueilchambery@accorderie.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('chambery@accorderie.fr'), Courriel('accueilchambery@accorderie.fr')]
      })
    );
  });

  it('should have only one email - "/" separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'epnevs26@gmail.com / contact@eustaches.com'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('epnevs26@gmail.com'), Courriel('contact@eustaches.com')]
      })
    );
  });

  it('should have only one email - "et" separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'gieres-jeunesse@wanadoo.fr et pij@ville-gieres.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('gieres-jeunesse@wanadoo.fr'), Courriel('pij@ville-gieres.fr')]
      })
    );
  });

  it('should have only one email - ";" separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'mlidv.direction@gmail.com ; accueil.mipe.ml@gmail.com'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('mlidv.direction@gmail.com'), Courriel('accueil.mipe.ml@gmail.com')]
      })
    );
  });

  it('should have only one email - white space separator', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 's.fontaine@vichy-communaute.fr t.chosson@vichy-communaute.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('s.fontaine@vichy-communaute.fr'), Courriel('t.chosson@vichy-communaute.fr')]
      })
    );
  });

  it('should remove emails looking like urls', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'www.cc-mdl.fr/maisons-services'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should fix obfuscated @ in email', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'accuei[a]cap-berriat.com'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('accuei@cap-berriat.com')]
      })
    );
  });

  it('should delete starting dot in an email', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: '.francois.legoff@orange.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('francois.legoff@orange.fr')]
      })
    );
  });

  it('should remove missing @ in email', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'mediathequechevilly.cyber-base.org'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove label in courriel', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'courriel : cnumerique15@gmail.com'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('cnumerique15@gmail.com')]
      })
    );
  });

  it('should remove courriel starting with @', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: '@pole-emploi.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should fix courriel starting with mailto:', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'mailto:mfs-stjust@oise.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('mfs-stjust@oise.fr')]
      })
    );
  });

  it('should trim courriel with heading and trailing spaces', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: '  mfs-stjust@oise.fr  '
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('mfs-stjust@oise.fr')]
      })
    );
  });

  it('should remove dash email', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: '-----',
        Téléphone: '3960 (Service 0,06 € / mn + prix appel)'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33971103960'
      })
    );
  });

  it('should replace é with e in email', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'chambéry@accorderie.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('chambery@accorderie.fr')]
      })
    );
  });

  it('should fix space before dot in email', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'mediatheque .numerique@ville-gentilly.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('mediatheque.numerique@ville-gentilly.fr')]
      })
    );
  });

  it('should remove text preceded by semicolon in email', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'mediatheque;creteil.abbaye@gpsea.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('creteil.abbaye@gpsea.fr')]
      })
    );
  });

  it('should remove text preceded by space in email', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'aifpplaine centrale@ml94.reseau-idf.org'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('centrale@ml94.reseau-idf.org')]
      })
    );
  });

  it('should replace ç with c in email', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'service.bibliothequeç@sarlat.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('service.bibliothequec@sarlat.fr')]
      })
    );
  });

  it('should add : if missing with https', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'https//www.saintppereenretz.fr/bouger/culture/mediatheque.html'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('https://www.saintppereenretz.fr/bouger/culture/mediatheque.html')]
      })
    );
  });

  it('should process website with coded spaces and ()', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'http://www.ville-leguevin.fr/maison_des_quartiers%20(2).aspx'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('http://www.ville-leguevin.fr/maison_des_quartiers%20%282%29.aspx')]
      })
    );
  });

  it('should fix assurance retraite phone with space', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '39 60'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33971103960'
      })
    );
  });

  it('should test if there is a phone and empty string as courriel', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '39 60',
        [EMAIL_FIELD]: ''
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33971103960'
      })
    );
  });

  it('should replace : by . after www', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': 'http://www:senios.connexion.free.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('http://www.senios.connexion.free.fr')]
      })
    );
  });

  it('should remove no valid website', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        'Site Web': '@corinne.a.i.33'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should replace two @ in email by one', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'contact.pessac@@mldesgraves.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriels: [Courriel('contact.pessac@mldesgraves.fr')]
      })
    );
  });

  it('should keep the first phone number when multiple', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '04 95 22 35 34\n06 47 54 66 86'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33495223534'
      })
    );
  });

  it('should remove email if multiple At', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        [EMAIL_FIELD]: 'msap@marchaux1@orange.fr'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should add + at the start of the phone number if missing', (): void => {
    const contact: Contact = processContact(Report().entry(0))(
      {
        Téléphone: '33782358117'
      } as DataSource,
      matching
    );

    expect(contact).toStrictEqual<Contact>(Contact({ telephone: '+33782358117' }));
  });
});
