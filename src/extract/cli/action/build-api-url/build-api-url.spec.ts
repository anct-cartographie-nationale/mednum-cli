import { buildApiUrl } from './build-api-url';

describe('build api url', (): void => {
  it('should build url with filter on code insee', (): void => {
    const url: string = buildApiUrl({
      cartographieNationaleApiUrl: 'https://api.example.com',
      departements: '01,03,07,15,26,38,42,43,63,69,73,74',
      duplicates: true
    });

    expect(url).toBe(
      'https://api.example.com/lieux-inclusion-numerique/with-duplicates?and[mergedIds][exists]=false&adresse[beginsWith][code_insee]=01,03,07,15,26,38,42,43,63,69,73,74'
    );
  });

  it('should build url without departements', (): void => {
    const url: string = buildApiUrl({
      cartographieNationaleApiUrl: 'https://api.example.com',
      duplicates: true
    });

    expect(url).toBe('https://api.example.com/lieux-inclusion-numerique/with-duplicates?and[mergedIds][exists]=false');
  });

  it('should build url without duplicates', (): void => {
    const url: string = buildApiUrl({
      cartographieNationaleApiUrl: 'https://api.example.com',
      duplicates: false
    });

    expect(url).toBe('https://api.example.com/lieux-inclusion-numerique');
  });
});
