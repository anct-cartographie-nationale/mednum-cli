import { fromMednumEnvironment } from './from-mednum-environement.transfer';
import { MednumProperties } from '../../cli';

describe('transfer mednum properties from mednum environment', (): void => {
  it('should transfer an empty environment', (): void => {
    const env: Record<string, string> = {};

    const mednumProperties: Partial<MednumProperties> = fromMednumEnvironment(env);

    expect(mednumProperties).toStrictEqual({});
  });

  it('should transfer a complete environment with organization id type', (): void => {
    const env: Record<string, string> = {
      DATA_GOUV_API_URL: 'https://demo.data.gouv.fr/api/1',
      DATA_GOUV_API_KEY:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.L8i6g3PfcHlioHCCPURC9pmXT7gdJpx3kOoyAfNUwCc',
      DATA_GOUV_REFERENCE_ID: '6ab51a168916556556ae156e',
      DATA_GOUV_REFERENCE_TYPE: 'organization'
    };

    const mednumProperties: Partial<MednumProperties> = fromMednumEnvironment(env);

    expect(mednumProperties).toStrictEqual({
      dataGouvApiUrl: 'https://demo.data.gouv.fr/api/1',
      dataGouvApiKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.L8i6g3PfcHlioHCCPURC9pmXT7gdJpx3kOoyAfNUwCc',
      dataGouvIdValue: '6ab51a168916556556ae156e',
      dataGouvIdType: "id d'organisation"
    });
  });

  it('should transfer a complete environment with owner id type', (): void => {
    const env: Record<string, string> = {
      DATA_GOUV_API_URL: 'https://demo.data.gouv.fr/api/1',
      DATA_GOUV_API_KEY:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.L8i6g3PfcHlioHCCPURC9pmXT7gdJpx3kOoyAfNUwCc',
      DATA_GOUV_REFERENCE_ID: '6ab51a168916556556ae156e',
      DATA_GOUV_REFERENCE_TYPE: 'owner'
    };

    const mednumProperties: Partial<MednumProperties> = fromMednumEnvironment(env);

    expect(mednumProperties).toStrictEqual({
      dataGouvApiUrl: 'https://demo.data.gouv.fr/api/1',
      dataGouvApiKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.L8i6g3PfcHlioHCCPURC9pmXT7gdJpx3kOoyAfNUwCc',
      dataGouvIdValue: '6ab51a168916556556ae156e',
      dataGouvIdType: "id d'utilisateur"
    });
  });

  it('should transfer a complete environment with wrong owner id type', (): void => {
    const env: Record<string, string> = {
      DATA_GOUV_API_URL: 'https://demo.data.gouv.fr/api/1',
      DATA_GOUV_API_KEY:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.L8i6g3PfcHlioHCCPURC9pmXT7gdJpx3kOoyAfNUwCc',
      DATA_GOUV_REFERENCE_ID: '6ab51a168916556556ae156e',
      DATA_GOUV_REFERENCE_TYPE: 'tst'
    };

    const mednumProperties: Partial<MednumProperties> = fromMednumEnvironment(env);

    expect(mednumProperties).toStrictEqual({
      dataGouvApiUrl: 'https://demo.data.gouv.fr/api/1',
      dataGouvApiKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.L8i6g3PfcHlioHCCPURC9pmXT7gdJpx3kOoyAfNUwCc',
      dataGouvIdValue: '6ab51a168916556556ae156e'
    });
  });
});
