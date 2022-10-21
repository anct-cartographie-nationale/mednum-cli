import { Contact, Url } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { processContact } from './contact.field';
import { HinauraLieuMediationNumerique } from '../../helper';

const emailField =
  "Email (éviter les emails nominatifs - en cas d'email nominitatif seule la personne concernée est autorisé à l'ajouter)";

describe('contact field', (): void => {
  it('should extract empty contact data form source', (): void => {
    const contact: Contact = processContact({} as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should extract full contact data form source', (): void => {
    const contact: Contact = processContact({
      Téléphone: '+33124963587',
      [emailField]: 'test@mairie.fr',
      'Site Web': 'https://mairie.fr'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33124963587',
        courriel: 'test@mairie.fr',
        site_web: [Url('https://mairie.fr')]
      })
    );
  });

  it('should excludes site webs with only http:// as value', (): void => {
    const contact: Contact = processContact({
      'Site Web': 'http://',
      Téléphone: '+33475582913'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33475582913'
      })
    );
  });

  it('should append missing http:// or site webs', (): void => {
    const contact: Contact = processContact({
      'Site Web': 'epn.adeaformation.fr',
      Téléphone: '+33475582913'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('http://epn.adeaformation.fr')],
        telephone: '+33475582913'
      })
    );
  });

  it('should fix phones with only 9 digits', (): void => {
    const contact: Contact = processContact({
      Téléphone: 475582913,
      'Site Web': 'http://epn.adeaformation.fr'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        site_web: [Url('http://epn.adeaformation.fr')],
        telephone: '+33475582913'
      })
    );
  });

  it('should fix phones with parenthesis', (): void => {
    const contact: Contact = processContact({
      Téléphone: '(+33)474327740',
      'Site Web': 'http://epn.adeaformation.fr'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33474327740',
        site_web: [Url('http://epn.adeaformation.fr')]
      })
    );
  });

  it('should fix phones with dots', (): void => {
    const contact: Contact = processContact({
      Téléphone: '04.79.28.79.28.'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '0479287928'
      })
    );
  });

  it('should fix phones with spaces', (): void => {
    const contact: Contact = processContact({
      Téléphone: '04 43 762 762'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '0443762762'
      })
    );
  });

  it('should fix phones with messages', (): void => {
    const contact: Contact = processContact({
      Téléphone: '04 73 94 20 49 Mairie'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '0473942049'
      })
    );
  });

  it('should fix phones with single quotes', (): void => {
    const contact: Contact = processContact({
      Téléphone: "'+33476498847"
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33476498847'
      })
    );
  });

  it('should fix phones with special chars', (): void => {
    const contact: Contact = processContact({
      Téléphone: "'-à’éé0476714473"
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '0476714473'
      })
    );
  });

  it('should have only one phone number', (): void => {
    const contact: Contact = processContact({
      Téléphone: '0473658950/0761294745'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '0473658950'
      })
    );
  });

  it('should have international version for CAF phone number', (): void => {
    const contact: Contact = processContact({
      Téléphone: '3230'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        telephone: '+33969322121'
      })
    );
  });

  it('should remove phone number with missing numbers', (): void => {
    const contact: Contact = processContact({
      Téléphone: '74929808'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove phone number with too mutch numbers', (): void => {
    const contact: Contact = processContact({
      Téléphone: '0450950700152'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove email ending with a dot', (): void => {
    const contact: Contact = processContact({
      [emailField]: 'bibliotheque.lecendre@clermontmetropole.'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should remove email without ending', (): void => {
    const contact: Contact = processContact({
      [emailField]: 'biblio@saint-jorioz'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should have only one email - "ou" separator', (): void => {
    const contact: Contact = processContact({
      [emailField]: 'chambéry@accorderie.fr ou accueilchambery@accorderie.fr'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'chambéry@accorderie.fr'
      })
    );
  });

  it('should have only one email - "/" separator', (): void => {
    const contact: Contact = processContact({
      [emailField]: 'epnevs26@gmail.com / contact@eustaches.com'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'epnevs26@gmail.com'
      })
    );
  });

  it('should have only one email - "et" separator', (): void => {
    const contact: Contact = processContact({
      [emailField]: 'gieres-jeunesse@wanadoo.fr et pij@ville-gieres.fr'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'gieres-jeunesse@wanadoo.fr'
      })
    );
  });

  it('should have only one email - ";" separator', (): void => {
    const contact: Contact = processContact({
      [emailField]: 'mlidv.direction@gmail.com ; accueil.mipe.ml@gmail.com'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'mlidv.direction@gmail.com'
      })
    );
  });

  it('should have only one email - white space separator', (): void => {
    const contact: Contact = processContact({
      [emailField]: 's.fontaine@vichy-communaute.fr t.chosson@vichy-communaute.fr'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 's.fontaine@vichy-communaute.fr'
      })
    );
  });

  it('should remove emails looking like urls', (): void => {
    const contact: Contact = processContact({
      [emailField]: 'www.cc-mdl.fr/maisons-services'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(Contact({}));
  });

  it('should fix manual @ character escape', (): void => {
    const contact: Contact = processContact({
      [emailField]: 'accuei[a]cap-berriat.com'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'accuei@cap-berriat.com'
      })
    );
  });

  it('should remove label in courriel', (): void => {
    const contact: Contact = processContact({
      [emailField]: 'courriel : cnumerique15@gmail.com'
    } as HinauraLieuMediationNumerique);

    expect(contact).toStrictEqual<Contact>(
      Contact({
        courriel: 'cnumerique15@gmail.com'
      })
    );
  });
});
