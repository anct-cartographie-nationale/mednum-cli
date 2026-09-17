const codePostalFromVoie = (voie: string): string => /\b\d{5}\b/u.exec(voie)?.[0] ?? '';

export const codePostalField = (voie: string, codePostal?: string): string =>
  codePostal?.toString() ?? codePostalFromVoie(voie);
