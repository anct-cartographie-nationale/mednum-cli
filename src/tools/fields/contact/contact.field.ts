import { Contact } from '@gouvfr-anct/lieux-de-mediation-numerique';

export const cannotFixContact = (error: unknown): Contact => {
  throw error;
};

const toInternationalFormat = (phone: string): string => (/^0\d{9}$/u.test(phone) ? `+33${phone.slice(1)}` : phone);

export const formatPhone = (phone: string): string => toInternationalFormat(phone.replace(/[\s,.-]/gu, '').replace('(0)', ''));
