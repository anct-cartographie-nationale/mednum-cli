export const formatCommune = (commune: string): string => commune.charAt(0).toUpperCase() + commune.slice(1);

export const cannotApplyFix = <TData>(): TData => {
  throw new Error();
};

export const cannotFixAdresse = <TData>(error: unknown): TData => {
  throw error;
};

export const formatVoie = (adressePostale: string): string =>
  (adressePostale.includes('\n') ? adressePostale.substring(0, adressePostale.indexOf('\n')) : adressePostale).replace(
    /,/gu,
    ''
  );
