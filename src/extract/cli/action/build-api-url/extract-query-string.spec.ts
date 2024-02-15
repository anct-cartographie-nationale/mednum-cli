import { extractQueryString } from './extract-query-string';

describe('build api url', (): void => {
  it('should build url with filter on code insee', (): void => {
    const url: string = extractQueryString({
      departements: '01,03,07,15,26,38,42,43,63,69,73,74',
      duplicates: true
    });

    expect(url).toBe('and[mergedIds][exists]=false&adresse[beginsWith][code_insee]=01,03,07,15,26,38,42,43,63,69,73,74');
  });

  it('should build url without departements', (): void => {
    const url: string = extractQueryString({
      duplicates: true
    });

    expect(url).toBe('and[mergedIds][exists]=false');
  });

  it('should build url without duplicates', (): void => {
    const url: string = extractQueryString({
      duplicates: false
    });

    expect(url).toBe('or[mergedIds][exists]=true&or[group][exists]=false');
  });
});
