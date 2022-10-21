import { Contact, Url } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { HinauraLieuMediationNumerique } from '../../helper';

const emailField =
  "Email (éviter les emails nominatifs - en cas d'email nominitatif seule la personne concernée est autorisé à l'ajouter)";

const toLieuxMediationNumeriqueContact = (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique): Contact =>
  Contact({
    ...(hinauraLieuMediationNumerique.Téléphone ? { telephone: hinauraLieuMediationNumerique.Téléphone.toString() } : {}),
    ...(hinauraLieuMediationNumerique['Site Web'] ? { site_web: [Url(hinauraLieuMediationNumerique['Site Web'])] } : {}),
    ...(hinauraLieuMediationNumerique[emailField]
      ? {
          courriel: hinauraLieuMediationNumerique[emailField]
        }
      : {})
  });

const fixAndRetry = (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique, e: unknown) => {
  if (hinauraLieuMediationNumerique['Site Web'] === 'http://') {
    const { 'Site Web': removedProperty, ...filteredSiteWeb } = hinauraLieuMediationNumerique;

    return processContact(filteredSiteWeb);
  }
  if (hinauraLieuMediationNumerique['Site Web'] && !hinauraLieuMediationNumerique['Site Web']?.startsWith('http://'))
    return processContact({
      ...hinauraLieuMediationNumerique,
      ...{ 'Site Web': `http://${hinauraLieuMediationNumerique['Site Web']}` }
    });
  if (
    hinauraLieuMediationNumerique.Téléphone &&
    /['\-à’é().\sA-Za-z]/g.test(hinauraLieuMediationNumerique.Téléphone.toString())
  ) {
    return processContact({
      ...({
        ...hinauraLieuMediationNumerique,
        Téléphone: hinauraLieuMediationNumerique.Téléphone.toString().replace(/['\-à’é().\sA-Za-z]/g, '')
      } as HinauraLieuMediationNumerique)
    });
  }
  if (hinauraLieuMediationNumerique.Téléphone && /\d{10}\/\d{10}/.test(hinauraLieuMediationNumerique.Téléphone.toString())) {
    return processContact({
      ...({
        ...hinauraLieuMediationNumerique,
        Téléphone: hinauraLieuMediationNumerique.Téléphone.toString().split('/')[0]
      } as HinauraLieuMediationNumerique)
    });
  }
  if (hinauraLieuMediationNumerique.Téléphone?.toString().length === 9) {
    return processContact({
      ...hinauraLieuMediationNumerique,
      ...({ Téléphone: `+33${hinauraLieuMediationNumerique.Téléphone}` } as HinauraLieuMediationNumerique)
    });
  }
  if (hinauraLieuMediationNumerique.Téléphone?.toString() === '3230') {
    return processContact({
      ...hinauraLieuMediationNumerique,
      ...({ Téléphone: '+33969322121' } as HinauraLieuMediationNumerique)
    });
  }
  if (hinauraLieuMediationNumerique.Téléphone && hinauraLieuMediationNumerique.Téléphone.toString().length < 9) {
    const { Téléphone: removedProperty, ...filteredPhoneNumber } = hinauraLieuMediationNumerique;

    return processContact(filteredPhoneNumber);
  }
  if (
    hinauraLieuMediationNumerique.Téléphone &&
    hinauraLieuMediationNumerique.Téléphone.toString().startsWith('0') &&
    hinauraLieuMediationNumerique.Téléphone.toString().length > 10
  ) {
    const { Téléphone: removedProperty, ...filteredPhoneNumber } = hinauraLieuMediationNumerique;

    return processContact(filteredPhoneNumber);
  }
  if (hinauraLieuMediationNumerique[emailField] && hinauraLieuMediationNumerique[emailField]?.startsWith('www.')) {
    const { [emailField]: removedProperty, ...filteredEmail } = hinauraLieuMediationNumerique;

    return processContact(filteredEmail);
  }
  if (hinauraLieuMediationNumerique[emailField] && /\S\s:\s\S/.test(hinauraLieuMediationNumerique[emailField])) {
    return processContact({
      ...({
        ...hinauraLieuMediationNumerique,
        [emailField]: hinauraLieuMediationNumerique[emailField].split(/\s:\s/)[1]
      } as HinauraLieuMediationNumerique)
    });
  }
  if (
    hinauraLieuMediationNumerique[emailField] &&
    /\S\s?(?:et|ou|;|\s|\/)\s?\S/.test(hinauraLieuMediationNumerique[emailField])
  ) {
    return processContact({
      ...({
        ...hinauraLieuMediationNumerique,
        [emailField]: hinauraLieuMediationNumerique[emailField].split(/\s?(?:et|ou|;|\s|\/)\s?/)[0]
      } as HinauraLieuMediationNumerique)
    });
  }
  if (hinauraLieuMediationNumerique[emailField] && /\[a]/g.test(hinauraLieuMediationNumerique[emailField])) {
    return processContact({
      ...({
        ...hinauraLieuMediationNumerique,
        [emailField]: hinauraLieuMediationNumerique[emailField].replace('[a]', '@')
      } as HinauraLieuMediationNumerique)
    });
  }
  if (hinauraLieuMediationNumerique[emailField] && !/\.[a-z]{2,3}$/.test(hinauraLieuMediationNumerique[emailField])) {
    const { [emailField]: removedProperty, ...filteredEmail } = hinauraLieuMediationNumerique;

    return processContact(filteredEmail);
  }

  throw e;
};

export const processContact = (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique): Contact => {
  try {
    return toLieuxMediationNumeriqueContact(hinauraLieuMediationNumerique);
  } catch (error: unknown) {
    return fixAndRetry(hinauraLieuMediationNumerique, error);
  }
};
