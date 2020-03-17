import megHttp from '../../lib/index';

describe('test signature config', () => {
  beforeEach(() => {
    megHttp.reset();
  });

  test('http signature should be get in response hooks', async () => {
    function beforeSend(config) {
      expect(config.signature.isCustom).toBe(true);
    }
    function afterResponse(response) {
      expect(response.signature.isCustom).toBe(true);
    }
    megHttp.set({
      hooks: {
        request: {
          beforeSend
        },
        response: {
          afterResponse
        }
      }
    });

    await megHttp.httpPost('https://jsonplaceholder.typicode.com/users',
      {},
      {
        signature: {
          isCustom: true
        }
      });
  });

  test('http signature should be get in response', async () => {
    const ret = await megHttp.httpPost('https://jsonplaceholder.typicode.com/users',
      {},
      {
        isOriginResponse: true,
        signature: {
          isCustom: true
        }
      });

    expect(ret.signature.isCustom).toBe(true);
  });
});
