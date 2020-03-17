import megHttp from '../../lib/index';

describe('test signature config', () => {
  beforeEach(() => {
    megHttp.reset();
  });

  test('origin response should be the response', async () => {
    const ret = await megHttp.httpPost('https://jsonplaceholder.typicode.com/users',
      { originData: 'test' },
      {
        isOriginResponse: true
      });

    expect(ret.request).not.toBeUndefined();
    expect(ret.status).not.toBeUndefined();
    expect(ret.statusText).not.toBeUndefined();
    expect(ret.config).not.toBeUndefined();
  });
});
