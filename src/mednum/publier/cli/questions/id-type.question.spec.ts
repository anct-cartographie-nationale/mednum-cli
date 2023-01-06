import { idTypeQuestion } from './id-type.question';

describe('id type option for cli import', (): void => {
  it('should get unexpected id type message for validate data gouv id type when input is null', (): void => {
    const validationResult: Promise<boolean | string> | boolean | string | undefined = idTypeQuestion({}).validate?.(null);

    expect(validationResult).toBe('Seules les valeurs "id d\'organisation" et "id d\'utilisateur" sont admises');
  });

  it('should get unexpected id type message for validate data gouv id type when input is undefined', (): void => {
    const validationResult: Promise<boolean | string> | boolean | string | undefined = idTypeQuestion({}).validate?.(undefined);

    expect(validationResult).toBe('Seules les valeurs "id d\'organisation" et "id d\'utilisateur" sont admises');
  });

  it('should get unexpected id type message for validate data gouv id type when input is empty string', (): void => {
    const validationResult: Promise<boolean | string> | boolean | string | undefined = idTypeQuestion({}).validate?.('  ');

    expect(validationResult).toBe('Seules les valeurs "id d\'organisation" et "id d\'utilisateur" sont admises');
  });

  it('should get unexpected id type message for validate data gouv id type when input is "test"', (): void => {
    const validationResult: Promise<boolean | string> | boolean | string | undefined = idTypeQuestion({}).validate?.('test');

    expect(validationResult).toBe('Seules les valeurs "id d\'organisation" et "id d\'utilisateur" sont admises');
  });

  it('should get true for validate data gouv id type when input is "id d\'organisation"', (): void => {
    const validationResult: Promise<boolean | string> | boolean | string | undefined = idTypeQuestion({}).validate?.(
      "id d'organisation"
    );

    expect(validationResult).toBe(true);
  });

  it('should get true for validate data gouv id type when input is "id d\'utilisateur"', (): void => {
    const validationResult: Promise<boolean | string> | boolean | string | undefined = idTypeQuestion({}).validate?.(
      "id d'utilisateur"
    );

    expect(validationResult).toBe(true);
  });
});
