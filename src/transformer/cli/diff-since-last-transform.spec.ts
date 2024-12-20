import { DataSource } from '../input';
import {
  canTransform,
  Fingerprint,
  fingerprintsFrom,
  DiffSinceLastTransform,
  updateFingerprints,
  diffSinceLastTransform
} from './diff-since-last-transform';

const ID_KEY: string = 'TYPO_UID';

const UATL_FINGERPRINT: Fingerprint = {
  sourceId: '14',
  hash: 'e7d7002d1df0c66f3c0ab706f6511dc534baeae83c0221607696532932af4751'
};

const UATL_NESTED_FINGERPRINT: Fingerprint = {
  sourceId: '14',
  hash: '6e4220f91ae29edacd6ae9f3bfc2525b8e4344755746c04e5dbe912d56f51c32'
};

const UATL_FINGERPRINT_UPDATED: Fingerprint = {
  sourceId: '14',
  hash: '0a93e9d31109b1c7a33342eca2c853c8f0ca71afeb7102e880e211db7f8d8faf'
};

const IREPS_FINGERPRINT: Fingerprint = {
  sourceId: '32',
  hash: '196c86a3b61bfba6b02ede6880a965cb49d16cb7c1963416f0b43b79e6068530'
};

const FILALIGNE_FINGERPRINT: Fingerprint = {
  sourceId: '56',
  hash: '0ae880e9ed6893699721543d9f900354937ec8f789afb353cc6b9d75bc1a74ab'
};

const TRAIT_D_UNION_FINGERPRINT: Fingerprint = {
  sourceId: '23',
  hash: '882f4a726a017ef4dbf1889484298c6a9d2bbf6da2f4bd903829d42832ca2f9b'
};

const FINGERPRINTS: Fingerprint[] = [UATL_FINGERPRINT, IREPS_FINGERPRINT, FILALIGNE_FINGERPRINT];

const UATL_NESTED: DataSource = {
  properties: {
    id_source: 14,
    USER_NOM: 'Université Angevine du Temps Libre (UATL)',
    USER_ADRES: '14, rue Pocquet de Livonnières',
    USER_QUART: 'Centre Ville',
    LAT: 47.47303152,
    LNG: -0.54897495,
    DATE_MAJ: '2022-09-26 19:18:28',
    PUBLIC_: 'Senior (plus de 45 ans)',
    ACCES_ORDI: 'Utilisation ordinateur et/ou tablette',
    WIFI: 'Accès WIFI',
    HORAIRE: '9h à 12h, 14h à 17h hors vacances scolaires',
    TRANSPORT: 'Tramway (Ligne A) - arrêt Hôtel de Ville',
    TELEPHONE: '02 41 88 96 41',
    MAIL: 'uatl@uatl-eca.fr',
    SITE_INTER: 'https://uatl-eca.fr/',
    code_postal: '49000',
    commune: 'Angers'
  }
};

const UATL: DataSource = {
  TYPO_UID: 14,
  USER_NOM: 'Université Angevine du Temps Libre (UATL)',
  USER_ADRES: '14, rue Pocquet de Livonnières',
  USER_QUART: 'Centre Ville',
  LAT: 47.47303152,
  LNG: -0.54897495,
  DATE_MAJ: '2022-09-26 19:18:28',
  PUBLIC_: 'Senior (plus de 45 ans)',
  ACCES_ORDI: 'Utilisation ordinateur et/ou tablette',
  WIFI: 'Accès WIFI',
  HORAIRE: '9h à 12h, 14h à 17h hors vacances scolaires',
  TRANSPORT: 'Tramway (Ligne A) - arrêt Hôtel de Ville',
  TELEPHONE: '02 41 88 96 41',
  MAIL: 'uatl@uatl-eca.fr',
  SITE_INTER: 'https://uatl-eca.fr/',
  code_postal: '49000',
  commune: 'Angers'
};

const IREPS: DataSource = {
  TYPO_UID: 32,
  USER_NOM: 'Cité des associations (IREPS)',
  USER_TYPE: '',
  USER_ADRES: '58, boulevard du Doyenné - la cité des associations',
  USER_QUART: 'Monplaisir',
  LAT: 47.48882509,
  LNG: -0.53763382,
  DATE_MAJ: '2022-09-26 23:08:19',
  PUBLIC_: 'Etudiant, Professionnel',
  ACCES_ORDI: 'Utilisation ordinateur et/ou tablette',
  WIFI: 'Accès WIFI',
  HORAIRE: 'Mardi et Mercredi : 9h à 12h30 et 13h30 à 17h30 Jeudi : 14h à 17h30 Vendredi : 9h à 12h30',
  TRANSPORT: 'Ligne N° 9 - arrêt La Cité Chabada',
  TELEPHONE: '02 41 05 06 49',
  MAIL: 'ireps49@irepspdl.org',
  SITE_INTER: 'https://www.irepspdl.org/',
  code_postal: '49000',
  commune: 'Angers'
};

const FILALIGNE: DataSource = {
  TYPO_UID: 56,
  USER_NOM: 'Filalinge',
  USER_TYPE: '',
  USER_ADRES: '33, boulevard Beaussier',
  USER_QUART: 'Belle-Beille',
  LAT: 47.47785283,
  LNG: -0.59814994,
  DATE_MAJ: '2022-09-26 23:42:41',
  PUBLIC_: '',
  ACCES_ORDI: 'Utilisation ordinateur et/ou tablette',
  WIFI: 'Accès WIFI',
  HORAIRE: 'Lundi au vendredi : 9h à 13h et 14h à 17h',
  TRANSPORT: 'Ligne Irigo - N° 1 - Arrêt Cité universitaire, Lignes Irigo - N° 4, 6 - Arrêt Essca',
  TELEPHONE: '02 41 36 00 58',
  MAIL: '',
  SITE_INTER: 'https://filalinge.org/',
  code_postal: '49000',
  commune: 'Angers'
};

const TRAIT_D_UNION: DataSource = {
  TYPO_UID: 23,
  USER_NOM: "Trait d'Union",
  USER_TYPE: '',
  USER_ADRES: '50, rue de Jérusalem',
  USER_QUART: 'Grand-Pigeon Deux-Croix Banchais',
  LAT: 47.47341127,
  LNG: -0.53057554,
  DATE_MAJ: '2022-09-26 22:38:42',
  PUBLIC_: '',
  ACCES_ORDI: 'Utilisation ordinateur et/ou tablette',
  WIFI: 'Accès WIFI',
  HORAIRE:
    'Lundi de 9h à 12h et de 14h à 16h30 Mardi et Mercredi de 14h à 16h30 Jeudi de 9h à 11h30 et de 14h à 16h30 Vendredi de 15h30 à 17h',
  TRANSPORT: 'Lignes Irigo N° 1 - arrêt Lutin Lignes Irigo N° 2 et 4 - arrêt Lareveillière',
  TELEPHONE: '02 41 43 16 15 / 02 44 01 07 31',
  MAIL: 'asso-trait-d-union@wanadoo.fr',
  SITE_INTER: '',
  code_postal: '49000',
  commune: 'Angers'
};

const EMPTY_ID: DataSource = {
  TYPO_UID: ''
};

const SOURCE: DataSource[] = [UATL, IREPS, FILALIGNE];

const SOURCE_WITH_EMPTY_ID: DataSource[] = [...SOURCE, EMPTY_ID];

const SOURCE_WITH_UPDATE: DataSource[] = [UATL, IREPS, { ...FILALIGNE, DATE_MAJ: '2023-10-02 14:20:41' }];

const SOURCE_WITH_DELETE: DataSource[] = [UATL, FILALIGNE];

const SOURCE_WITH_CREATE: DataSource[] = [UATL, IREPS, FILALIGNE, TRAIT_D_UNION];

describe('should transform', (): void => {
  it('should detect that an item has not changed between two transformations', (): void => {
    const itemsToTransform: DiffSinceLastTransform = diffSinceLastTransform('properties.id_source', [UATL_NESTED_FINGERPRINT])([
      UATL_NESTED
    ]);

    expect(itemsToTransform).toStrictEqual({
      toUpsert: [],
      toDelete: []
    });
  });

  it('should detect that an item has not changed between two transformations with nested key', (): void => {
    const itemsToTransform: DiffSinceLastTransform = diffSinceLastTransform(ID_KEY, FINGERPRINTS)(SOURCE);

    expect(itemsToTransform).toStrictEqual({
      toUpsert: [],
      toDelete: []
    });
  });

  it('should detect that an item canot be transformed because id is invalid', (): void => {
    const itemsToTransform: DiffSinceLastTransform = diffSinceLastTransform(ID_KEY, FINGERPRINTS)(SOURCE);

    expect(itemsToTransform).toStrictEqual({
      toUpsert: [],
      toDelete: []
    });
  });

  it('should detect that an item has changed between two transformations', (): void => {
    const itemsToTransform: DiffSinceLastTransform = diffSinceLastTransform(ID_KEY, FINGERPRINTS)(SOURCE_WITH_UPDATE);

    expect(itemsToTransform).toStrictEqual({
      toUpsert: [{ ...FILALIGNE, DATE_MAJ: '2023-10-02 14:20:41' }],
      toDelete: []
    });
  });

  it('should detect that an item has been deleted between two transformations', (): void => {
    const itemsToTransform: DiffSinceLastTransform = diffSinceLastTransform(ID_KEY, FINGERPRINTS)(SOURCE_WITH_DELETE);

    expect(itemsToTransform).toStrictEqual({
      toUpsert: [],
      toDelete: [{ sourceId: '32' }]
    });
  });

  it('should detect that an item has been created between two transformations', (): void => {
    const itemsToTransform: DiffSinceLastTransform = diffSinceLastTransform(ID_KEY, FINGERPRINTS)(SOURCE_WITH_CREATE);

    expect(itemsToTransform).toStrictEqual({
      toUpsert: [TRAIT_D_UNION],
      toDelete: []
    });
  });

  it('should compute fingerprints from source items', (): void => {
    const fingerprints: Fingerprint[] = fingerprintsFrom(SOURCE, ID_KEY);

    expect(fingerprints).toStrictEqual(FINGERPRINTS);
  });

  it('should not compute fingerprint with empty id from source items', (): void => {
    const fingerprints: Fingerprint[] = fingerprintsFrom(SOURCE_WITH_EMPTY_ID, ID_KEY);

    expect(fingerprints).toStrictEqual(FINGERPRINTS);
  });

  it('should not update fingerprints, when nothing has changed', (): void => {
    const updatedFingerprints: Fingerprint[] = updateFingerprints(FINGERPRINTS, []);

    expect(updatedFingerprints).toStrictEqual(FINGERPRINTS);
  });

  it('should add a new fingerprint, when a new item has been added', (): void => {
    const updatedFingerprints: Fingerprint[] = updateFingerprints(FINGERPRINTS, [TRAIT_D_UNION_FINGERPRINT]);

    expect(updatedFingerprints).toStrictEqual([...FINGERPRINTS, TRAIT_D_UNION_FINGERPRINT]);
  });

  it('should not add fingerprint without id', (): void => {
    const updatedFingerprints: Fingerprint[] = updateFingerprints(FINGERPRINTS, [
      ...FINGERPRINTS,
      {
        sourceId: '',
        hash: 'e7d7002d1df0c66f3c0ab706f6511dc534baeae83c0221607696532932af4751'
      }
    ]);

    expect(updatedFingerprints).toStrictEqual(FINGERPRINTS);
  });

  it('should update a previous fingerprint, when an item has been updated', (): void => {
    const updatedFingerprints: Fingerprint[] = updateFingerprints(FINGERPRINTS, [UATL_FINGERPRINT_UPDATED]);

    expect(updatedFingerprints).toStrictEqual([UATL_FINGERPRINT_UPDATED, IREPS_FINGERPRINT, FILALIGNE_FINGERPRINT]);
  });

  it('should update a previous fingerprint and add a new one, when an item has been updated an another has been created', (): void => {
    const updatedFingerprints: Fingerprint[] = updateFingerprints(FINGERPRINTS, [
      UATL_FINGERPRINT_UPDATED,
      TRAIT_D_UNION_FINGERPRINT
    ]);

    expect(updatedFingerprints).toStrictEqual([
      UATL_FINGERPRINT_UPDATED,
      IREPS_FINGERPRINT,
      FILALIGNE_FINGERPRINT,
      TRAIT_D_UNION_FINGERPRINT
    ]);
  });

  it('should delete a previous fingerprint when an item has been deleted', (): void => {
    const updatedFingerprints: Fingerprint[] = updateFingerprints(FINGERPRINTS, [], [{ sourceId: '14' }]);

    expect(updatedFingerprints).toStrictEqual([IREPS_FINGERPRINT, FILALIGNE_FINGERPRINT]);
  });

  it('should indicate that we can transform items', (): void => {
    const result: boolean = canTransform({
      toUpsert: [],
      toDelete: []
    });

    expect(result).toBe(true);
  });

  it('should indicate that we can not transform items', (): void => {
    const result: boolean = canTransform(null);

    expect(result).toBe(false);
  });
});
